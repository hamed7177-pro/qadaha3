# ⚖️ منصة قَدّها للملاءة المالية | Qadha FinTech Platform

<div align="center">
  <p align="center">
    <strong>منصة تقنية مالية (FinTech) مدعومة بالذكاء الاصطناعي والمصرفية المفتوحة لتقييم الملاءة المالية وإصدار شهادات الالتزام الرقمية.</strong>
  </p>
  <p align="center">
    <a href="https://qadaha3-ot8e.vercel.app"><b>🌐 رابط الموقع (Live Demo)</b></a> | 
    <a href="https://qadaha3-one.vercel.app/api/users/"><b>🔗 رابط الـ API (Base Endpoint)</b></a>
  </p>
</div>

---

## 📌 جدول المحتويات / Table of Contents
- [العربية (Arabic)](#-منصة-قدها-قيد-التطوير)
  - [نبذة عن المشروع](#نبذة-عن-المشروع)
  - [الميزات الرئيسية](#الميزات-الرئيسية)
  - [بنية النظام والتقنيات المستخدمة](#بنية-النظام-والتقنيات-المستخدمة)
  - [مسارات واجهة برمجيات التطبيق (API Endpoints)](#مسارات-واجهة-برمجيات-التطبيق-api-endpoints)
- [English](#-qadha-fintech-platform)
  - [Project Overview](#project-overview)
  - [Key Features](#key-features)
  - [System Architecture & Tech Stack](#system-architecture--tech-stack)
  - [API Endpoints](#api-endpoints)
- [دليل التشغيل المحلي / Local Setup Guide](#-دليل-التشغيل-المحلي--local-setup-guide)
  - [تشغيل الخلفية (Django Backend)](#1-تشغيل-الخلفية-django-backend)
  - [تشغيل الواجهة الأمامية (React Frontend)](#2-تشغيل-الواجهة-الأمامية-react-frontend)

---

## 🇸🇦 منصة قَدّها (قيد التطوير)

### نبذة عن المشروع
**قَدّها (Qadha)** هي منصة تقنية مالية مبتكرة تم تصميمها لمساعدة أصحاب الدخل غير المنتظم مثل المستقلين (Freelancers)، المصممين، وأصحاب العمل الحر على تقييم قدرتهم وملاءتهم المالية قبل التقدم بطلب للحصول على تمويل أو تقسيط. 
تعتمد المنصة على تقنيات **المصرفية المفتوحة (Open Banking)** لمحاكاة قراءة الحسابات البنكية وتحليل المعاملات المالية، وتستخدم **نموذج تعلم آلي (Machine Learning)** لتقييم الملاءة وتقدير نسبة المخاطر وإصدار **شهادة ملاءة رقمية** قابلة للتحقق من الجهات التمويلية.

---

### الميزات الرئيسية
1. **ربط المصرفية المفتوحة (Open Banking Integration)**: محاكاة ربط الحساب البنكي والتحقق الآمن من الهوية الوطنية والموافقة على مشاركة البيانات.
2. **لوحة معلومات مالية تفاعلية (Financial Dashboard)**: عرض تحليلي لمتوسط الدخل الشهري، المصروفات، الالتزامات المالية، ومستوى التذبذب المالي.
3. **تقييم الملاءة بالذكاء الاصطناعي (AI Solvency Predictor)**: حساب مؤشر "قَدّها" (Qadha Score) بالاعتماد على خوارزميات التعلم الآلي لتقدير الملاءة (مخاطر منخفضة 🟢، متوسطة 🟡، عالية 🔴).
4. **المستشار المالي الذكي (Gemini Financial Assistant)**: نظام محادثة تفاعلي مدعوم بنموذج `gemini-3.5-flash` لتقديم نصائح وتوصيات مخصصة للمستخدم لرفع كفاءته المالية.
5. **شهادة الالتزام الرقمية (Digital Solvency Certificate)**: توليد شهادة إلكترونية تحتوي على رمز تحقق فريد (Verification ID) وحالة الشهادة.
6. **بوابة التحقق للجهات التمويلية (Funder Verification Portal)**: شاشة مخصصة للبنوك والجهات التمويلية للتحقق من صحة وصلاحية شهادات الملاءة الصادرة.
7. **دعم كامل للغة العربية (RTL Support)**: واجهة مستخدم حديثة ومصممة بأحدث معايير تجربة المستخدم (UX/UI) مع دعم كامل للاتجاه من اليمين إلى اليسار.

---

### بنية النظام والتقنيات المستخدمة

#### الواجهة الأمامية (App)
- **الإطار**: React 19 (بإدارة Vite 6)
- **التصميم**: Tailwind CSS v4 مع دعم كامل للاتجاهات وحركات تفاعلية سلسة باستخدام Motion.
- **الخادم المحيط**: Express Server (مكتوب بلغة TypeScript) لتوجيه المسارات والتعامل الآمن مع واجهات Gemini API كوكيل (Proxy) للخلفية.
- **تكامل الذكاء الاصطناعي**: مكتبة `@google/genai` للربط بنموذج `gemini-3.5-flash`.

#### الواجهة الخلفية (Backend)
- **الإطار**: Django 6.0 & Django REST Framework (DRF)
- **قاعدة البيانات**: SQLite (لتخزين بيانات المستخدمين والمعاملات البنكية المحاكاة).
- **التعلم الآلي (ML)**: نموذج مبني باستخدام مكتبة Scikit-Learn ومحفوظ بصيغة `.pkl` عبر `joblib` للتنبؤ بالأهلية والملاءة المالية بناءً على المدخلات المالية الفعلية.

---

### مسارات واجهة برمجيات التطبيق (API Endpoints)
تتوفر واجهة برمجة التطبيقات على الرابط: `https://qadaha3-one.vercel.app`

| المسار (Endpoint) | طريقة الطلب (Method) | الوصف |
| :--- | :---: | :--- |
| `/api/users/` | `GET` | استرجاع قائمة المستخدمين المسجلين في النظام. |
| `/api/accounts/` | `GET` | استرجاع قائمة الحسابات البنكية المرتبطة وتفاصيلها. |
| `/api/transactions/` | `GET` | عرض كشوف الحساب والعمليات المالية (دخل، مصروفات، التزامات). |
| `/api/predict/` | `GET` | استدعاء نموذج الذكاء الاصطناعي لفحص ملاءة المستخدم (يتطلب المعاملات `user_id` و `installment`). |
| `/api/gemini/chat` | `POST` | بدء محادثة تفاعلية مع مستشار قدها الذكي. |

---

## 🇬🇧 Qadha FinTech Platform

### Project Overview
**Qadha (قَدّها)** is an innovative FinTech platform designed to help self-employed professionals, freelancers, and gig economy workers in Saudi Arabia evaluate their financial solvency before applying for credit, micro-loans, or installment plans.
By utilizing mock **Open Banking** APIs to simulate bank account integration, the platform analyzes transaction histories, calculates key financial health metrics, and uses a **Machine Learning model** to generate a credit-worthiness prediction along with a verifiable **Digital Solvency Certificate**.

---

### Key Features
1. **Open Banking Simulator**: Easily link mock bank accounts, approve data consent, and pull simulated transaction data.
2. **Interactive Financial Analytics**: View granular trends of monthly income, volatility, recurring obligations, and expenses.
3. **ML-Based Solvency Prediction**: Generates the "Qadha Score" using a trained Scikit-Learn model to categorize risk levels (Low 🟢, Medium 🟡, High Risk 🔴).
4. **AI Financial Advisor**: A chat helper powered by `gemini-3.5-flash` offering personalized tips to help users optimize cashflow and improve their scores.
5. **Verifiable Digital Certificate**: Creates a shareable financial commitment certificate with a unique Verification ID.
6. **Funder Portal**: A designated interface for financial institutions to search, view, and verify certificate status.
7. **Premium Arabic RTL UI**: Beautiful, premium, and fully responsive layout tailored for Arabic-speaking users with micro-animations.

---

### System Architecture & Tech Stack

#### Frontend (App)
- **Framework**: React 19 (powered by Vite 6 & TypeScript)
- **Styling & Animation**: Tailwind CSS v4 & Motion for micro-interactions.
- **Server**: Express Node Server handling endpoint proxies and server routing.
- **AI SDK**: `@google/genai` utilizing the `gemini-3.5-flash` model.

#### Backend (Django REST Framework)
- **Framework**: Django 6.0 & Django REST Framework (DRF)
- **Database**: SQLite (housing user details, mock account details, and transaction logs).
- **ML Core**: Scikit-Learn Classifier saved using `joblib` loaded on-demand to process financial profiles.

---

### API Endpoints
Base API URL: `https://qadaha3-one.vercel.app`

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/users/` | `GET` | Fetch list of registered users. |
| `/api/accounts/` | `GET` | Fetch user bank accounts details. |
| `/api/transactions/` | `GET` | Fetch transaction logs (Incomes, Expenses, Obligations). |
| `/api/predict/` | `GET` | Calculate Qadha solvency score & ML prediction (requires `user_id` & `installment` params). |
| `/api/gemini/chat` | `POST` | Chat with the Qadha AI counselor. |

---

## 🛠️ دليل التشغيل المحلي / Local Setup Guide

### 1. تشغيل الخلفية (Django Backend)
تأكد من تثبيت بيئة بايثون 3.10+ على جهازك.

1. **انتقل إلى مجلد الخلفية:**
   ```bash
   cd backend
   ```

2. **أنشئ بيئة عمل افتراضية وقم بتفعيلها:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux / macOS
   python -m venv venv
   source venv/bin/activate
   ```

3. **قم بتثبيت المكتبات المطلوبة:**
   ```bash
   pip install -r requirements.txt
   ```

4. **قم بإنشاء قاعدة البيانات والمهاجرة (Migrations):**
   ```bash
   python manage.py migrate
   ```

5. **تغذية البيانات التجريبية (Seeding database):**
   ```bash
   python seed.py
   python seed_fahad.py
   ```

6. **قم بتشغيل خادم التطوير:**
   ```bash
   python manage.py runserver
   ```
   سيكون المعيار المحلي للخلفية متاحاً على الرابط: `http://127.0.0.1:8000`

---

### 2. تشغيل الواجهة الأمامية (React Frontend)
تحتاج إلى تثبيت Node.js (إصدار 18 أو أحدث).

1. **انتقل إلى مجلد التطبيق:**
   ```bash
   cd app
   ```

2. **قم بتثبيت الحزم البرمجية:**
   ```bash
   npm install
   ```

3. **قم بتهيئة الملف البيئي:**
   قم بإنشاء ملف `.env.local` أو `.env` وقم بإعداد مفتاح Gemini للذكاء الاصطناعي:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

4. **قم بتشغيل الواجهة محلياً:**
   ```bash
   npm run dev
   ```
   سيتم تشغيل الخادم على الرابط: `http://localhost:3000`
