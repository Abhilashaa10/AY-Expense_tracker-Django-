from datetime import date
from decimal import Decimal
from django.contrib.auth.models import User
from expenses_app.models import Expense

user = User.objects.get(username="Abhilasha")

expenses = []

data = [
    # 2022
    ("Groceries", 1500, "food", date(2022, 1, 15), "Monthly groceries"),
    ("Bus Pass", 800, "transport", date(2022, 2, 10), "Monthly bus pass"),
    ("Electricity Bill", 1200, "utilities", date(2022, 3, 12), "Electricity bill"),
    ("Movie", 500, "entertainment", date(2022, 4, 18), "Movie with friends"),
    ("Rent", 12000, "rent", date(2022, 5, 1), "Monthly rent"),
    ("Dinner", 700, "food", date(2022, 6, 20), "Dinner"),
    ("Auto", 250, "transport", date(2022, 7, 8), "Auto fare"),
    ("Internet", 900, "utilities", date(2022, 8, 5), "Internet bill"),
    ("Shopping", 2200, "other", date(2022, 9, 14), "Clothes shopping"),
    ("Lunch", 450, "food", date(2022, 10, 11), "Lunch"),
    ("Rent", 12000, "rent", date(2022, 11, 1), "Monthly rent"),
    ("Concert", 1800, "entertainment", date(2022, 12, 22), "Concert ticket"),

    # 2023
    ("Groceries", 1800, "food", date(2023, 1, 15), "Monthly groceries"),
    ("Train Ticket", 650, "transport", date(2023, 2, 7), "Train journey"),
    ("Electricity", 1400, "utilities", date(2023, 3, 10), "Electricity bill"),
    ("Restaurant", 1200, "food", date(2023, 4, 16), "Restaurant dinner"),
    ("Rent", 13000, "rent", date(2023, 5, 1), "Monthly rent"),
    ("Netflix", 650, "entertainment", date(2023, 6, 5), "Subscription"),
    ("Cab", 500, "transport", date(2023, 7, 19), "Cab ride"),
    ("Groceries", 2100, "food", date(2023, 8, 14), "Groceries"),
    ("Internet", 950, "utilities", date(2023, 9, 5), "Internet bill"),
    ("Shopping", 3000, "other", date(2023, 10, 20), "Shopping"),
    ("Rent", 13000, "rent", date(2023, 11, 1), "Monthly rent"),
    ("Pizza", 800, "food", date(2023, 12, 24), "Pizza dinner"),

    # 2024
    ("Groceries", 2300, "food", date(2024, 1, 12), "Monthly groceries"),
    ("Metro", 900, "transport", date(2024, 2, 8), "Metro travel"),
    ("Electricity", 1600, "utilities", date(2024, 3, 15), "Electricity bill"),
    ("Movie", 700, "entertainment", date(2024, 4, 20), "Movie"),
    ("Rent", 14000, "rent", date(2024, 5, 1), "Monthly rent"),
    ("Dinner", 1100, "food", date(2024, 6, 18), "Dinner"),
    ("Cab", 600, "transport", date(2024, 7, 11), "Cab ride"),
    ("Internet", 1000, "utilities", date(2024, 8, 5), "Internet bill"),
    ("Clothes", 3500, "other", date(2024, 9, 16), "Clothes"),
    ("Groceries", 2500, "food", date(2024, 10, 13), "Groceries"),
    ("Rent", 14000, "rent", date(2024, 11, 1), "Monthly rent"),
    ("Gaming", 1500, "entertainment", date(2024, 12, 25), "Gaming purchase"),

    # 2025
    ("Groceries", 2700, "food", date(2025, 1, 15), "Monthly groceries"),
    ("Bus", 900, "transport", date(2025, 2, 10), "Bus travel"),
    ("Electricity", 1700, "utilities", date(2025, 3, 12), "Electricity bill"),
    ("Restaurant", 1500, "food", date(2025, 4, 18), "Restaurant"),
    ("Rent", 15000, "rent", date(2025, 5, 1), "Monthly rent"),
    ("Movie", 800, "entertainment", date(2025, 6, 20), "Movie"),
    ("Cab", 700, "transport", date(2025, 7, 8), "Cab ride"),
    ("Internet", 1100, "utilities", date(2025, 8, 5), "Internet bill"),
    ("Shopping", 4000, "other", date(2025, 9, 14), "Shopping"),
    ("Groceries", 2900, "food", date(2025, 10, 11), "Groceries"),
    ("Rent", 15000, "rent", date(2025, 11, 1), "Monthly rent"),
    ("Dinner", 1300, "food", date(2025, 12, 22), "Dinner"),

    # 2026
    ("Groceries", 3000, "food", date(2026, 1, 15), "Monthly groceries"),
    ("Metro", 1000, "transport", date(2026, 2, 10), "Metro travel"),
    ("Electricity", 1800, "utilities", date(2026, 3, 12), "Electricity bill"),
    ("Restaurant", 1600, "food", date(2026, 4, 18), "Restaurant"),
    ("Rent", 16000, "rent", date(2026, 5, 1), "Monthly rent"),
    ("Movie", 900, "entertainment", date(2026, 6, 20), "Movie"),
    ("Cab", 750, "transport", date(2026, 7, 8), "Cab ride"),
    ("Internet", 1200, "utilities", date(2026, 8, 5), "Internet bill"),
    ("Shopping", 4500, "other", date(2026, 9, 14), "Shopping"),
    ("Groceries", 3200, "food", date(2026, 10, 1), "Groceries"),
    
    ("Breakfast", 350, "food", date(2022, 3, 25), "Breakfast"),
    ("Auto Ride", 300, "transport", date(2023, 5, 22), "Auto ride"),
    ("Water Bill", 500, "utilities", date(2024, 2, 18), "Water bill"),
    ("Game Night", 1200, "entertainment", date(2024, 7, 25), "Game night"),
    ("Medicine", 900, "other", date(2025, 1, 28), "Medicine"),
    ("Coffee", 400, "food", date(2025, 3, 16), "Coffee"),
    ("Train Ticket", 850, "transport", date(2025, 6, 12), "Train ticket"),
    ("Water Bill", 550, "utilities", date(2025, 9, 18), "Water bill"),
    ("Birthday Dinner", 2000, "food", date(2026, 2, 14), "Birthday dinner"),
    ("OTT Subscription", 700, "entertainment", date(2026, 4, 10), "OTT subscription"),
    ("Clothes", 2800, "other", date(2026, 7, 20), "New clothes"),
    ("Lunch", 600, "food", date(2026, 9, 22), "Lunch"),
]

for title, amount, category, expense_date, note in data:
    expenses.append(
        Expense(
            user=user,
            title=title,
            amount=Decimal(str(amount)),
            category=category,
            date=expense_date,
            note=note
        )
    )

Expense.objects.bulk_create(expenses)

print(f"Added {len(expenses)} expenses for {user.username}")