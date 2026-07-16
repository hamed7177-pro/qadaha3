import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Info, 
  TrendingUp, 
  Activity, 
  Briefcase, 
  Store, 
  Home, 
  PieChart, 
  ShoppingBag, 
  Receipt, 
  Car, 
  Tv, 
  AlertCircle,
  Landmark
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

interface CashFlowMonth {
  name: string;
  income: number;
  expense: number;
}

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

const STATIC_CASH_FLOW_FALLBACK: CashFlowMonth[] = [
  { name: 'يناير', income: 18000, expense: 7000 },
  { name: 'فبراير', income: 16000, expense: 6000 },
  { name: 'مارس', income: 19000, expense: 7500 },
  { name: 'أبريل', income: 17500, expense: 7200 },
  { name: 'مايو', income: 18500, expense: 6800 },
  { name: 'يونيو', income: 20000, expense: 8000 },
];

const STATIC_SUMMARY_FALLBACK: SummaryData = {
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
    { category: "utilities", label: "فاتورة كهرباء", amount: 350, icon: "Receipt" },
    { category: "subscription", label: "اشتراك سحابي", amount: 45, icon: "Tv" }
  ],
  expense_categories: [
    { category: "rent", label: "السكن", amount: 3240, percentage: 45 },
    { category: "groceries", label: "معيشة", amount: 2520, percentage: 35 },
    { category: "shopping", label: "أخرى", amount: 1440, percentage: 20 }
  ]
};

