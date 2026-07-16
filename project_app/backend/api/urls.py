from django.urls import path
from . import views

urlpatterns = [
    path('banks/', views.get_available_banks, name='get_available_banks'),
    path('accounts/', views.get_linked_accounts, name='get_linked_accounts'),
    path('accounts/link/', views.link_bank_account, name='link_bank_account'),
    path('accounts/<int:account_id>/unlink/', views.unlink_bank_account, name='unlink_bank_account'),
    path('accounts/<int:account_id>/sync/', views.sync_bank_account, name='sync_bank_account'),
    path('financial-summary/', views.get_financial_summary, name='get_financial_summary'),
    path('cash-flow-data/', views.get_cash_flow_data, name='get_cash_flow_data'),
]
