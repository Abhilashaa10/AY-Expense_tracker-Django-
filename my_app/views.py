from django.http import HttpResponse
from .models import Expense

def expense_list(request):

    expenses = Expense.objects.all()

    if not expenses:
        return HttpResponse("No expenses found")

    output = ""

    for expense in expenses:
        output += f"{expense.title} - ₹{expense.amount} - {expense.category}<br>"

    return HttpResponse(output)