# handles req and responses
from django.shortcuts import render , redirect
from .models import Expense
from .forms import ExpenseForm

def expense_list(request):
    expenses = Expense.objects.all().order_by('-date')
    total = sum(e.amount for e in expenses)
    return render(request, 'expenses_app/expense_list.html', {
        'expenses': expenses,
        'total': total,
    })
    
def add_expense(request):
    if request.method == 'POST':
        form = ExpenseForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('expense_list')
    else:
        form = ExpenseForm()
    return render(request, 'expenses_app/add_expense.html', {'form': form})