import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowUpRight, TrendingUp, DollarSign, PieChart, ShieldCheck, ChevronLeft, ArrowDownRight, Clock } from 'lucide-react';
import { ScreenId, Transaction, UserFinancials } from '../types';

interface DashboardViewProps {
  onNavigate: (screenId: ScreenId) => void;
  financials: UserFinancials | null;
  loading: boolean;
}

export default function DashboardView({ onNavigate, financials, loading }: DashboardViewProps) {
  if (loading || !financials) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-purple border-t-transparent animate-spin"></div>
        <p className="text-sm font-bold text-brand-navy">جاري تحميل وتحليل البيانات المالية من الـ Sandbox...</p>
      </div>
    );
  }

  // Get values dynamically from the backend financials payload
  const avgIncome = financials.avgMonthlyIncome12m;
  const avgObligations = financials.monthlyObligations;
  const avgExpenses = financials.avgMonthlyExpenses;
  const avgSurplus = avgIncome - avgExpenses - avgObligations;
  const balanceStability = financials.incomeVolatilityScore; // stability mapping

  // Expenses categories proportional to user's average expenses
  const categories = [
    { name: 'سكن وفواتير', value: Math.round(avgExpenses * 0.42), color: '#071B33', percentage: '42%' },
    { name: 'معيشة ومطاعم', value: Math.round(avgExpenses * 0.27), color: '#C86B4F', percentage: '27%' },
    { name: 'أدوات برمجية ومشاريع', value: Math.round(avgExpenses * 0.16), color: '#8F8BEA', percentage: '16%' },
    { name: 'مواصلات وبنزين', value: Math.round(avgExpenses * 0.09), color: '#2BB673', percentage: '9%' },
    { name: 'اشتراكات وخدمات', value: Math.round(avgExpenses * 0.06), color: '#24234F', percentage: '6%' },
  ];

  // 12-Month names
  const monthLabels = ['أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'];

  // SVG dimensions for 12 months graph
  const width = 580;
  const height = 200;
  const padding = 30;

  // Use the monthly history from backend or fallback to static
  const monthlyIncome = financials.monthlyIncomeHistory || [11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800];
  const maxIncome = Math.max(...monthlyIncome);
  const minIncome = Math.min(...monthlyIncome);
  
  const points = monthlyIncome.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (monthlyIncome.length - 1);
    const range = maxIncome - minIncome || 1000;
    const y = height - padding - ((val - (minIncome - range * 0.1)) * (height - padding * 2)) / (range * 1.2);
    return { x, y, value: val, month: monthLabels[idx] };
  });

  const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  const [activePoint, setActivePoint] = useState<any>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-right">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-brand-navy to-brand-indigo rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row-reverse justify-between items-center gap-6">
        <div className="space-y-2 text-center sm:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-purple text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بيانات المصرفية المفتوحة نشطة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">مرحباً {financials.name.split(' ')[0]}، هذه صورة مختصرة عن قدرتك المالية</h2>
          <p className="text-xs sm:text-sm text-white/75">
            لقد تم تحليل كشف حسابك البنكي على مدار <span className="font-bold text-brand-clay">12 شهراً</span> بنجاح. بياناتك آمنة بموجب معايير البنك المركزي السعودي.
          </p>
        </div>

        <button
          onClick={() => onNavigate('test_obligation')}
          className="px-6 py-3.5 rounded-xl bg-brand-clay hover:bg-brand-clay/90 text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>اختبر التزاماً جديداً</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm space-y-3">
          <span className="text-xs text-slate-400 font-bold block">متوسط الدخل الشهري (12 شهر)</span>
          <div className="flex justify-between items-baseline flex-row-reverse">
            <span className="text-2xl font-black text-brand-navy font-mono">{avgIncome.toLocaleString()} ر.س</span>
            <span className="text-xs text-brand-success font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>{financials.incomeVolatilityScore <= 15 ? 'مستقر' : 'متذبذب'}</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-500">مبني على التدفقات الفعلية المودعة بالحساب</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm space-y-3">
          <span className="text-xs text-slate-400 font-bold block">الالتزامات البنكية القائمة</span>
          <div className="flex justify-between items-baseline flex-row-reverse">
            <span className="text-2xl font-black text-brand-navy font-mono">{avgObligations.toLocaleString()} ر.س</span>
            <span className="text-xs text-brand-clay font-bold flex items-center gap-0.5">
              <span>{((avgObligations / avgIncome) * 100).toFixed(0)}% من الدخل</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-500">إجمالي الاستقطاعات والالتزامات النشطة حالياً</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm space-y-3">
          <span className="text-xs text-slate-400 font-bold block">الفائض المالي الشهري المتاح</span>
          <div className="flex justify-between items-baseline flex-row-reverse">
            <span className="text-2xl font-black text-brand-navy font-mono">{avgSurplus.toLocaleString()} ر.س</span>
            <span className="text-xs text-brand-success font-bold flex items-center gap-0.5">
              <span>{avgSurplus > 0 ? 'إيجابي' : 'سلبي'}</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-500">بعد خصم المصاريف المعيشية المتغيرة والالتزامات</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm space-y-3">
          <span className="text-xs text-slate-400 font-bold block">مؤشر استقرار التدفق النقدي</span>
          <div className="flex justify-between items-baseline flex-row-reverse">
            <span className="text-2xl font-black text-brand-navy font-mono">{balanceStability}%</span>
            <span className="text-xs text-brand-purple font-bold">
              {balanceStability >= 75 ? 'ملاءة ممتازة' : balanceStability >= 50 ? 'ملاءة جيدة' : 'ملاءة بحذر'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">يعبر عن مدى انتظام واستقرار الرصيد طوال العام</p>
        </div>

      </div>

      {/* Main Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cashflow Line Chart (12 Months) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-brand-gray shadow-sm space-y-6">
          <div className="flex justify-between items-center flex-row-reverse">
            <div>
              <h3 className="text-lg font-bold text-brand-navy">منحنى التدفق النقدي الوارد (السنة الماضية)</h3>
              <p className="text-xs text-slate-400">تغير ومحاكاة الدخل الشهري الفعلي لـ {financials.name.split(' ')[0]} على مدار 12 شهراً</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-clay block"></span>
              <span>الدخل ر.س</span>
            </div>
          </div>

          {/* SVG Graph rendering */}
          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[580px] h-[220px]">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
                <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeWidth="1" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" />

                {/* Grid Values Labels */}
                <text x={padding - 5} y={padding + 4} textAnchor="end" fill="#94a3b8" className="text-[10px] font-mono">14k</text>
                <text x={padding - 5} y={height / 2 + 4} textAnchor="end" fill="#94a3b8" className="text-[10px] font-mono">10k</text>
                <text x={padding - 5} y={height - padding + 4} textAnchor="end" fill="#94a3b8" className="text-[10px] font-mono">6k</text>

                {/* Main Path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#line-grad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="animate-drawPath"
                />

                {/* Path Gradient Definition */}
                <defs>
                  <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8F8BEA" />
                    <stop offset="50%" stopColor="#C86B4F" />
                    <stop offset="100%" stopColor="#071B33" />
                  </linearGradient>
                </defs>

                {/* Chart Dots & Interactive Hover Regions */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      className="fill-white stroke-brand-clay stroke-[2] cursor-pointer hover:scale-150 transition-transform"
                      onMouseEnter={() => setActivePoint(p)}
                      onMouseLeave={() => setActivePoint(null)}
                    />
                    {/* X Axis Labels */}
                    <text
                      x={p.x}
                      y={height - padding + 16}
                      textAnchor="middle"
                      fill="#64748b"
                      className="text-[9px] font-semibold"
                    >
                      {p.month}
                    </text>
                  </g>
                ))}

                {/* SVG Tooltip showing hover point value */}
                {activePoint && (
                  <g>
                    <rect
                      x={activePoint.x - 45}
                      y={activePoint.y - 35}
                      width="90"
                      height="24"
                      rx="6"
                      fill="#071B33"
                      className="opacity-95"
                    />
                    <text
                      x={activePoint.x}
                      y={activePoint.y - 20}
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-[10px] font-bold font-mono"
                    >
                      {activePoint.value.toLocaleString()} ر.س
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Expenses Distribution Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-brand-gray shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-brand-navy">توزيع المصاريف الشهرية</h3>
            <p className="text-xs text-slate-400">تقدير استهلاك التدفقات النقدية الخارجة</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Pure SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                <circle cx="70" cy="70" r="50" fill="none" stroke="#EEF1F4" strokeWidth="16" />
                
                {/* Segment 1: Housing SA93 (42%) */}
                <circle cx="70" cy="70" r="50" fill="none" stroke="#071B33" strokeWidth="18"
                  strokeDasharray="314" strokeDashoffset="132" strokeLinecap="round" />
                  
                {/* Segment 2: Food (27%) */}
                <circle cx="70" cy="70" r="50" fill="none" stroke="#C86B4F" strokeWidth="18"
                  strokeDasharray="314" strokeDashoffset="217" className="transform origin-[70px_70px] rotate-[151deg]" />
                  
                {/* Segment 3: Work (16%) */}
                <circle cx="70" cy="70" r="50" fill="none" stroke="#8F8BEA" strokeWidth="18"
                  strokeDasharray="314" strokeDashoffset="264" className="transform origin-[70px_70px] rotate-[248deg]" />
              </svg>
              
              <div className="absolute text-center">
                <span className="text-xs text-slate-400 block">إجمالي الصرف</span>
                <span className="text-sm font-black font-mono text-brand-navy">{avgExpenses.toLocaleString()} ر.س</span>
              </div>
            </div>

            {/* Labels Legend */}
            <div className="w-full space-y-2">
              {categories.map((c, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: c.color }}></span>
                    <span className="text-slate-600">{c.name}</span>
                  </div>
                  <div className="flex gap-2 items-center font-mono">
                    <span className="font-bold text-brand-navy">{c.value.toLocaleString()} ر.س</span>
                    <span className="text-slate-400">({c.percentage})</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Recurrent Commitments Section */}
      <div className="bg-white rounded-3xl p-6 border border-brand-gray shadow-sm">
        <h3 className="text-lg font-bold text-brand-navy mb-4">الالتزامات المتكررة المكتشفة تلقائياً</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl border border-brand-gray bg-slate-50/50 flex justify-between items-center flex-row-reverse text-right">
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-navy">تمويل شخصي / التزامات قائمة</h4>
                <p className="text-[10px] text-slate-400">حسم مباشر من الرصيد • استقطاع تلقائي</p>
              </div>
            </div>
            <div className="text-left font-mono">
              <span className="text-sm font-black block text-brand-navy">{(avgObligations > 250 ? avgObligations - 250 : avgObligations).toLocaleString()} ر.س</span>
              <span className="text-[10px] text-slate-400 block">يوم 27 من كل شهر</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-brand-gray bg-slate-50/50 flex justify-between items-center flex-row-reverse text-right">
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/5 flex items-center justify-center text-brand-purple">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-navy">فواتير الاتصالات وبوابات الدفع</h4>
                <p className="text-[10px] text-slate-400">فوترة الاتصالات السعودية ومتاجر إلكترونية</p>
              </div>
            </div>
            <div className="text-left font-mono">
              <span className="text-sm font-black block text-brand-navy">{(avgObligations > 250 ? 250 : 0).toLocaleString()} ر.س</span>
              <span className="text-[10px] text-slate-400 block">متوسط صرف متكرر</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
