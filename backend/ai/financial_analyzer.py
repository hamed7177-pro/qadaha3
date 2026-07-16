from datetime import date, timedelta

from banking.models import Transaction

import statistics

MONTHS = 12


def calculate_financial_data(account):

    start_date = date.today() - timedelta(days=365)

    transactions = Transaction.objects.filter(
        account=account,
        date__gte=start_date
    )

    income = transactions.filter(transaction_type="INCOME")
    expenses = transactions.filter(transaction_type="EXPENSE")
    obligations = transactions.filter(transaction_type="OBLIGATION")

    total_income = sum(t.amount for t in income)
    total_expenses = sum(t.amount for t in expenses)
    total_obligations = sum(t.amount for t in obligations)

    avg_income = total_income / MONTHS
    avg_expenses = total_expenses / MONTHS
    avg_obligations = total_obligations / MONTHS

    surplus = avg_income - avg_expenses - avg_obligations

    obligation_ratio = (
        avg_obligations / avg_income
        if avg_income > 0 else 0
    )

    monthly_income = []

    for month in range(1, 13):
        month_total = sum(
            t.amount
            for t in income
            if t.date.month == month
        )
        monthly_income.append(month_total)
    if len(monthly_income) > 1:
        volatility = statistics.stdev(monthly_income)

    else:
        volatility = 0



    volatility_score = min(
        round(volatility / 100),
        100
    )

    monthly_surplus = []

    for month in range(1, 13):
        income_total = sum(
            t.amount
            for t in income
            if t.date.month == month
        )

        expense_total = sum(
            t.amount
            for t in expenses
            if t.date.month == month
        )

        obligation_total = sum(
            t.amount
            for t in obligations
            if t.date.month == month
        )

        monthly_surplus.append(
            income_total - expense_total - obligation_total
        )

    if len(monthly_surplus) > 1:
        surplus_std = statistics.stdev(monthly_surplus)
    else:
        surplus_std = 0

    cashflow_stability_score = max(
        0,
        min(100, 100 - round(surplus_std / 100))
    )

    return {
        "avg_income": avg_income,
        "avg_expenses": avg_expenses,
        "avg_obligations": avg_obligations,
        "avg_surplus": surplus,
        "obligation_ratio": obligation_ratio,
        "income_volatility": volatility_score,
        "cashflow_stability": cashflow_stability_score,
    }
