import os
import random
from datetime import date

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "qadaha.settings")

import django
django.setup()

from users.models import User
from banking.models import BankAccount, Transaction


Transaction.objects.all().delete()

profiles = [
    {
        "income": 18000,
        "expenses": 7000,
        "obligations": 1500
    },
    {
        "income": 12000,
        "expenses": 7000,
        "obligations": 3000
    },
    {
        "income": 9000,
        "expenses": 6500,
        "obligations": 2000
    },
    {
        "income": 6000,
        "expenses": 5000,
        "obligations": 2500
    },
    {
        "income": 25000,
        "expenses": 9000,
        "obligations": 2000
    },
    {
        "income": 10000,
        "expenses": 8000,
        "obligations": 1000
    },
]

users = User.objects.all().order_by("id")

for i, user in enumerate(users):

    account = BankAccount.objects.get(
        user=user,
        is_primary=True
    )

    profile = profiles[i % len(profiles)]

    for month in range(12):

        Transaction.objects.create(
            account=account,
            date=date(2026, month + 1, 1),
            transaction_type="INCOME",
            amount=profile["income"] + random.randint(-500, 500),
            description="Salary"
        )

        Transaction.objects.create(
            account=account,
            date=date(2026, month + 1, 2),
            transaction_type="OBLIGATION",
            amount=profile["obligations"],
            description="Loan Installment"
        )

        for _ in range(6):

            Transaction.objects.create(
                account=account,
                date=date(2026, month + 1, random.randint(3, 28)),
                transaction_type="EXPENSE",
                amount=random.randint(200, 1200),
                description="Daily Expense"
            )

print("Done")