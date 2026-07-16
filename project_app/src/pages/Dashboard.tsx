import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  CreditCard, 
  Receipt, 
  PiggyBank, 
  MoreVertical,
  User,
  Car,
  Lightbulb,
  Info,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Landmark,
  ArrowLeft,
  Tv,
  HelpCircle
} from "lucide-react";

interface Obligation {
  category: string;
  label: string;
  amount: number;
  icon: string;
}

interface ExpenseCategory {
  category: string;
  label: string;
  amount: number;
  percentage: number;
}

interface SummaryData {
  has_accounts: boolean;
  total_balance: number;
  average_monthly_income: number;
  monthly_expenses: number;
  expected_surplus: number;
  score: number;
  score_label: string;
  stability_score: number;
  obligations: Obligation[];
  expense_categories: ExpenseCategory[];
}

const API_BASE = "http://localhost:8000/api";

// Fallback mock data when no accounts are linked
const MOCK_FALLBACK: SummaryData = {
  has_accounts: false,
  total_balance: 0,
  average_monthly_income: 18500,
  monthly_expenses: 7200,
  expected_surplus: 5200,
  score: 72,
  score_label: "مناسب بحذر",
  stability_score: 85,
  obligations: [
    { category: "rent", label: "إيجار سكن", amount: 3000, icon: "Home" },
    { category: "car_loan", label: "قسط سيارة", amount: 1500, icon: "Car" },
    { category: "utilities", label: "فاتورة كهرباء/مياه", amount: 350, icon: "Receipt" },
    { category: "subscription", label: "اشتراك سحابي", amount: 45, icon: "Tv" }
  ],
  expense_categories: [
    { category: "rent", label: "السكن", amount: 3240, percentage: 45 },
    { category: "groceries", label: "معيشة", amount: 2520, percentage: 35 },
    { category: "shopping", label: "أخرى", amount: 1440, percentage: 20 }
  ]
};

