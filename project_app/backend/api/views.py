import random
from datetime import datetime, timedelta
from decimal import Decimal
from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import MockBank, UserBankAccount, BankAccountTransaction

# Utility to generate realistic mock transactions for a new account
def generate_mock_transactions(account):
    categories = BankAccountTransaction.CATEGORIES
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=180) # 6 months of data
    
    current_date = start_date
    transactions = []
    
    # 1. Salary Credit (Monthly on 25th)
    salary_amount = Decimal(random.randint(12000, 24000))
    # 2. Freelance/Extra Credit (Occasional)
    freelance_amount = Decimal(random.randint(1500, 4500))
    # 3. Investments (Every 3 months)
    investment_amount = Decimal(random.randint(2000, 5000))
    
    # 4. Rent Debit (Monthly on 1st)
    rent_amount = Decimal(random.randint(2500, 4500))
    # 5. Car Loan Debit (Monthly on 5th)
    car_loan_amount = Decimal(random.randint(1200, 2200))
    # 6. Utilities Debit (Monthly on 10th)
    utilities_amount = Decimal(random.randint(250, 600))
    # 7. Subscriptions Debit (Monthly on 15th)
    subscription_amount = Decimal(random.randint(45, 150))

    while current_date <= end_date:
        # Salary Credit
        if current_date.day == 25:
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=salary_amount,
                description="إيداع راتب شهري - جهة العمل",
                transaction_type="credit",
                category="salary"
            ))
            
        # Rent Debit
        if current_date.day == 1:
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=rent_amount,
                description="سداد إيجار السكن الشهري",
                transaction_type="debit",
                category="rent"
            ))

        # Car Loan Debit
        if current_date.day == 5:
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=car_loan_amount,
                description="تمويل سيارة - البنك السعودي الممول",
                transaction_type="debit",
                category="car_loan"
            ))

        # Utilities Debit
        if current_date.day == 10:
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=utilities_amount + Decimal(random.randint(-50, 50)), # slightly variable
                description="فاتورة الشركة الوطنية للكهرباء",
                transaction_type="debit",
                category="utilities"
            ))

        # Subscriptions Debit
        if current_date.day == 15:
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=subscription_amount,
                description="اشتراك خدمات سحابية وترفيهية",
                transaction_type="debit",
                category="subscription"
            ))

        # Freelance Income (Randomly 1-2 times per month, but not every month)
        if current_date.day in [12, 28] and random.random() > 0.4:
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=freelance_amount + Decimal(random.randint(-300, 300)),
                description="مستحقات عمل حر وتصميم منصة",
                transaction_type="credit",
                category="freelance"
            ))

        # Investment Returns (Every 90 days roughly)
        if current_date.day == 18 and current_date.month in [1, 4, 7, 10]:
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=investment_amount,
                description="توزيع أرباح صناديق استثمارية",
                transaction_type="credit",
                category="investments"
            ))

        # Weekly Groceries (debit, roughly every 7 days)
        if current_date.weekday() == 4: # Friday
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=Decimal(random.randint(250, 750)),
                description="مشتريات أسواق ومواد غذائية (سوبرماركت)",
                transaction_type="debit",
                category="groceries"
            ))

        # Dining Out & Café (Random days, multiple times a week)
        if current_date.weekday() in [3, 4, 5] and random.random() > 0.5:
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=Decimal(random.randint(40, 220)),
                description="مطاعم ومقاهي وجبات سريعة",
                transaction_type="debit",
                category="dining"
            ))

        # Shopping & Other (Random)
        if random.random() > 0.85:
            transactions.append(BankAccountTransaction(
                account=account,
                date=current_date,
                amount=Decimal(random.randint(100, 1200)),
                description="تسوق عبر الإنترنت ومشتريات تجزئة",
                transaction_type="debit",
                category="shopping"
            ))
            
        current_date += timedelta(days=1)
        
    BankAccountTransaction.objects.bulk_create(transactions)


@api_view(['GET'])
def get_available_banks(request):
    """
    Get a list of all mock banks available to link.
    """
    banks = MockBank.objects.all()
    data = [{
        'id': bank.id,
        'name_ar': bank.name_ar,
        'name_en': bank.name_en,
        'code': bank.code,
        'logo_url': bank.logo_url,
        'color': bank.color
    } for bank in banks]
    return Response(data)


@api_view(['GET'])
def get_linked_accounts(request):
    """
    Get all linked user bank accounts.
    """
    accounts = UserBankAccount.objects.filter(status='active')
    data = [{
        'id': acc.id,
        'bank': {
            'id': acc.bank.id,
            'name_ar': acc.bank.name_ar,
            'name_en': acc.bank.name_en,
            'code': acc.bank.code,
            'logo_url': acc.bank.logo_url,
            'color': acc.bank.color
        },
        'account_number': acc.account_number,
        'iban': acc.iban,
        'balance': float(acc.balance),
        'account_type': acc.account_type,
        'label': acc.label,
        'linked_at': acc.linked_at
    } for acc in accounts]
    return Response(data)


