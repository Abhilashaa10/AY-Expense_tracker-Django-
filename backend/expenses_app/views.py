from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Expense
from django.db.models import Sum
from .serializers import ExpenseSerializer, RegisterSerializer


@api_view(['GET', 'POST'])
def expense_list(request):
    if request.method == 'GET':
        expenses = Expense.objects.filter(user=request.user).order_by('-date')

        category = request.GET.get('category')
        date = request.GET.get('date')

        if category:
            expenses = expenses.filter(category=category)
        if date:
            expenses = expenses.filter(date=date)

        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def expense_detail(request, pk):
    expense = get_object_or_404(Expense, pk=pk, user=request.user)

    if request.method == 'GET':
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExpenseSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from google import genai
import json
import os
from datetime import date

@api_view(['POST'])
def expense_agent(request):
    user_message = request.data.get('message', '')

    # 1. TOTAL SPENDING

    total_spent = Expense.objects.filter(
        user=request.user
    ).aggregate(
        total=Sum('amount')
    )['total'] or 0

    # 2. SPENDING BY CATEGORY

    category_totals = Expense.objects.filter(
        user=request.user
    ).values(
        'category'
    ).annotate(
        total=Sum('amount')
    ).order_by('-total')

    category_totals = list(category_totals)

    # 3. SPENDING BY YEAR

    year_totals = Expense.objects.filter(
        user=request.user
    ).values(
        'date__year'
    ).annotate(
        total=Sum('amount')
    ).order_by('date__year')

    year_totals = list(year_totals)

    # 4. SPENDING BY MONTH

    month_totals = Expense.objects.filter(
        user=request.user
    ).values(
        'date__year',
        'date__month'
    ).annotate(
        total=Sum('amount')
    ).order_by(
        'date__year',
        'date__month'
    )

    month_totals = list(month_totals)

    # 5. SPENDING BY YEAR + CATEGORY

    year_category_totals = Expense.objects.filter(
        user=request.user
    ).values(
        'date__year',
        'category'
    ).annotate(
        total=Sum('amount')
    ).order_by(
        'date__year',
        'category'
    )

    year_category_totals = list(year_category_totals)

    # 6. TOP 10 BIGGEST EXPENSES

    top_expenses = Expense.objects.filter(
        user=request.user
    ).order_by('-amount')[:10]

    top_expenses_data = ExpenseSerializer(
        top_expenses,
        many=True
    ).data

    # 7. NUMBER OF EXPENSES

    expense_count = Expense.objects.filter(
        user=request.user
    ).count()

    # 8. PRINT RESULTS

    print("TOTAL SPENT:", total_spent)
    print("CATEGORY TOTALS:", category_totals)
    print("YEAR TOTALS:", year_totals)
    print("MONTH TOTALS:", month_totals)
    print("YEAR + CATEGORY TOTALS:", year_category_totals)
    print("TOP EXPENSES:", top_expenses_data)
    print("EXPENSE COUNT:", expense_count)

    # 9. BUILD CONTEXT FOR GEMINI

    context = f"""
You are a personal finance AI assistant.

The exact calculations below were done by Django from the database.

Use these numbers as the source of truth.
Do not calculate totals yourself.

TOTAL SPENDING:
₹{total_spent}

NUMBER OF EXPENSES:
{expense_count}

SPENDING BY CATEGORY:
{json.dumps(
    [
        {
            'category': item['category'],
            'total': float(item['total'])
        }
        for item in category_totals
    ],
    indent=2
)}

SPENDING BY YEAR:
{json.dumps(
    [
        {
            'year': item['date__year'],
            'total': float(item['total'])
        }
        for item in year_totals
    ],
    indent=2
)}

SPENDING BY MONTH:
{json.dumps(
    [
        {
            'year': item['date__year'],
            'month': item['date__month'],
            'total': float(item['total'])
        }
        for item in month_totals
    ],
    indent=2
)}

SPENDING BY YEAR AND CATEGORY:
{json.dumps(
    [
        {
            'year': item['date__year'],
            'category': item['category'],
            'total': float(item['total'])
        }
        for item in year_category_totals
    ],
    indent=2
)}

TOP 10 BIGGEST EXPENSES:
{json.dumps(top_expenses_data, indent=2)}

You can answer questions about:

- Total spending
- Category spending
- Yearly spending
- Monthly spending
- Spending by year and category
- Biggest expenses
- Number of expenses
- Spending comparisons
- Financial patterns
- Simple financial advice

When answering questions about the biggest expenses,
use the TOP 10 BIGGEST EXPENSES data above.

When answering questions about totals,
use the exact Django calculations above.

Do not say that you cannot see individual expenses,
because the TOP 10 BIGGEST EXPENSES data is provided.

When adding an expense, respond with:

<ADD_EXPENSE>
{{"title": "...", "amount": 0, "category": "...", "date": "...", "note": ""}}
</ADD_EXPENSE>

For normal questions, answer in 2-3 simple sentences.

Use ₹ for currency.
"""

    # 10. CONFIGURE GEMINI
    client = genai.Client(
        api_key=os.environ.get('GEMINI_API_KEY')
    )

    # 11. SEND REQUEST TO GEMINI

    import time

    start_time = time.time()

    response = client.models.generate_content(
        model='gemini-3.5-flash-lite',
        contents=f"{context}\n\nUser: {user_message}"
    )

    end_time = time.time()

    print(
        "Gemini response time:",
        end_time - start_time,
        "seconds"
    )

    reply = response.text.strip()

    # 12. CHECK IF GEMINI WANTS TO ADD EXPENSE

    if '<ADD_EXPENSE>' in reply:
        try:
            start = reply.index('<ADD_EXPENSE>') + len('<ADD_EXPENSE>')
            end = reply.index('</ADD_EXPENSE>')

            expense_json = reply[start:end].strip()
            expense_data = json.loads(expense_json)

            # 13. SAVE NEW EXPENSE

            serializer = ExpenseSerializer(
                data=expense_data
            )

            if serializer.is_valid():
                serializer.save(
                    user=request.user
                )

                return Response({
                    'reply': (
                        f"Done! I've added ₹{expense_data['amount']} "
                        f"for {expense_data['title']} "
                        f"under {expense_data['category']}."
                    ),
                    'action': 'expense_added',
                    'expense': serializer.data
                })

        except Exception as e:
            print("ADD EXPENSE ERROR:", e)

            return Response({
                'reply': (
                    'I understood you want to add an expense '
                    'but had trouble parsing it. Could you try again?'
                )
            })

    # 14. NORMAL RESPONSE

    return Response({
        'reply': reply
    })
