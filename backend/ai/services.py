from users.models import User
from banking.models import BankAccount, Transaction

def get_user_transactions(user_id):

    user = User.objects.get(id=user_id)

    account = BankAccount.objects.get(user=user)

    transactions = Transaction.objects.filter(account=account)

    return transactions

import pandas as pd
from django.db.models import Avg, Sum
from users.models import User
from banking.models import BankAccount, Transaction


def calculate_features(user_id):

    user = User.objects.get(id=user_id)
    account = BankAccount.objects.get(user=user)

    transactions = Transaction.objects.filter(account=account)

    income = transactions.filter(
        transaction_type="INCOME"
    ).aggregate(total=Sum("amount"))["total"] or 0

    expenses = transactions.filter(
        transaction_type="EXPENSE"
    ).aggregate(total=Sum("amount"))["total"] or 0

    obligations = transactions.filter(
        transaction_type="OBLIGATION"
    ).aggregate(total=Sum("amount"))["total"] or 0

    surplus = income - expenses - obligations

    obligation_ratio = (
        obligations / income if income > 0 else 0
    )

    features = pd.DataFrame({
        "avg_monthly_income_6m": [income],
        "income_volatility_score": [15],          # مؤقتًا
        "avg_monthly_expenses": [expenses],
        "monthly_obligations": [obligations],
        "ending_balance_avg": [account.current_balance],
        "cashflow_stability_score": [90],         # مؤقتًا
        "proposed_installment_amount": [0],       # سيأتي من طلب التمويل
        "obligation_to_income_ratio": [obligation_ratio],
        "avg_monthly_surplus": [surplus]
    })

    return features