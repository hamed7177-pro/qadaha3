import React from 'react';
import { HelpCircle, AlertTriangle, ShieldCheck, ChevronLeft, ArrowRight, ClipboardCheck, ArrowLeftRight, Percent } from 'lucide-react';
import { ScreenId, UserFinancials } from '../types';
import { analyzeFinancials, FAHAD_12M_INCOME, FAHAD_12M_EXPENSES, FAHAD_12M_OBLIGATIONS } from '../utils/calculations';

interface ResultViewProps {
  onNavigate: (screenId: ScreenId) => void;
  testedInstallment: number;
  financials: UserFinancials | null;
  loading: boolean;
}

export default function ResultView({ onNavigate, testedInstallment, financials, loading }: ResultViewProps) {
  if (loading || !financials) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-purple border-t-transparent animate-spin"></div>
        <p className="text-sm font-bold text-brand-navy">جاري تحليل الملاءة وحساب النتيجة بالـ AI...</p>
      </div>
    );
  }

  // Calculate dynamic before/after debt-to-income ratios
  const currentRatioVal = Math.round((financials.monthlyObligations / financials.avgMonthlyIncome12m) * 100);
  const afterRatioVal = Math.round(((financials.monthlyObligations + testedInstallment) / financials.avgMonthlyIncome12m) * 100);

  // Dynamic breakdown values mapped to database Open Banking attributes
  const stabilityScore = financials.cashflowStabilityScore;
  const volatilityScore = financials.incomeVolatilityScore;
  const dti = (financials.monthlyObligations / financials.avgMonthlyIncome12m) * 100;
  
  const breakdowns = [
    { name: 'انتظام واستقرار الدخل', score: Math.round(25 * (stabilityScore / 100)), total: 25, percentage: `${stabilityScore}%` },
    { name: 'نسبة الالتزامات للدخل', score: Math.max(0, Math.round(25 * (1 - dti / 100))), total: 25, percentage: `${Math.max(0, Math.round(100 - dti))}%` },
    { name: 'الفائض النقدي المتاح', score: Math.round(20 * (financials.qadahaScore / 100)), total: 20, percentage: `${financials.qadahaScore}%` },
    { name: 'استقرار متوسط الرصيد', score: Math.round(20 * (1 - volatilityScore / 100)), total: 20, percentage: `${Math.round(100 - volatilityScore)}%` },
    { name: 'سلوك الإنفاق والادخار', score: Math.round(10 * (financials.qadahaScore / 100)), total: 10, percentage: `${financials.qadahaScore}%` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-right">
      
      {/* Steps Progress Bar */}
      <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-gray -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 right-0 w-4/5 h-1 bg-brand-purple -translate-y-1/2 z-0 transition-all"></div>
          
          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">✓</div>
            <span className="text-xs font-bold text-brand-purple">الموافقة</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">✓</div>
            <span className="text-xs font-bold text-brand-purple">ربط الحساب</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">✓</div>
            <span className="text-xs font-bold text-brand-purple">التحليل المالي</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">✓</div>
            <span className="text-xs font-bold text-brand-purple">اختبار الالتزام</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20 ring-offset-2">5</div>
            <span className="text-xs font-bold text-brand-purple">شهادة الملاءة</span>
          </div>
        </div>
      </div>

      {/* Result Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Radial Index & Warning Block */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-gray p-6 sm:p-8 shadow-md text-center space-y-6">
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">مؤشر الملاءة التفاعلي</span>
          
          {/* Large Radial Arc Gauge */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center pt-2">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="72"
                className="stroke-slate-100 fill-none"
                strokeWidth="12"
              />
              <circle
                cx="88"
                cy="88"
                r="72"
                className="stroke-brand-clay fill-none"
                strokeWidth="14"
                strokeDasharray="452"
                strokeDashoffset={452 - (452 * financials.qadahaScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <span className="text-5xl font-black font-mono text-brand-navy block">{financials.qadahaScore}</span>
              <span className="text-xs text-slate-400 font-bold block mt-1">مؤشر قدها</span>
            </div>
          </div>

          {/* Solvency Status Alert */}
          <div className="space-y-2">
            <div className={`border px-5 py-2.5 rounded-2xl text-base font-extrabold inline-flex items-center gap-2 ${
              financials.prediction === 'Suitable' 
                ? 'bg-brand-success/10 border-brand-success/20 text-brand-success' 
                : financials.prediction === 'NotSuitable'
                ? 'bg-red-50 border-red-100 text-red-600'
                : 'bg-brand-clay/10 border-brand-clay/20 text-brand-clay'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full block animate-pulse ${
                financials.prediction === 'Suitable' 
                  ? 'bg-brand-success' 
                  : financials.prediction === 'NotSuitable'
                  ? 'bg-red-500'
                  : 'bg-brand-clay'
              }`}></span>
              <span>
                {financials.prediction === 'Suitable' 
                  ? 'مناسب للالتزام' 
                  : financials.prediction === 'NotSuitable'
                  ? 'غير مناسب للالتزام'
                  : 'مناسب بحذر'}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2">
              {financials.reasons.join(' ')}
            </p>
          </div>

          {/* Compare bar charts Before / After (Pure SVG) */}
          <div className="border-t border-brand-gray pt-6 text-right space-y-3">
            <h4 className="text-xs font-bold text-brand-navy flex items-center justify-end gap-1">
              <span>مقارنة نسبة الالتزام الإجمالية للدخل</span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-brand-clay" />
            </h4>
            
            <div className="space-y-3">
              {/* Before */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">الوضع الحالي لـ {financials.name}</span>
                  <span className="text-brand-success font-bold">{currentRatioVal}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-success rounded-full" style={{ width: `${currentRatioVal}%` }}></div>
                </div>
              </div>

              {/* After */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">بعد التزام {testedInstallment.toLocaleString()} ر.س</span>
                  <span className={`font-bold ${afterRatioVal > 45 ? 'text-red-600' : afterRatioVal > 33 ? 'text-brand-clay' : 'text-brand-success'}`}>{afterRatioVal}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${afterRatioVal > 45 ? 'bg-red-500' : afterRatioVal > 33 ? 'bg-brand-clay' : 'bg-brand-success'}`} style={{ width: `${afterRatioVal}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Breakdown Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-gray p-6 sm:p-8 shadow-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy">تفاصيل مكونات ملاءتك</h2>
            <p className="text-xs text-slate-400">تحليل معزز ومفصل للـ 12 شهراً الماضية لبناء الثقة والخصوصية</p>
          </div>

          {/* Breakdown Score Cards List */}
          <div className="space-y-4">
            {breakdowns.map((b, i) => (
              <div key={i} className="space-y-1.5 text-right">
                <div className="flex justify-between text-xs font-bold text-brand-navy">
                  <span className="font-mono text-slate-500">{b.score} / {b.total}</span>
                  <span>{b.name}</span>
                </div>
                
                {/* Score bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-l from-brand-navy to-brand-purple rounded-full" 
                    style={{ width: `${(b.score / b.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Regulatory Warning Banner */}
          <div className="bg-slate-50 border border-brand-gray p-4 rounded-2xl text-xs text-slate-500 leading-relaxed text-right flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-brand-clay shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-brand-navy block">تنبيه تنظيمي مهم:</span>
              <p>
                النتيجة تحليل داعم مبني على التدفق النقدي والعمليات الفعلية وليست تقريراً ائتمانياً رسمياً من الجهات الرقابية الحكومية. تم إصدارها لمساعدة المستخدم على اتخاذ القرار السليم ومشاركتها بخصوصية تامة مع الشركاء.
              </p>
            </div>
          </div>

          {/* Action Links Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-gray">
            
            <button
              id="btn-goto-certificate"
              onClick={() => onNavigate('certificate')}
              className="px-4 py-3.5 rounded-xl bg-gradient-to-l from-brand-navy to-brand-indigo hover:shadow-lg text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer order-last sm:order-first"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>أصدر شهادة قدها للمشاركة</span>
            </button>

            <button
              onClick={() => onNavigate('recommendations')}
              className="px-4 py-3.5 rounded-xl bg-white border border-brand-gray hover:bg-slate-50 text-brand-navy font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>عرض توصيات الملاءة</span>
            </button>

            <button
              onClick={() => onNavigate('test_obligation')}
              className="px-4 py-3.5 rounded-xl bg-white border border-brand-gray hover:bg-slate-50 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>تعديل القسط المستهدف</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
