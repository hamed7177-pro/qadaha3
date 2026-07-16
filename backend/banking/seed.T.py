from banking.models import BankAccount, Transaction
from datetime import date, timedelta

for account in BankAccount.objects.all():
    Transaction.objects.create(
        account=account,
        date=date.today(),
        transaction_type="INCOME",
        amount=8000,
        description="Monthly Salary"
    )

    Transaction.objects.create(
        account=account,
        date=date.today() - timedelta(days=3),
        transaction_type="EXPENSE",
        amount=2500,
        description="Shopping"
    )

    Transaction.objects.create(
        account=account,
        date=date.today() - timedelta(days=7),
        transaction_type="OBLIGATION",
        amount=1200,
        description="Loan Payment"
    )