export default function Dashboard() {
  const [data, setData] = useState<SummaryData>(MOCK_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/financial-summary/`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.has_accounts) {
        setData(json);
        setIsDemo(false);
      } else {
        setData(MOCK_FALLBACK);
        setIsDemo(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback silently to mock data
      setData(MOCK_FALLBACK);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const getObligationIcon = (iconName: string) => {
    switch (iconName) {
      case 'User': return <User size={16} className="text-primary-container" />;
      case 'Car': return <Car size={16} className="text-secondary" />;
      case 'Receipt': return <Receipt size={16} className="text-tertiary-container" />;
      case 'Tv': return <Tv size={16} className="text-outline" />;
      default: return <Receipt size={16} className="text-primary-container" />;
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = ["bg-[#000d21]", "bg-[#994629]", "bg-[#c4c0ff]", "bg-[#768bae]", "bg-[#ffb59d]"];
    return colors[index % colors.length];
  };

  const getCategoryStroke = (index: number) => {
    const strokes = ["#000d21", "#994629", "#c4c0ff", "#768bae", "#ffb59d"];
    return strokes[index % strokes.length];
  };

  // Safe limits for new obligations
  const maxSafeObligation = Math.max(0, Math.round(data.expected_surplus * 0.25));

  // Gauge calculation
  // strokeDasharray = 283 (circumference for r=45)
  // strokeDashoffset: full is 283 (0%), empty is 0 (100%). Wait, in the SVG:
  // strokeDashoffset is 283 - (283 * score) / 100
  const dashOffset = 283 - (283 * data.score) / 100;

  return (
    <div className="space-y-gutter pb-8 text-right" dir="rtl">
      
      {/* Demo Warning Banner */}
      {isDemo && (
        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 flex-row-reverse">
          <div className="flex items-start gap-3 flex-row-reverse">
            <AlertCircle className="text-secondary mt-0.5 flex-shrink-0" size={20} />
            <div className="text-right">
              <h4 className="font-title-lg text-body-lg font-bold text-secondary">عرض بيانات تجريبية</h4>
              <p className="text-label-md text-on-surface-variant">
                لم تقم بربط أي حساب بنكي حقيقي أو محاكى بعد. يرجى ربط حساباتك لتفعيل مؤشر ملاءتك الحقيقي.
              </p>
            </div>
          </div>
          <Link
            to="/link-accounts"
            className="px-4 py-2 bg-secondary text-white font-bold rounded-xl text-xs hover:bg-secondary/90 transition-all flex items-center gap-1.5 flex-row-reverse"
          >
            <span>ربط الحسابات الآن</span>
            <Landmark size={14} />
          </Link>
        </div>
      )}

      {/* Section 1: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Card 1: Income */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft hover:shadow-hover transition-shadow border border-surface-container border-b-4 border-b-primary-container relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary-container rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
              <TrendingUp size={24} />
            </div>
            <span className="px-2 py-1 bg-surface-container rounded font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 flex-row-reverse">
              <TrendingUp size={14} /> متوقع
            </span>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">متوسط الدخل الشهري</h3>
          <p className="font-headline-lg text-headline-lg text-on-surface font-bold">
            {Math.round(data.average_monthly_income).toLocaleString("en-US")} <span className="font-body-md text-on-surface-variant font-normal">ر.س</span>
          </p>
        </div>

        {/* Card 2: Expenses */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft hover:shadow-hover transition-shadow border border-surface-container relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-error rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-error">
              <CreditCard size={24} />
            </div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">المصاريف الشهرية</h3>
          <p className="font-headline-lg text-headline-lg text-on-surface font-bold">
            {Math.round(data.monthly_expenses).toLocaleString("en-US")} <span className="font-body-md text-on-surface-variant font-normal">ر.س</span>
          </p>
        </div>

        {/* Card 3: Obligations */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft hover:shadow-hover transition-shadow border border-surface-container relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <Receipt size={24} />
            </div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">الالتزامات المتكررة</h3>
          <p className="font-headline-lg text-headline-lg text-on-surface font-bold">
            {Math.round(data.obligations.reduce((sum, o) => sum + o.amount, 0)).toLocaleString("en-US")} <span className="font-body-md text-on-surface-variant font-normal">ر.س</span>
          </p>
        </div>

        {/* Card 4: Surplus */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft hover:shadow-hover transition-shadow border border-surface-container border-t-4 border-t-secondary relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-tertiary-fixed rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary-container">
              <PiggyBank size={24} />
            </div>
            <span className="px-2 py-1 bg-surface-container rounded font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 flex-row-reverse">
              صافي
            </span>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">الفائض المتوقع</h3>
          <p className="font-headline-lg text-headline-lg text-on-surface font-bold text-tertiary-container">
            {Math.round(data.expected_surplus).toLocaleString("en-US")} <span className="font-body-md text-on-surface-variant font-normal">ر.س</span>
          </p>
        </div>
      </div>

      {/* Section 2: Capacity Widget & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Capacity Widget */}
        <div className="lg:col-span-1 bg-primary-container rounded-xl p-8 text-surface-bright flex flex-col justify-between items-center relative overflow-hidden shadow-soft hover:shadow-hover transition-shadow">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary rounded-full blur-3xl opacity-30"></div>
          
          <div className="w-full flex flex-col items-center">
            <h3 className="font-title-lg text-title-lg font-bold mb-6 z-10 text-center">مؤشر قدها المالي</h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center z-10 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="8"></circle>
                <circle 
                  className="transition-all duration-1000 ease-out" 
                  cx="50" 
                  cy="50" 
                  fill="transparent" 
                  r="45" 
                  stroke={data.score > 80 ? "#007A3E" : data.score > 60 ? "#C96B4B" : "#ba1a1a"} 
                  strokeDasharray="283" 
                  strokeDashoffset={dashOffset} 
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display-lg text-display-lg font-bold text-surface-bright">{data.score}</span>
                <span className="font-label-md text-label-md text-surface-variant opacity-80">/ 100</span>
              </div>
            </div>
            
            <div className="z-10 text-center mb-8">
              <span className="inline-block px-4 py-2 bg-secondary rounded-full font-title-lg text-title-lg font-bold text-on-secondary shadow-md">
                {data.score_label}
              </span>
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="w-full space-y-4 z-10">
            <div>
              <div className="flex justify-between items-center mb-1 flex-row-reverse">
                <span className="text-sm font-medium text-surface-variant">الاستقرار المالي</span>
                <span className="text-xs text-secondary-fixed">
                  {data.stability_score >= 80 ? "ممتاز" : "مستقر"}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary-fixed h-full rounded-full" style={{ width: `${data.stability_score}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1 flex-row-reverse">
                <span className="text-sm font-medium text-surface-variant">نسبة الالتزامات</span>
                <span className="text-xs text-error-container">
                  {data.score >= 80 ? "آمنة جداً" : data.score >= 60 ? "مقبولة" : "مرتفعة"}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: `${100 - data.score}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Insight Panel */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-soft border border-surface-container flex flex-col overflow-hidden">
          <div className="bg-surface-container p-4 border-b border-surface-variant flex items-center gap-3 flex-row-reverse">
            <Lightbulb className="text-secondary" size={24} />
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface">أبرز الملاحظات المالية</h3>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-4 justify-center">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low border border-surface-variant flex-row-reverse">
              <div className="w-8 h-8 rounded bg-surface-bright flex-shrink-0 flex items-center justify-center text-primary-container">
                <Info size={20} />
              </div>
              <div className="text-right flex-1">
                {data.has_accounts ? (
                  <p className="font-body-lg text-body-lg text-on-surface">
                    تحليل الحسابات المربوطة يظهر استقراراً ممتازاً. انتظام الرواتب وتدفق العمل الحر يدعم رصيدك.
                  </p>
                ) : (
                  <p className="font-body-lg text-body-lg text-on-surface">
                    الدخل جيد لكنه <span className="font-bold text-secondary">متذبذب</span>، لوحظ اختلاف بنسبة 15% بين الأشهر.
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low border border-surface-variant flex-row-reverse">
              <div className="w-8 h-8 rounded bg-surface-bright flex-shrink-0 flex items-center justify-center text-primary-container">
                <PieChart size={20} />
              </div>
              <div className="text-right flex-1">
                <p className="font-body-lg text-body-lg text-on-surface">
                  الالتزامات الحالية تمثل <span className="font-bold text-primary-container">
                    {Math.round((data.obligations.reduce((sum, o) => sum + o.amount, 0) / data.average_monthly_income) * 100) || 0}%
                  </span> من متوسط دخل حساباتك، وهي ضمن النطاق المقبول.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low border border-surface-variant border-r-4 border-r-secondary flex-row-reverse shadow-sm">
              <div className="w-8 h-8 rounded bg-surface-bright flex-shrink-0 flex items-center justify-center text-secondary">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-right flex-1">
                <p className="font-body-lg text-body-lg text-on-surface font-medium">
                  الفائض المتوقع يغطي التزامًا شهرياً جديداً حتى <span className="font-bold text-secondary bg-secondary-fixed-dim px-2 py-0.5 rounded">
                    {maxSafeObligation.toLocaleString("en-US")} ر.س
                  </span> بأمان.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Charts & Obligations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Obligations List */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft border border-surface-container flex flex-col">
          <div className="flex justify-between items-center mb-6 flex-row-reverse">
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface">الالتزامات الشهرية المكتشفة</h3>
            <MoreVertical size={20} className="text-outline" />
          </div>
          
          <div className="space-y-6 flex-1">
            {data.obligations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-6 text-on-surface-variant">
                <HelpCircle size={32} className="opacity-40 mb-2" />
                <p className="text-sm">لا توجد التزامات متكررة مكتشفة حالياً</p>
              </div>
            ) : (
              data.obligations.map((ob, idx) => {
                const percentage = Math.round((ob.amount / data.average_monthly_income) * 100);
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2 flex-row-reverse">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        {getObligationIcon(ob.icon)}
                        <span className="font-label-md text-on-surface">{ob.label}</span>
                      </div>
                      <span className="font-label-md text-on-surface-variant">{Math.round(ob.amount).toLocaleString("en-US")} ر.س</span>
                    </div>
                    <div className="w-full bg-surface-variant rounded-full h-2">
                      <div 
                        className="bg-primary-container h-2 rounded-full" 
                        style={{ width: `${Math.min(100, Math.max(5, percentage))}%`, backgroundColor: idx === 1 ? '#994629' : idx === 2 ? '#c4c0ff' : '#0b2341' }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Expense Categories Chart */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft border border-surface-container flex flex-col">
          <div className="flex justify-between items-center mb-6 flex-row-reverse">
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface">تصنيف المصروفات</h3>
            <MoreVertical size={20} className="text-outline" />
          </div>
          
          <div className="flex items-center justify-between gap-8 flex-row-reverse flex-1">
            {/* SVG Donut Chart */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#e4e2de" strokeWidth="12"></circle>
                {/* Simplified dynamic arcs representation */}
                {data.expense_categories.map((cat, idx) => {
                  // Generate stroke offsets based on percentages
                  // Circumference is 251.2
                  let offset = 251.2;
                  let accumulatedPercent = 0;
                  for (let i = 0; i < idx; i++) {
                    accumulatedPercent += data.expense_categories[i].percentage;
                  }
                  const strokeDasharray = 251.2;
                  const strokeDashoffset = strokeDasharray - (strokeDasharray * cat.percentage) / 100;
                  const rotation = (accumulatedPercent * 360) / 100;

                  return (
                    <circle 
                      key={idx}
                      cx="50" 
                      cy="50" 
                      fill="transparent" 
                      r="40" 
                      stroke={getCategoryStroke(idx)} 
                      strokeDasharray={strokeDasharray} 
                      strokeDashoffset={strokeDashoffset} 
                      strokeWidth="12" 
                      transform={`rotate(${rotation} 50 50)`}
                    ></circle>
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-on-surface">
                  {Math.round(data.monthly_expenses).toLocaleString("en-US")}
                </span>
              </div>
            </div>
            
            {/* Category legends */}
            <div className="flex flex-col gap-3 flex-1">
              {data.expense_categories.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between flex-row-reverse">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColor(idx)}`}></div>
                    <span className="text-label-md text-on-surface">{cat.label}</span>
                  </div>
                  <span className="text-label-sm text-on-surface-variant">{Math.round(cat.percentage)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
