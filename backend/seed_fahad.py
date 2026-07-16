import os
from datetime import date

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "qadaha.settings")

import django
django.setup()

from users.models import User
from banking.models import BankAccount, Transaction

# Delete existing Fahad if any
User.objects.filter(national_id="1020304050").delete()

user = User.objects.create(
    full_name="Fahad Al-Otaibi",
    national_id="1020304050",
    phone="0501234567",
    email="fahad@example.com"
)

account = BankAccount.objects.create(
    user=user,
    bank_name="مصرف الإنماء (حساب الراتب والأعمال المستقلة)",
    account_number="SA93 0500 0000 1234 5678 9012",
    current_balance=14850.0,
    monthly_income=11800.0,
    monthly_expenses=4950.0,
    monthly_obligations=3200.0,
    is_primary=True
)

incomes = [
    12500, 11000, 9500, 14000, 11800, 10500,
    13200, 8900, 12000, 11500, 14200, 12500
]

expenses = [
    5100, 4800, 4500, 5200, 4950, 4700,
    5300, 4400, 5000, 4800, 5400, 5100
]

for month in range(12):
    m = month + 1
    # Income transaction
    Transaction.objects.create(
        account=account,
        date=date(2026, m, 1),
        transaction_type="INCOME",
        amount=incomes[month],
        description="دخل مشروع مستقل - دفعة عميل"
    )
    # Obligation transaction
    Transaction.objects.create(
        account=account,
        date=date(2026, m, 5),
        transaction_type="OBLIGATION",
        amount=3200.0,
        description="تمويل سيارة تأجيري - مصرف الإنماء"
    )
    # Expense transaction
    Transaction.objects.create(
        account=account,
        date=date(2026, m, 15),
        transaction_type="EXPENSE",
        amount=expenses[month],
        description="مصاريف معيشية وفواتير"
    )

print(f"Successfully seeded Fahad Al-Otaibi with ID {user.id}")
