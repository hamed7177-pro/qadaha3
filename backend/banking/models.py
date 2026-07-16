from django.db import models
from users.models import User

class BankAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    bank_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=50)

    current_balance = models.FloatField()
    monthly_income = models.FloatField()
    monthly_expenses = models.FloatField()
    monthly_obligations = models.FloatField()

    is_primary = models.BooleanField(default = True)

    def str(self):
        return f"{self.user.full_name} - {self.bank_name}"

class Transaction(models.Model):
    account = models.ForeignKey(BankAccount, on_delete=models.CASCADE)

    date = models.DateField()

    TRANSACTION_TYPES = [
        ("INCOME", "Income"),
        ("EXPENSE", "Expense"),
        ("OBLIGATION", "Obligation"),
    ]

    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES
    )

    amount = models.FloatField()

    description = models.CharField(
        max_length=255,
        blank=True
    )

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"