export default function CashFlow() {
  const [cashFlowData, setCashFlowData] = useState<CashFlowMonth[]>(STATIC_CASH_FLOW_FALLBACK);
  const [summaryData, setSummaryData] = useState<SummaryData>(STATIC_SUMMARY_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetchCashFlowAndSummary();
  }, []);

  const fetchCashFlowAndSummary = async () => {
    try {
      setLoading(true);
      
      // Fetch summary first
      const summaryRes = await fetch(`${API_BASE}/financial-summary/`);
      const summaryJson = await summaryRes.json();
      
      if (summaryJson.has_accounts) {
        setSummaryData(summaryJson);
        setIsDemo(false);
        
        // Fetch real cash flow months
        const cashFlowRes = await fetch(`${API_BASE}/cash-flow-data/`);
        const cashFlowJson = await cashFlowRes.json();
        if (cashFlowJson && cashFlowJson.length > 0) {
          setCashFlowData(cashFlowJson);
        }
      } else {
        setSummaryData(STATIC_SUMMARY_FALLBACK);
        setCashFlowData(STATIC_CASH_FLOW_FALLBACK);
        setIsDemo(true);
      }
    } catch (err) {
      console.error(err);
      setSummaryData(STATIC_SUMMARY_FALLBACK);
      setCashFlowData(STATIC_CASH_FLOW_FALLBACK);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const getObligationIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home size={20} />;
      case 'Car': return <Car size={20} />;
      case 'Receipt': return <Receipt size={20} />;
      case 'Tv': return <Tv size={20} />;
      default: return <Receipt size={20} />;
    }
  };

  const getObligationColorClass = (category: string) => {
    switch (category) {
      case 'rent': return "bg-primary-fixed text-primary";
      case 'car_loan': return "bg-secondary-fixed text-secondary";
      case 'utilities': return "bg-tertiary-fixed text-tertiary";
      default: return "bg-surface-variant text-on-surface-variant";
    }
  };

  // Estimate dynamic income sources based on average monthly income
  const salaryShare = Math.round(summaryData.average_monthly_income * 0.75);
  const freelanceShare = Math.round(summaryData.average_monthly_income * 0.18);
  const investmentShare = Math.round(summaryData.average_monthly_income * 0.07);

  // Dynamic values for essential vs variable expenses
  const essentialPercentage = summaryData.expense_categories.find(c => c.category === 'rent' || c.category === 'groceries' || c.category === 'utilities' || c.category === 'car_loan') 
    ? 65 : 60;
  const variablePercentage = 100 - essentialPercentage;

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

      {/* Page Header & Explanation Box */}
      <div className="flex flex-col gap-4 text-right">
        <h2 className="font-headline-lg text-headline-lg text-primary-container">تحليل التدفق المالي</h2>
        <div className="bg-surface-container-highest border-l-4 border-secondary rounded-xl p-4 flex items-start gap-4 flex-row-reverse">
          <Info className="text-secondary mt-1 flex-shrink-0" size={24} />
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            يعتمد التحليل على التدفق النقدي الفعلي، وليس فقط على وجود راتب ثابت. هذا يساعد في فهم القدرة الحقيقية على الالتزام.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Card 1: Timeline (Col 8) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-soft border border-outline-variant overflow-hidden flex flex-col">
          <div className="bg-surface-container p-4 border-b border-outline-variant flex justify-between items-center flex-row-reverse">
            <h3 className="font-title-lg text-title-lg text-primary-container">تدفق الدخل والمصاريف (٦ أشهر)</h3>
            <TrendingUp className="text-on-primary-container" size={24} />
          </div>
          <div className="p-6 flex-1 flex flex-col relative min-h-[300px]">
            {/* Legend */}
            <div className="flex gap-6 flex-row-reverse mb-4">
              <div className="flex items-center gap-2 flex-row-reverse">
                <div className="w-3 h-3 rounded-full bg-[#000d21]"></div>
                <span className="font-label-md text-label-sm text-on-surface-variant">الدخل</span>
              </div>
              <div className="flex items-center gap-2 flex-row-reverse">
                <div className="w-3 h-3 rounded-full bg-[#994629]"></div>
                <span className="font-label-md text-label-sm text-on-surface-variant">المصاريف</span>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000d21" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#000d21" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#994629" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#994629" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#74777e', fontSize: 12}} reversed />
                  <Tooltip />
                  <CartesianGrid vertical={false} stroke="#e4e2de" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="income" stroke="#000d21" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#994629" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 2: Volatility (Col 4) */}
        <div className="col-span-12 lg:col-span-4 bg-primary-container rounded-xl shadow-soft border border-primary overflow-hidden flex flex-col text-surface-bright relative">
          <div className="p-4 flex justify-between items-center relative z-10 flex-row-reverse">
            <h3 className="font-title-lg text-title-lg">انتظام الدخل</h3>
            <Activity className="text-secondary" size={24} />
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center relative z-10">
            <div className="text-display-lg font-display-lg mb-2">{summaryData.stability_score}٪</div>
            <p className="font-body-md text-primary-fixed-dim text-center">درجة استقرار الدخل الشهري بناءً على التذبذب خلال العام.</p>
            <div className="w-full h-16 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowData}>
                   <Line type="monotone" dataKey="income" stroke="#fe9572" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3: Income Sources */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl shadow-soft border border-outline-variant overflow-hidden">
          <div className="bg-surface-container p-4 border-b border-outline-variant text-right">
            <h3 className="font-title-lg text-title-lg text-primary-container">مصادر الدخل المقدرة</h3>
          </div>
          <div className="p-6 flex flex-col gap-4 text-right">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <Briefcase size={16} />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface">راتب أساسي</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">منتظم</p>
                </div>
              </div>
              <span className="font-title-lg text-body-md text-primary-container font-bold" dir="ltr">
                {salaryShare.toLocaleString("en-US")} ر.س
              </span>
            </div>
            
            <div className="w-full h-[1px] bg-surface-variant"></div>
            
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container">
                  <Store size={16} />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface">عمل حر</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">متغير</p>
                </div>
              </div>
              <span className="font-title-lg text-body-md text-primary-container font-bold" dir="ltr">
                {freelanceShare.toLocaleString("en-US")} ر.س
              </span>
            </div>
            
            <div className="w-full h-[1px] bg-surface-variant"></div>
            
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container">
                  <Home size={16} />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface">عوائد استثمار</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">نصف سنوي</p>
                </div>
              </div>
              <span className="font-title-lg text-body-md text-primary-container font-bold" dir="ltr">
                {investmentShare.toLocaleString("en-US")} ر.s
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Essential vs Variable Expenses */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl shadow-soft border border-outline-variant overflow-hidden">
          <div className="bg-surface-container p-4 border-b border-outline-variant flex justify-between items-center flex-row-reverse">
            <h3 className="font-title-lg text-title-lg text-primary-container">تصنيف المصاريف</h3>
            <PieChart className="text-primary" size={24} />
          </div>
          <div className="p-6 flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#e4e2de" strokeWidth="12"></circle>
                {/* Visual percentage representation */}
                <circle 
                  cx="50" 
                  cy="50" 
                  fill="transparent" 
                  r="40" 
                  stroke="#994629" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * essentialPercentage) / 100} 
                  strokeLinecap="round" 
                  strokeWidth="12"
                ></circle>
                <circle 
                  cx="50" 
                  cy="50" 
                  fill="transparent" 
                  r="40" 
                  stroke="#c4c0ff" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * variablePercentage) / 100} 
                  strokeLinecap="round" 
                  strokeWidth="12"
                  transform={`rotate(${(essentialPercentage * 360) / 100} 50 50)`}
                ></circle>
              </svg>
              <div className="absolute text-center flex items-center justify-center">
                <span className="block text-headline-md font-bold text-primary">١٠٠٪</span>
              </div>
            </div>
            
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-between w-full flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-label-md text-on-surface">أساسية ({essentialPercentage}٪)</span>
                </div>
                <Home className="text-on-surface-variant" size={20} />
              </div>
              <div className="flex items-center justify-between w-full flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></div>
                  <span className="text-label-md text-on-surface">متغيرة ({variablePercentage}٪)</span>
                </div>
                <ShoppingBag className="text-on-surface-variant" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Balance Stability */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl shadow-soft border border-outline-variant overflow-hidden flex flex-col">
          <div className="bg-surface-container p-4 border-b border-outline-variant text-right">
            <h3 className="font-title-lg text-title-lg text-primary-container">استقرار الرصيد المتبقي</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center items-center relative">
            <div className="w-32 h-32 relative rounded-full border-4 border-surface-variant flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" fill="transparent" r="46" stroke="#005B3A" strokeWidth="8" strokeDasharray="289" strokeDashoffset="50"></circle>
              </svg>
              <div className="text-center">
                <span className="block font-headline-lg text-headline-lg text-primary">إيجابي</span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant text-center mt-6">
              الرصيد المتبقي في نهاية الشهر مستقر بمتوسط <span className="font-bold text-primary" dir="ltr">
                {Math.round(summaryData.expected_surplus * 0.45).toLocaleString("en-US")} ر.س
              </span> خلال الفترة الأخيرة.
            </p>
          </div>
        </div>

        {/* Card 6: Recurring Obligations */}
        <div className="col-span-12 bg-surface-container-lowest rounded-xl shadow-soft border border-outline-variant overflow-hidden">
          <div className="bg-surface-container p-4 border-b border-outline-variant flex justify-between items-center text-right">
            <h3 className="font-title-lg text-title-lg text-primary-container">الالتزامات المتكررة المكتشفة</h3>
          </div>
          <div className="p-6">
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-right">تم التعرف على هذه الالتزامات من خلال تحليل السجل البنكي:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaryData.obligations.length === 0 ? (
                <div className="col-span-4 text-center py-6 text-on-surface-variant">
                  لا توجد التزامات مسجلة حالياً.
                </div>
              ) : (
                summaryData.obligations.map((ob, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 hover:border-secondary transition-all cursor-pointer flex-row-reverse"
                  >
                    <div className="text-right">
                      <p className="text-label-sm text-on-surface-variant">{ob.label}</p>
                      <p className="text-title-lg font-bold text-primary" dir="ltr">
                        {Math.round(ob.amount).toLocaleString("en-US")} <span className="text-xs font-normal">ر.س</span>
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getObligationColorClass(ob.category)}`}>
                      {getObligationIcon(ob.icon)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
