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

    installment_str = request.GET.get("installment")
    if installment_str:
        try:
            installment = float(installment_str)
        except ValueError:
            installment = 1200.0
    else:
        installment = 1200.0

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
        installment=installment,
        volatility=financial_data["income_volatility"],
        stability=financial_data["cashflow_stability"],
    )

    result["user"] = {
        "id": user.id,
        "full_name": user.full_name,
        "phone": user.phone,
        "email": user.email,
        "role": "مصمم مستقل" if user.id == 7 else "موظف قطاع خاص"  # Seeded user role mapping
    }
    result["financials"] = financial_data

    return Response(result)