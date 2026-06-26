# handles req and responses
from django.shortcuts import render
from .models import Expense

def expense_list(request):
    expenses = Expense.objects.all().order_by('-date')
    total = sum(e.amount for e in expenses)
    return render(request, 'expenses_app/expense_list.html', {
        'expenses': expenses,
        'total': total,
    })