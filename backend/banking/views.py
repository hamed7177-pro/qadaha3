from rest_framework import generics
from .models import BankAccount
from .serializers import BankAccountSerializer

class BankAccountListView(generics.ListAPIView):
    serializer_class = BankAccountSerializer

    def get_queryset(self):
        queryset = BankAccount.objects.all()
        user_id = self.request.query_params.get("user_id")
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset

from .models import Transaction
from .serializers import TransactionSerializer

class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        queryset = Transaction.objects.all()
        user_id = self.request.query_params.get("user_id")
        if user_id:
            queryset = queryset.filter(account__user_id=user_id)
        return queryset