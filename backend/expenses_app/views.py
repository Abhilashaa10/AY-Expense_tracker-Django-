
import json
import os
import time

from google import genai
from google.genai import types

from django.db.models import Sum
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Expense
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



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def expense_agent(request):
    user_message = request.data.get('message', '').strip()

    if not user_message:
        return Response(
            {'reply': 'Please enter a message.'},
            status=400
        )

    def query_expenses(category: str = "", year: int = 0, month: int = 0) -> dict:
        """Query the authenticated user's expenses."""

        expenses = Expense.objects.filter(user=request.user)

        valid_categories = [
            "food", "transport", "rent",
            "utilities", "entertainment","shopping", "other"
        ]

        if category:
            category = category.lower().strip()

            if category not in valid_categories:
                return {"error": "Invalid expense category."}

            expenses = expenses.filter(category=category)

        if year:
            if year < 2000 or year > 9999:
                return {"error": "Invalid year."}
            expenses = expenses.filter(date__year=year)

        if month:
            if month < 1 or month > 12:
                return {"error": "Invalid month."}
            expenses = expenses.filter(date__month=month)

        total = expenses.aggregate(total=Sum("amount"))["total"] or 0

        return {
            "category": category or "all",
            "year": year or "all",
            "month": month or "all",
            "total_spent": str(total),
            "expense_count": expenses.count()
        }

    client = genai.Client(
        api_key=os.environ.get('GEMINI_API_KEY')
    )

    system_instruction = """

You are an AI assistant for a personal expense tracker.

For questions about expense totals, categories, years, or months,
use the query_expenses tool. Never invent totals.
The database is the source of truth.

Valid categories:
food, transport, rent, utilities, entertainment, shopping, other.

Categorize expenses based on the actual item or service:
- Shoes, clothes, bags, watches, and other retail purchases -> shopping
- Groceries, vegetables, fruits, and food items -> food
- Bus, train, taxi, fuel, and other travel costs -> transport
- House rent -> rent
- Electricity, water, internet, and gas bills -> utilities
- Movies, concerts, and recreational activities -> entertainment
- Use other only when no category fits.

DATE RULES:
- Never invent a date, month, or year.
- If the user provides a complete date, use that date.
- If the user provides only a year, preserve that year.
- If the date is incomplete, ask the user for the missing information.
- Never use a default date such as January 1.
- Never save an expense until the required date information is clear.

AMOUNT RULES:
- Extract the amount exactly as the user intended.
- If the amount is ambiguous, ask the user to clarify.

For a request to add an expense, use this format only
after all required information is clear:

<ADD_EXPENSE>
{"title": "Shoes", "amount": 2200, "category": "shopping", "date": "2026-10-09", "note": ""}
</ADD_EXPENSE>

The example above is only a format example. Never copy its values
unless they match the user's request.

Never claim an expense was saved unless Django confirms it.
Keep replies concise and use ₹ for Indian currency.
"""

    start_time = time.time()

    try:
        chat = client.chats.create(
            model='gemini-3.5-flash-lite',
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                tools=[query_expenses]
            )
        )

        start_time = time.time()
        response = chat.send_message(user_message)
        end_time = time.time()

        print(
            "Gemini response time:",
            round(end_time - start_time, 2),
            "seconds"
        )

        reply = (response.text or "").strip()
        print("AGENT REPLY:", reply)

    except Exception as e:
        print("GEMINI ERROR:", e)
        return Response(
            {
                'reply': 'Sorry, I could not process your request. Please try again.'
            },
            status=500
        )
        

    if '<ADD_EXPENSE>' in reply:
        try:
            start = reply.index('<ADD_EXPENSE>') + len('<ADD_EXPENSE>')
            end = reply.index('</ADD_EXPENSE>')

            expense_json = reply[start:end].strip()
            expense_data = json.loads(expense_json)

            serializer = ExpenseSerializer(data=expense_data)

            if serializer.is_valid():
                serializer.save(user=request.user)

                return Response({
                    'reply': (
                        f"Done! I've added ₹{expense_data['amount']} "
                        f"for {expense_data['title']} "
                        f"under {expense_data['category']}."
                    ),
                    'action': 'expense_added',
                    'expense': serializer.data
                })

            return Response({
                'reply': 'I could not add that expense. Please check the details.',
                'errors': serializer.errors
            }, status=400)

        except Exception as e:
            print("ADD EXPENSE ERROR:", e)
            return Response({
                'reply': 'I could not process that expense. Please try again.'
            }, status=400)

    return Response({'reply': reply})