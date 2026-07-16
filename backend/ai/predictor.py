import pandas as pd
from .model_loader import model


def create_user_profile(
    income,
    expenses,
    obligations,
    installment,
    volatility,
    stability
):
    total_obligations = obligations + installment
    surplus = income - expenses - total_obligations
    obligation_ratio = round(total_obligations / income, 2)

    return pd.DataFrame({
        "avg_monthly_income_6m": [income],
        "income_volatility_score": [volatility],
        "avg_monthly_expenses": [expenses],
        "monthly_obligations": [obligations],
        "ending_balance_avg": [surplus],
        "cashflow_stability_score": [stability],
        "proposed_installment_amount": [installment],
        "obligation_to_income_ratio": [obligation_ratio],
        "avg_monthly_surplus": [surplus]
    })

def get_recommendations(user, prediction):
    tips = []

    if prediction == "Suitable":
        tips.append("حافظ على استقرار دخلك الحالي")
        tips.append("تجنب زيادة الالتزامات الشهرية")

    elif prediction == "Suitable with Caution":

        if user["obligation_to_income_ratio"].values[0] > 0.4:
            tips.append("حاول تقليل الالتزامات الشهرية")

        if user["income_volatility_score"].values[0] > 50:
            tips.append("حاول زيادة استقرار الدخل")

        if user["avg_monthly_surplus"].values[0] < 1000:
            tips.append("حاول تقليل المصروفات وزيادة الادخار")

    else:
        tips.append("حسن استقرار دخلك")
        tips.append("زد الفائض الشهري")
        tips.append("يفضل تأجيل التمويل حتى يتحسن الوضع المالي")

    return tips


def get_reasons(user):
    reasons = []

    if user["obligation_to_income_ratio"].values[0] > 0.4:
        reasons.append("ارتفاع نسبة الالتزامات إلى الدخل")

    if user["income_volatility_score"].values[0] > 50:
        reasons.append("الدخل متذبذب")

    if user["cashflow_stability_score"].values[0] > 70:
        reasons.append("التدفق النقدي مستقر")

    if user["avg_monthly_surplus"].values[0] > 2000:
        reasons.append("يوجد فائض شهري جيد")

    return reasons

def predict_user(
    income,
    expenses,
    obligations,
    installment,
    volatility,
    stability
):
    user = create_user_profile(
        income,
        expenses,
        obligations,
        installment,
        volatility,
        stability
    )

    prediction = model.predict(user)[0]
    confidence = max(model.predict_proba(user)[0])

    surplus_score = min(max(user["avg_monthly_surplus"].values[0] / 5000, 0), 1)
    stability_score = min(max(user["cashflow_stability_score"].values[0] / 100, 0), 1)

    obligation_score = 1 - min(
        max(user["obligation_to_income_ratio"].values[0] / 0.6, 0),
        1
    )

    class_weights = {
        "Not Suitable": 0.0,
        "Suitable with Caution": 0.5,
        "Suitable": 1.0
    }

    base_score = class_weights.get(prediction, 0)

    score = (
        0.40 * base_score +
        0.30 * confidence +
        0.10 * surplus_score +
        0.10 * stability_score +
        0.10 * obligation_score
    )

    qadaha_score = round(min(score * 97, 97), 1)

    if qadaha_score >= 80:
        risk = "🟢 مخاطرة منخفضة"
    elif qadaha_score >= 50:
        risk = "🟡 مخاطرة متوسطة"
    else:
        risk = "🔴 مخاطرة عالية"

    reasons = get_reasons(user)
    recommendations = get_recommendations(user, prediction)

    return {
        "prediction": prediction,
        "confidence": round(float(confidence * 100), 2),
        "qadaha_score": qadaha_score,
        "risk_level": risk,
        "reasons": reasons,
        "recommendations": recommendations
    }