import React, { useState } from 'react';
import { Sparkles, HelpCircle, ArrowLeft, ArrowRight, ShieldCheck, ChevronLeft, CreditCard, Landmark, Percent } from 'lucide-react';
import { ScreenId, UserFinancials } from '../types';
import RiyalSymbol from './RiyalSymbol';

interface TestObligationViewProps {
  onNavigate: (screenId: ScreenId) => void;
  onUpdateInstallment: (amount: number) => void;
  currentInstallment: number;
  financials: UserFinancials | null;
  loading: boolean;
}

export default function TestObligationView({ 
  onNavigate, 
  onUpdateInstallment,
  currentInstallment,
  financials,
  loading
}: TestObligationViewProps) {
  
  const [installment, setInstallment] = useState<number>(currentInstallment);
  const [loanType, setLoanType] = useState<string>('تمويل شخصي مرن');
  const [duration, setDuration] = useState<number>(60);
  const [firstPaymentDate, setFirstPaymentDate] = useState<string>('2026-08-01');
  const [funder, setFunder] = useState<string>('مصرف الإنماء');

  if (loading || !financials) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-purple border-t-transparent animate-spin"></div>
        <p className="text-sm font-bold text-brand-navy">جاري تحميل وتحليل البيانات المالية من الـ Sandbox...</p>
      </div>
    );
  }

  const avgIncome = financials.avgMonthlyIncome12m;
  const currentObligations = financials.monthlyObligations;

  const totalObligationsWithNew = currentObligations + installment;
  const obligationRatio = avgIncome > 0 ? (totalObligationsWithNew / avgIncome) * 100 : 0;
  const originalRatio = (currentObligations / avgIncome) * 100;

  const handleCalculate = () => {
    onUpdateInstallment(installment);
    onNavigate('result');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-right">
      
      {/* Progress Steps Header */}
      <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm">
        <div className="flex flex-row-reverse items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-gray -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 right-0 w-3/5 h-1 bg-brand-purple -translate-y-1/2 z-0 transition-all"></div>
          
          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">
              ✓
            </div>
            <span className="text-xs font-bold text-brand-purple">الموافقة</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">
              ✓
            </div>
            <span className="text-xs font-bold text-brand-purple">ربط الحساب</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">
              ✓
            </div>
            <span className="text-xs font-bold text-brand-purple">التحليل المالي</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">
              4
            </div>
            <span className="text-xs font-bold text-brand-purple">اختبار الالتزام</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-brand-gray text-slate-400 flex items-center justify-center text-xs font-bold">5</div>
            <span className="text-xs font-medium text-slate-400">شهادة الملاءة</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dynamic Calculator Form Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-gray p-6 sm:p-8 shadow-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy">اختبار التزام مالي جديد</h2>
            <p className="text-xs text-slate-400">أدخل معطيات القسط أو القرض الجديد لقياس قدرتك التمويلية الفعلية بنقرة واحدة</p>
          </div>

          <div className="space-y-4">
            {/* Input 1: Loan Type */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-brand-navy block">نوع الالتزام المالي المستهدف</label>
              <select 
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-gray text-sm focus:outline-none focus:border-brand-purple"
              >
                <option value="تمويل شخصي مرن">تمويل شخصي مرن</option>
                <option value="تقسيط أجهزة إلكترونية">تقسيط أجهزة ومعدات أعمال</option>
                <option value="إيجار سكن عقاري">عقد إيجار عقاري سنوي</option>
                <option value="حد ائتماني متجدد">حد بطاقة ائتمانية متجددة</option>
              </select>
            </div>

            {/* Input 2: Installment Amount */}
            <div className="space-y-1.5 text-right">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] text-slate-400">مثال: 1,200 <RiyalSymbol className="text-slate-400" /></span>
                <label className="text-xs font-bold text-brand-navy">قيمة القسط الشهري المختبر (<RiyalSymbol className="text-slate-400" />)</label>
              </div>
              <div className="relative">
                <input 
                  type="number"
                  value={installment}
                  onChange={(e) => setInstallment(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray text-sm font-bold text-brand-navy focus:outline-none focus:border-brand-purple font-mono"
                  placeholder="1200"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400"><RiyalSymbol className="text-slate-400" /></span>
              </div>
            </div>

            {/* Grid for duration and funder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Input 3: Duration */}
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-brand-navy block">مدة السداد بالأشهر</label>
                <input 
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray text-sm focus:outline-none focus:border-brand-purple font-mono"
                  placeholder="60"
                />
              </div>

              {/* Input 4: Funder */}
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-brand-navy block">الجهة التمويلية المتوقعة</label>
                <input 
                  type="text"
                  value={funder}
                  onChange={(e) => setFunder(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray text-sm focus:outline-none focus:border-brand-purple"
                  placeholder="مصرف الإنماء"
                />
              </div>

            </div>

            {/* Input 5: Date */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-brand-navy block">تاريخ أول استحقاق شهري</label>
              <input 
                type="date"
                value={firstPaymentDate}
                onChange={(e) => setFirstPaymentDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-gray text-sm focus:outline-none focus:border-brand-purple font-mono"
              />
            </div>

          </div>

          {/* Buttons footer */}
          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4 border-t border-brand-gray justify-between">
            <button
              id="btn-calculate-index"
              onClick={handleCalculate}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-l from-brand-navy to-brand-indigo hover:shadow-lg hover:shadow-brand-navy/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>احسب مؤشر قدها للملاءة</span>
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-xl border border-brand-gray text-slate-500 hover:bg-slate-50 transition-colors font-medium text-sm cursor-pointer"
            >
              إلغاء والعودة للوحة التحكم
            </button>
          </div>
        </div>

        {/* Dynamic Left/Side Panel (Impact Estimator) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-brand-navy text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-base font-bold flex items-center gap-2 flex-row-reverse justify-start">
              <Sparkles className="w-5 h-5 text-brand-clay" />
              <span>لوحة التقدير والتحليل الذكي لأثر القسط</span>
            </h3>

            {/* Metric update animation representation */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-white/50 block">متوسط دخلك الفعلي</span>
                <span className="text-xl font-bold font-mono">11,800 <RiyalSymbol className="mr-1 text-white/60" /></span>
              </div>

              {/* Progress visual comparison before & after */}
              <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                
                {/* Before */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-white/60">نسبة الالتزامات الحالية:</span>
                    <span className="font-bold">{originalRatio.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-success rounded-full" style={{ width: `${originalRatio}%` }}></div>
                  </div>
                </div>

                {/* After */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-brand-clay font-bold">نسبة الالتزامات الإجمالية بعد القسط الجديد:</span>
                    <span className="font-bold text-brand-clay">{obligationRatio.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-clay rounded-full" style={{ width: `${obligationRatio}%` }}></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Microcopy message text box */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-brand-clay flex-row-reverse justify-start">
                <Percent className="w-4 h-4 shrink-0" />
                <span className="font-bold">أثر القسط المالي الجديد</span>
              </div>
              <p className="text-white/80 leading-relaxed font-mono">
                قسط الالتزام الجديد بقيمة <span className="font-bold text-white">{installment.toLocaleString()} <RiyalSymbol className="mr-1 text-white/80" /></span> يرفع نسبة التزاماتك من <span className="font-bold text-brand-success">{originalRatio.toFixed(0)}%</span> إلى <span className="font-bold text-brand-clay">{obligationRatio.toFixed(0)}%</span> من متوسط دخلك الشهري. هذا المؤشر يضع ملاءتك تحت الملاحظة.
              </p>
            </div>

            {/* Note text disclaimer */}
            <div className="text-[10px] text-white/40 leading-relaxed pt-2 border-t border-white/10">
              * يقوم المحاكي بقياس الأثر الإحصائي العام ولا يشكل أي موافقة رسمية من الجهات المقرضة.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
