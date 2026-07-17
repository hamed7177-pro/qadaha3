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

    from users.serializers import UserSerializer
    
    result["user"] = {
        "id": user.id,
        "full_name": user.full_name,
        "phone": user.phone,
        "email": user.email,
        "role": UserSerializer(user).data.get("role", "عمل حر")
    }
    result["financials"] = financial_data

    return Response(result)


@api_view(["POST"])
def chat(request):
    import os
    import json
    import urllib.request

    try:
        data = request.data
        message = data.get("message")
        history = data.get("history", [])

        if not message:
            return Response({"error": "Message is required"}, status=400)

        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            # Fallback response if API key is not configured
            fallback_text = (
                "مرحباً بك! مستشار قدها هنا لمساعدتك. (ملاحظة: واجهنا صعوبة في الاتصال بمحرك الذكاء الاصطناعي بسبب عدم تهيئة مفتاح GEMINI_API_KEY، ولكن يمكنك استخدام النظام التفاعلي ومحاكي الملاءة في المنصة لتجربة كاملة).\n\n"
                "نصيحتي لك: مؤشر ملاءتك الحالي بحاجة لتحسين، أنصحك بالتالي لرفع المؤشر إلى +81:\n"
                "1. تقليل فوري للمصاريف غير الضرورية بنسبة 15%.\n"
                "2. ادخار فائض مالي لبناء احتياطي طوارئ بقيمة 5,000 ر.س.\n"
                "3. التفكير في تقليل القسط المستهدف."
            )
            return Response({"reply": fallback_text})

        # Call Gemini API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

        contents = []
        for msg in history:
            role = "user" if msg.get("sender") == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg.get("text")}]
            })

        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })

        system_instruction = (
            "أنت 'مستشار قدها المالي الذكي' - مساعد ذكاء اصطناعي تفاعلي لمنصة 'قدها' (منصة ملاءة مالية سعودية مبنية على المصرفية المفتوحة).\n"
            "منصة 'قدها' تساعد أصحاب الدخل غير المنتظم مثل المصممين المستقلين والمستقلين وأصحاب المشاريع الناشئة والعمل الحر على تقييم قدرتهم المالية والملاءة قبل التقديم على تمويل أو تقسيط.\n\n"
            "تتحدث باللغة العربية بأسلوب مهني، مطمئن، ذكي، سعودي، ومحفز.\n"
            "قدم نصائح عملية بناءً على تساؤلات المستخدم:\n"
            "1. كيفية تحسين مؤشر قدها (مثل خفض المصاريف المتغيرة بنسبة 15%، بناء صندوق طوارئ واحتياطي بقيمة 5,000 ريال، تأجيل الالتزام الجديد لشهرين أو تخفيض القسط إلى 900 ريال بدلاً من 1,200 ريال).\n"
            "2. شرح أن تقرير قدها هو 'تحليل ملاءة داعم' مبني على التدفقات النقدية والعمليات الفعلية وليس تقريراً ائتمانياً رسمياً (مثل سمة)، مما يحمي خصوصية كشف الحساب بمشاركة الملخص فقط.\n"
            "3. التحدث بنبرة ودية ومشجعة جداً للأعمال الحرة والشباب الطموح في المملكة متوافقاً مع أهداف رؤية 2030 وتطوير قطاع التقنية المالية بالتعاون مع بنك الإنماء وأكاديمية طويق.\n\n"
            "أجب باختصار وبشكل منظم وبنقاط سريعة وسهلة القراءة وموجهة مباشرة لسؤال المستخدم."
        )

        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "generationConfig": {
                "temperature": 0.7
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            candidates = res_data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    reply_text = parts[0].get("text", "")
                    return Response({"reply": reply_text})

            return Response({"reply": "عذراً، لم أستطع الحصول على رد مناسب."})

    except Exception as e:
        print("Error with Gemini API in Django:", e)
        fallback_text = (
            "مرحباً بك! مستشار قدها هنا لمساعدتك. (ملاحظة: واجهنا صعوبة في الاتصال بمحرك الذكاء الاصطناعي، ولكن يمكنك استخدام النظام التفاعلي ومحاكي الملاءة في المنصة لتجربة كاملة).\n\n"
            "نصيحتي لك: مؤشر ملاءتك الحالي بحاجة لتحسين، أنصحك بالتالي لرفع المؤشر إلى +81:\n"
            "1. تقليل فوري للمصاريف غير الضرورية بنسبة 15%.\n"
            "2. ادخار فائض مالي لبناء احتياطي طوارئ بقيمة 5,000 ر.س.\n"
            "3. التفكير في تقليل القسط المستهدف."
        )
        return Response({"reply": fallback_text})