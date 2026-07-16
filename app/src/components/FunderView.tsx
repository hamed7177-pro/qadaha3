import React, { useState, useEffect } from 'react';
import { Landmark, CheckCircle, ShieldCheck, XCircle, Search, HelpCircle, Lock, AlertCircle, FileText, Calendar, Percent } from 'lucide-react';
import { ScreenId, UserFinancials } from '../types';

interface FunderViewProps {
  onNavigate: (screenId: ScreenId) => void;
  testedInstallment: number;
  initialVerificationId?: string;
  financials: UserFinancials | null;
  loading: boolean;
}

export default function FunderView({ onNavigate, testedInstallment, initialVerificationId, financials, loading }: FunderViewProps) {
  const [searchId, setSearchId] = useState(initialVerificationId || 'QDH-2026-0182');
  const [isValidated, setIsValidated] = useState(
    initialVerificationId 
      ? initialVerificationId.trim().toUpperCase() === 'QDH-2026-0182' 
      : true
  );
  const [searchTriggered, setSearchTriggered] = useState(true);

  // Update state and validate when initialVerificationId changes
  useEffect(() => {
    if (initialVerificationId) {
      setSearchId(initialVerificationId);
      setIsValidated(initialVerificationId.trim().toUpperCase() === 'QDH-2026-0182');
      setSearchTriggered(true);
    }
  }, [initialVerificationId]);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTriggered(true);
    // Simulation: if searchId matches our mock, it validates successfully
    if (searchId.trim().toUpperCase() === 'QDH-2026-0182') {
      setIsValidated(true);
    } else {
      setIsValidated(false);
    }
  };

  if (loading || !financials) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-purple border-t-transparent animate-spin"></div>
        <p className="text-sm font-bold text-brand-navy">جاري التحميل والتحقق الآمن من الشهادة...</p>
      </div>
    );
  }

  // Calculate dynamic before/after debt-to-income ratios
  const currentRatioVal = Math.round((financials.monthlyObligations / financials.avgMonthlyIncome12m) * 100);
  const afterRatioVal = Math.round(((financials.monthlyObligations + testedInstallment) / financials.avgMonthlyIncome12m) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-right">
      
      {/* Official Funder Portal Header */}
      <div className="bg-brand-navy rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1.5 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-purple text-xs font-bold">
            <Landmark className="w-3.5 h-3.5" />
            <span>بوابة الشركاء والجهات التمويلية المعتمدة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">التحقق الرقمي من كفاءة ملاءة عملاء قدها</h2>
          <p className="text-xs text-white/70">
            تتيح هذه البوابة للمصارف وشركات التقسيط والتمويل مطابقة شهادة الملاءة المصدرة بالعمليات البنكية المفتوحة لتقليل المخاطر الائتمانية.
          </p>
        </div>
        
        <button
          onClick={() => onNavigate('certificate')}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shrink-0"
        >
          العودة لعرض الشهادة
        </button>
      </div>

      {/* Verification Code Search Form Bar */}
      <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm">
        <form onSubmit={handleValidate} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold text-brand-navy block">أدخل رمز التوثيق المالي (Verification ID):</label>
            <div className="relative">
              <input 
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="مثال: QDH-2026-0182"
                className="w-full px-4 py-3 rounded-xl border border-brand-gray text-xs font-bold font-mono focus:outline-none focus:border-brand-navy text-right uppercase"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-indigo text-white font-bold text-xs self-end h-[46px] w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>التحقق من الشهادة</span>
          </button>
        </form>
      </div>

      {/* Verification Result details */}
      {searchTriggered && (
        <div className="space-y-6">
          {isValidated ? (
            /* Valid Certificate layout (Highly formal deep navy borders) */
            <div className="bg-white rounded-3xl border-2 border-brand-navy p-6 sm:p-10 shadow-lg space-y-8 animate-fadeIn">
              
              {/* Header result banner */}
              <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-brand-gray gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-black text-brand-navy">حالة التوثيق: صالح ومعتمد</h3>
                    <span className="text-[10px] text-brand-success font-bold font-mono">QADAHA VERIFIED CERTIFICATE</span>
                  </div>
                </div>

                <div className="text-center sm:text-left text-xs font-mono text-slate-400">
                  <span>رمز التحقق: {searchId.toUpperCase()}</span>
                </div>
              </div>

              {/* Secure solvency summary metrics for financing entities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Score gauge block */}
                <div className="bg-brand-navy/[0.02] border border-brand-gray rounded-2xl p-6 text-center space-y-4">
                  <span className="text-xs text-slate-400 font-bold block">مؤشر قدها للملاءة</span>
                  
                  <div className="text-4xl font-black font-mono text-brand-navy">
                    {financials.qadahaScore} <span className="text-lg text-slate-400">/ 100</span>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                    financials.prediction === 'Suitable' 
                      ? 'bg-brand-success/15 text-brand-success' 
                      : financials.prediction === 'NotSuitable'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-brand-clay/15 text-brand-clay'
                  }`}>
                    {financials.prediction === 'Suitable' 
                      ? 'مناسب للالتزام' 
                      : financials.prediction === 'NotSuitable'
                      ? 'غير مناسب للالتزام'
                      : 'مناسب بحذر'}
                  </div>
                </div>

                {/* Range tested metadata */}
                <div className="bg-brand-navy/[0.02] border border-brand-gray rounded-2xl p-6 text-right space-y-3">
                  <span className="text-xs text-slate-400 font-bold block">نطاق القسط المختبر</span>
                  
                  <div className="space-y-1">
                    <span className="text-xl font-bold font-mono text-brand-navy block">{testedInstallment.toLocaleString()} ر.س</span>
                    <span className="text-[10px] text-slate-500 block">شهرياً كقسط تمويل مستهدف للتقييم</span>
                  </div>
                  
                  <div className="text-[10px] text-slate-400 border-t border-brand-gray pt-2">
                    تاريخ أول استحقاق: 2026-08-01
                  </div>
                </div>

                {/* Debt ratio overview */}
                <div className="bg-brand-navy/[0.02] border border-brand-gray rounded-2xl p-6 text-right space-y-3">
                  <span className="text-xs text-slate-400 font-bold block">ملخص الالتزامات كنسب فقط</span>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold font-mono text-brand-navy">{afterRatioVal}%</span>
                      <span className="text-slate-500">نسبة الالتزام الإجمالي للدخل:</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${afterRatioVal > 45 ? 'bg-red-500' : afterRatioVal > 33 ? 'bg-brand-clay' : 'bg-brand-success'}`} style={{ width: `${afterRatioVal}%` }}></div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 border-t border-brand-gray pt-1">
                    نسبة الالتزامات الحالية: {currentRatioVal}%
                  </div>
                </div>

              </div>

              {/* Secure data parameters (Average 12m income, volatility, etc.) */}
              <div className="space-y-4 pt-4 border-t border-brand-gray">
                <h4 className="text-xs font-black text-brand-navy border-r-2 border-brand-purple pr-2">البيانات الإحصائية المعتمدة للتقييم:</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-extrabold font-mono text-brand-navy">{financials.avgMonthlyIncome12m.toLocaleString()} ر.س</span>
                    <span className="text-slate-500">متوسط الدخل الشهري الفعلي للسنة (12 شهر):</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-extrabold font-mono text-brand-navy">
                      {financials.incomeVolatilityScore <= 15 ? 'مستوى منخفض جداً' : financials.incomeVolatilityScore <= 30 ? 'مستوى متوسط' : 'مستوى متذبذب مرتفع'} ({financials.incomeVolatilityScore}%)
                    </span>
                    <span className="text-slate-500">مؤشر تذبذب الدخل الشهري:</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-extrabold font-mono text-brand-navy">{financials.monthlyObligations.toLocaleString()} ر.س</span>
                    <span className="text-slate-500">الالتزامات البنكية والقروض الأخرى القائمة:</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-extrabold font-mono text-brand-navy">{(financials.avgMonthlyIncome12m - financials.monthlyObligations - testedInstallment - financials.avgMonthlyExpenses).toLocaleString()} ر.س</span>
                    <span className="text-slate-500">متوسط الفائض المالي المتاح شهرياً:</span>
                  </div>
                </div>
              </div>

              {/* Safety notice disclaimer */}
              <div className="bg-brand-navy/5 p-4 rounded-xl text-xs text-slate-500 leading-relaxed text-right flex items-start gap-2.5">
                <Lock className="w-5 h-5 text-brand-navy shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-brand-navy block">بيئة خصوصية مضمونة وحماية معلومات العميل</span>
                  <p>
                    هذا التوثيق صادر بموافقة المستخدم المسبقة والصريحة عبر المصرفية المفتوحة التفاعلية. يعرض المؤشرات الملخصة والنسب الإحصائية فقط دون الكشف عن السجل الكامل للعمليات أو أرقام الحسابات البنكية حماية للخصوصية وسرية المعاملات.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            /* Expired/Revoked/Invalid certificate simulation */
            <div className="bg-white rounded-3xl border-2 border-brand-danger p-8 shadow-lg text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-brand-danger/10 text-brand-danger flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-brand-navy">توثيق غير متاح أو منتهي الصلاحية</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                رمز التحقق <span className="font-bold text-brand-danger font-mono">"{searchId.toUpperCase()}"</span> قد يكون ملغى من قبل المستخدم أو غير مسجل في قواعد بيانات المصرفية المفتوحة المعتمدة.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
