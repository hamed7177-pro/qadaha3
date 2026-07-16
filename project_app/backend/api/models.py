from django.db import models

class MockBank(models.Model):
    name_ar = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    logo_url = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=50, default="#000000")

    def __str__(self):
        return self.name_ar

class UserBankAccount(models.Model):
    ACCOUNT_TYPES = [
        ('checking', 'Checking'),
        ('savings', 'Savings'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    bank = models.ForeignKey(MockBank, on_delete=models.CASCADE, related_name='accounts')
    account_number = models.CharField(max_length=50)
    iban = models.CharField(max_length=50)
    balance = models.DecimalField(max_digits=12, decimal_places=2)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES, default='checking')
    label = models.CharField(max_length=100, default='حساب جارٍ')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    linked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bank.name_ar} - {self.account_number}"

class BankAccountTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('credit', 'Credit (دائن/دخل)'),
        ('debit', 'Debit (مدين/مصروف)'),
    ]
    CATEGORIES = [
        ('salary', 'راتب أساسي'),
        ('freelance', 'عمل حر'),
        ('investments', 'عوائد استثمار'),
        ('rent', 'إيجار سكن'),
        ('car_loan', 'تمويل سيارة'),
        ('utilities', 'فاتورة كهرباء/مياه'),
        ('subscription', 'اشتراك سحابي/ترفيهي'),
        ('groceries', 'بقالة ومعيشة'),
        ('shopping', 'تسوق/أخرى'),
        ('dining', 'مطاعم وكافيهات'),
    ]

    account = models.ForeignKey(UserBankAccount, on_delete=models.CASCADE, related_name='transactions')
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=30, choices=CATEGORIES)

    def __str__(self):
        return f"{self.date} - {self.description} ({self.amount})"
