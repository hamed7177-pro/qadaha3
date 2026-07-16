from rest_framework.decorators import api_view
from rest_framework.response import Response
from .financial_analyzer import calculate_financial_data

from users.models import User
from banking.models import BankAccount

from .predictor import predict_user


@api_view(["GET"])
def predict(request):

    user_id = request.GET.get("user_id")

    if not user_id:
        return Response({
            "error": "user_id is required"
        }, status=400)

    try:
        user = User.objects.get(id=user_id)
        account = BankAccount.objects.get(user=user, is_primary = True)
        financial_data = calculate_financial_data(account)

    except User.DoesNotExist:
        return Response({
            "error": "User not found"
        }, status=404)

    except BankAccount.DoesNotExist:
        return Response({
            "error": "Bank account not found"
        }, status=404)

    result = predict_user(
        income=financial_data["avg_income"],
        expenses=financial_data["avg_expenses"],
        obligations=financial_data["avg_obligations"],
        installment=financial_data["avg_obligations"],
        volatility=financial_data["income_volatility"],
        stability=financial_data["cashflow_stability"],
    )

    result["user"] = user.full_name

    return Response(result)