@api_view(['POST'])
def link_bank_account(request):
    """
    Simulate linking a bank account using Open Banking flow.
    Expects bank_id.
    """
    bank_id = request.data.get('bank_id')
    if not bank_id:
        return Response({"error": "bank_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        bank = MockBank.objects.get(id=bank_id)
    except MockBank.DoesNotExist:
        return Response({"error": "Bank not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Generate random account details
    rand_acc_num = f"SA{random.randint(10, 99)} {random.randint(1000, 9999)} {random.randint(1000, 9999)} {random.randint(1000, 9999)} {random.randint(1000, 9999)}"
    rand_iban = f"SA{random.randint(10, 99)}00000000{random.randint(1000000000, 9999999999)}"
    initial_balance = Decimal(random.randint(15000, 65000))
    
    # Check if this bank already has a linked account (to simulate linking multiple, or we just create a new one anyway)
    # We allow linking multiple accounts, even in the same bank, to satisfy the requirement
    account = UserBankAccount.objects.create(
        bank=bank,
        account_number=rand_acc_num[-8:], # just last 8 digits for display
        iban=rand_iban,
        balance=initial_balance,
        account_type='checking',
        label=f"حساب {bank.name_ar} الرئيسي",
        status='active'
    )
    
    # Generate transactions for this newly created account
    generate_mock_transactions(account)
    
    return Response({
        "message": "Account linked successfully",
        "account_id": account.id,
        "balance": float(account.balance)
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def unlink_bank_account(request, account_id):
    """
    Unlink a bank account.
    """
    try:
        account = UserBankAccount.objects.get(id=account_id)
        # Delete the account and its transactions
        account.delete()
        return Response({"message": "Account unlinked successfully"}, status=status.HTTP_200_OK)
    except UserBankAccount.DoesNotExist:
        return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def sync_bank_account(request, account_id):
    """
    Sync/Refresh the bank account balance and fetch new mock transactions.
    """
    try:
        account = UserBankAccount.objects.get(id=account_id)
        # Randomly adjust balance slightly to simulate new transactions
        balance_change = Decimal(random.randint(-1500, 2000))
        account.balance += balance_change
        account.save()
        
        # Add one new mock transaction
        direction = 'credit' if balance_change > 0 else 'debit'
        category = 'shopping' if direction == 'debit' else 'freelance'
        desc = 'تسوق ومشتريات إضافية' if direction == 'debit' else 'إيداع إضافي'
        
        BankAccountTransaction.objects.create(
            account=account,
            date=timezone.now().date(),
            amount=abs(balance_change),
            description=desc,
            transaction_type=direction,
            category=category
        )
        
        return Response({
            "message": "Account synced successfully",
            "balance": float(account.balance)
        })
    except UserBankAccount.DoesNotExist:
        return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_financial_summary(request):
    """
    Calculate financial metrics dynamically based on transactions from all active linked accounts.
    If no accounts are linked, return empty values (or default mocks) to trigger CTA on frontend.
    """
    active_accounts = UserBankAccount.objects.filter(status='active')
    
    if not active_accounts.exists():
        return Response({
            "has_accounts": False,
            "total_balance": 0,
            "average_monthly_income": 0,
            "monthly_expenses": 0,
            "expected_surplus": 0,
            "score": 0,
            "score_label": "لا يوجد حسابات مربطة",
            "obligations": [],
            "expense_categories": []
        })

    # 1. Total Balance
    total_balance = active_accounts.aggregate(Sum('balance'))['balance__sum'] or Decimal(0)
    
    # Get all transactions for active accounts
    transactions = BankAccountTransaction.objects.filter(account__in=active_accounts)
    
    # Calculate averages over 6 months
    total_income_6m = transactions.filter(transaction_type='credit').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
    total_expense_6m = transactions.filter(transaction_type='debit').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
    
    average_monthly_income = total_income_6m / 6
    monthly_expenses = total_expense_6m / 6
    
    # 2. Extract Recurring Obligations (Rent, Car Loan, Utilities, Subscription)
    obligation_categories = ['rent', 'car_loan', 'utilities', 'subscription']
    obligations = []
    obligation_icons = {
        'rent': 'Home',
        'car_loan': 'Car',
        'utilities': 'Receipt',
        'subscription': 'Tv'
    }
    obligation_labels = {
        'rent': 'إيجار سكن',
        'car_loan': 'قسط سيارة',
        'utilities': 'فاتورة كهرباء/مياه',
        'subscription': 'اشتراك سحابي/ترفيهي'
    }
    
    total_obligations_monthly = Decimal(0)
    for cat in obligation_categories:
        cat_total = transactions.filter(category=cat).aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
        cat_monthly = cat_total / 6
        if cat_monthly > 0:
            total_obligations_monthly += cat_monthly
            obligations.append({
                'category': cat,
                'label': obligation_labels[cat],
                'amount': float(round(cat_monthly, 2)),
                'icon': obligation_icons[cat]
            })
            
    # Expected Surplus
    expected_surplus = average_monthly_income - monthly_expenses
    
    # 3. Expense breakdown by categories for pie chart
    expense_txs = transactions.filter(transaction_type='debit')
    total_debit = expense_txs.aggregate(Sum('amount'))['amount__sum'] or Decimal(1) # avoid div by zero
    
    expense_categories = []
    category_ar_labels = dict(BankAccountTransaction.CATEGORIES)
    
    # Group by category
    unique_debit_categories = expense_txs.values('category').annotate(total_amount=Sum('amount'))
    for item in unique_debit_categories:
        cat_name = item['category']
        cat_sum = item['total_amount'] or Decimal(0)
        percentage = (cat_sum / total_debit) * 100
        expense_categories.append({
            'category': cat_name,
            'label': category_ar_labels.get(cat_name, cat_name),
            'amount': float(cat_sum),
            'percentage': float(round(percentage, 1))
        })
        
    # Sort categories by percentage descending
    expense_categories = sorted(expense_categories, key=lambda x: x['percentage'], reverse=True)
    
    # 4. Financial Health Score (Simulated)
    # Based on Debt-to-Income (DTI) ratio
    # If DTI is high, score goes down.
    dti = (total_obligations_monthly / average_monthly_income) * 100 if average_monthly_income > 0 else Decimal(100)
    
    if dti <= 20:
        score = 88
        score_label = "ممتاز وآمن"
    elif dti <= 35:
        score = 72
        score_label = "مناسب بحذر"
    elif dti <= 50:
        score = 55
        score_label = "مخاطرة متوسطة"
    else:
        score = 35
        score_label = "مخاطرة عالية"

    # stability calculation (based on variance of monthly income)
    # since salary is stable, stability is generally high, e.g. 85%
    stability_score = 85 if average_monthly_income > 0 else 0

    return Response({
        "has_accounts": True,
        "total_balance": float(round(total_balance, 2)),
        "average_monthly_income": float(round(average_monthly_income, 2)),
        "monthly_expenses": float(round(monthly_expenses, 2)),
        "expected_surplus": float(round(expected_surplus, 2)),
        "score": score,
        "score_label": score_label,
        "stability_score": stability_score,
        "obligations": obligations,
        "expense_categories": expense_categories
    })


@api_view(['GET'])
def get_cash_flow_data(request):
    """
    Provide aggregated monthly cash flow (income vs expense) for the last 6 months.
    """
    active_accounts = UserBankAccount.objects.filter(status='active')
    if not active_accounts.exists():
        return Response([])
        
    # Group by month for the last 6 months
    today = timezone.now().date()
    months = []
    month_names_ar = {
        1: 'يناير', 2: 'فبراير', 3: 'مارس', 4: 'أبريل', 
        5: 'مايو', 6: 'يونيو', 7: 'يوليو', 8: 'أغسطس', 
        9: 'سبتمبر', 10: 'أكتوبر', 11: 'نوفمبر', 12: 'ديسمبر'
    }
    
    for i in range(5, -1, -1):
        # Calculate date range for the month
        # Subtracting i months from today
        first_day_of_curr_month = today.replace(day=1)
        # Find first day of target month
        target_month_date = first_day_of_curr_month
        for _ in range(i):
            # Go back to previous month
            target_month_date = (target_month_date - timedelta(days=1)).replace(day=1)
            
        start_of_month = target_month_date
        # End of month is day 1 of next month - 1 day
        next_month = (target_month_date + timedelta(days=32)).replace(day=1)
        end_of_month = next_month - timedelta(days=1)
        
        # Query sum
        monthly_txs = BankAccountTransaction.objects.filter(
            account__in=active_accounts,
            date__gte=start_of_month,
            date__lte=end_of_month
        )
        
        income = monthly_txs.filter(transaction_type='credit').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
        expense = monthly_txs.filter(transaction_type='debit').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
        
        months.append({
            "name": month_names_ar.get(start_of_month.month, start_of_month.strftime('%B')),
            "income": float(income),
            "expense": float(expense),
            "year": start_of_month.year,
            "month_num": start_of_month.month
        })
        
    return Response(months)
