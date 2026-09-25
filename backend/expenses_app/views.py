from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
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



import google.generativeai as genai
import json
import os
from datetime import date

@api_view(['POST'])
def expense_agent(request):
    user_message = request.data.get('message', '')
    
    # Get user's expenses to give context to the AI
    expenses = Expense.objects.filter(user=request.user).order_by('-date')[:50]
    serializer = ExpenseSerializer(expenses, many=True)
    expenses_data = serializer.data
    
    # Calculate totals by category for context
    category_totals = {}
    total_spent = 0
    for expense in expenses:
        cat = expense.category
        amount = float(expense.amount)
        category_totals[cat] = category_totals.get(cat, 0) + amount
        total_spent += amount

    # Build context string for Gemini
    context = f"""
You are a personal finance AI assistant for an expense tracker app. 
Today's date is {date.today()}.

The user's recent expenses (last 50):
{json.dumps(expenses_data, indent=2)}

Total spent overall: ₹{total_spent:.2f}
Spending by category: {json.dumps(category_totals, indent=2)}

You can help the user by:
1. ADDING an expense - if user says something like "spent 500 on food today" or "add 200 for transport"
2. QUERYING data - if user asks "how much did I spend?" or "what's my total?"
3. GIVING ADVICE - if user asks for suggestions or advice
4. WARNING about overspending - if a category seems unusually high

When you need to ADD an expense, respond with a JSON block like this (and nothing else before or after the JSON):
<ADD_EXPENSE>
{{"title": "lunch", "amount": 500, "category": "food", "date": "{date.today()}", "note": ""}}
</ADD_EXPENSE>

For all other responses, just reply in plain conversational text in 2-3 sentences max.
Be friendly, concise, and use ₹ for currency.
"""

    # Configure Gemini
    genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
    model = genai.GenerativeModel('gemini-3.8-flash')
    
    response = model.generate_content(
        f"{context}\n\nUser: {user_message}"
        )

    reply = response.text.strip()
    
    # Check if Gemini wants to add an expense
    if '<ADD_EXPENSE>' in reply:
        try:
            start = reply.index('<ADD_EXPENSE>') + len('<ADD_EXPENSE>')
            end = reply.index('</ADD_EXPENSE>')
            expense_json = reply[start:end].strip()
            expense_data = json.loads(expense_json)
            
            # Save the expense
            serializer = ExpenseSerializer(data=expense_data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response({
                    'reply': f"Done! I've added ₹{expense_data['amount']} for {expense_data['title']} under {expense_data['category']}.",
                    'action': 'expense_added',
                    'expense': serializer.data
                })
        except Exception as e:
            return Response({'reply': 'I understood you want to add an expense but had trouble parsing it. Could you try again?'})
    
    return Response({'reply': reply})