from django.urls import path
from .views import BankAccountListView, TransactionListView

urlpatterns = [
    path("accounts/", BankAccountListView.as_view(), name="accounts-list"),
    path("transactions/", TransactionListView.as_view(), name="transactions-list"),
]