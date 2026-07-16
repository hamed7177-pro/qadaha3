from rest_framework import generics
from .models import BankAccount
from .serializers import BankAccountSerializer

class BankAccountListView(generics.ListAPIView):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer

from .models import Transaction
from .serializers import TransactionSerializer

class TransactionListView(generics.ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer