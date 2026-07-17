import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowUpRight, TrendingUp, DollarSign, PieChart, ShieldCheck, ChevronLeft, ArrowDownRight, Clock } from 'lucide-react';
import { ScreenId, Transaction, UserFinancials } from '../types';
import RiyalSymbol from './RiyalSymbol';

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
  const monthlyExpenses = financials.monthlyExpensesHistory || [8500, 9200, 7800, 8900, 9500, 8100, 8400, 9000, 8700, 9100, 8300, 8600];

  const allValues = [...monthlyIncome, ...monthlyExpenses];
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1000;

  const incomePoints = monthlyIncome.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (monthlyIncome.length - 1);
    const y = height - padding - ((val - (minValue - range * 0.1)) * (height - padding * 2)) / (range * 1.2);
    return { x, y, value: val, month: monthLabels[idx], type: 'income' };
  });

  const expensePoints = monthlyExpenses.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (monthlyExpenses.length - 1);
    const y = height - padding - ((val - (minValue - range * 0.1)) * (height - padding * 2)) / (range * 1.2);
    return { x, y, value: val, month: monthLabels[idx], type: 'expense' };
  });

  const incomePathD = `M ${incomePoints[0].x} ${incomePoints[0].y} ` + incomePoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const expensePathD = `M ${expensePoints[0].x} ${expensePoints[0].y} ` + expensePoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  const topLabel = `${(maxValue / 1000).toFixed(1)}k`;
  const midLabel = `${((maxValue + minValue) / 2 / 1000).toFixed(1)}k`;
  const botLabel = `${(minValue / 1000).toFixed(1)}k`;

  const [activeMonthIdx, setActiveMonthIdx] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-right">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-brand-navy to-brand-indigo rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-6">
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
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-black text-brand-navy font-mono">{avgIncome.toLocaleString()} <RiyalSymbol className="mr-1 text-slate-500" /></span>
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
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-black text-brand-navy font-mono">{avgObligations.toLocaleString()} <RiyalSymbol className="mr-1 text-slate-500" /></span>
            <span className="text-xs text-brand-clay font-bold flex items-center gap-0.5">
              <span>{((avgObligations / avgIncome) * 100).toFixed(0)}% من الدخل</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-500">إجمالي الاستقطاعات والالتزامات النشطة حالياً</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm space-y-3">
          <span className="text-xs text-slate-400 font-bold block">الفائض المالي الشهري المتاح</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-black text-brand-navy font-mono">{avgSurplus.toLocaleString()} <RiyalSymbol className="mr-1 text-slate-500" /></span>
            <span className="text-xs text-brand-success font-bold flex items-center gap-0.5">
              <span>{avgSurplus > 0 ? 'إيجابي' : 'سلبي'}</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-500">بعد خصم المصاريف المعيشية المتغيرة والالتزامات</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm space-y-3">
          <span className="text-xs text-slate-400 font-bold block">مؤشر استقرار التدفق النقدي</span>
          <div className="flex justify-between items-baseline">
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
              <h3 className="text-lg font-bold text-brand-navy">منحنى التدفقات النقدية (السنة الماضية)</h3>
              <p className="text-xs text-slate-400">مقارنة التدفقات النقدية الداخلة (الواردة) والخارجة (الصادرة) شهرياً لـ {financials.name.split(' ')[0]}</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 flex-row-reverse">
                <span className="w-3 h-3 rounded-full bg-brand-purple block"></span>
                <span className="text-slate-600">التدفق الداخل (الوارد)</span>
              </div>
              <div className="flex items-center gap-1.5 flex-row-reverse">
                <span className="w-3 h-3 rounded-full bg-brand-clay block"></span>
                <span className="text-slate-600">التدفق الخارج (الصادر)</span>
              </div>
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
                <text x={padding - 5} y={padding + 4} textAnchor="end" fill="#94a3b8" className="text-[10px] font-mono">{topLabel}</text>
                <text x={padding - 5} y={height / 2 + 4} textAnchor="end" fill="#94a3b8" className="text-[10px] font-mono">{midLabel}</text>
                <text x={padding - 5} y={height - padding + 4} textAnchor="end" fill="#94a3b8" className="text-[10px] font-mono">{botLabel}</text>

                {/* Path Gradients Definition */}
                <defs>
                  <linearGradient id="income-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8F8BEA" />
                    <stop offset="100%" stopColor="#24234F" />
                  </linearGradient>
                  <linearGradient id="expense-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C86B4F" />
                    <stop offset="100%" stopColor="#E11D48" />
                  </linearGradient>
                </defs>

                {/* Income Path */}
                <path
                  d={incomePathD}
                  fill="none"
                  stroke="url(#income-grad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="animate-drawPath"
                />

                {/* Expense Path */}
                <path
                  d={expensePathD}
                  fill="none"
                  stroke="url(#expense-grad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="animate-drawPath opacity-80"
                />

                {/* Active Column Dotted Line */}
                {activeMonthIdx !== null && (
                  <line
                    x1={incomePoints[activeMonthIdx].x}
                    y1={padding}
                    x2={incomePoints[activeMonthIdx].x}
                    y2={height - padding}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    pointerEvents="none"
                  />
                )}

                {/* Income Dots */}
                {incomePoints.map((p, i) => (
                  <circle
                    key={`inc-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={activeMonthIdx === i ? "5.5" : "4"}
                    className={`fill-white stroke-brand-purple ${activeMonthIdx === i ? "stroke-[3]" : "stroke-[2]"} transition-all`}
                    pointerEvents="none"
                  />
                ))}

                {/* Expense Dots */}
                {expensePoints.map((p, i) => (
                  <circle
                    key={`exp-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={activeMonthIdx === i ? "5.5" : "4"}
                    className={`fill-white stroke-brand-clay ${activeMonthIdx === i ? "stroke-[3]" : "stroke-[2]"} transition-all`}
                    pointerEvents="none"
                  />
                ))}

                {/* Transparent Hover Columns */}
                {incomePoints.map((p, i) => {
                  const barWidth = (width - padding * 2) / (incomePoints.length - 1);
                  return (
                    <rect
                      key={`hover-${i}`}
                      x={p.x - barWidth / 2}
                      y={0}
                      width={barWidth}
                      height={height}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setActiveMonthIdx(i)}
                      onMouseLeave={() => setActiveMonthIdx(null)}
                    />
                  );
                })}

                {/* X Axis Labels */}
                {incomePoints.map((p, i) => (
                  <text
                    key={`lbl-${i}`}
                    x={p.x}
                    y={height - padding + 16}
                    textAnchor="middle"
                    fill={activeMonthIdx === i ? "#071B33" : "#64748b"}
                    className={`text-[9px] ${activeMonthIdx === i ? "font-black" : "font-semibold"} transition-all`}
                    pointerEvents="none"
                  >
                    {p.month}
                  </text>
                ))}

                {/* Combined Tooltip showing both incoming and outgoing values for active month */}
                {activeMonthIdx !== null && (
                  <g pointerEvents="none" className="z-30">
                    <rect
                      x={
                        incomePoints[activeMonthIdx].x + 
                        (activeMonthIdx > 8 ? -135 : activeMonthIdx < 3 ? 15 : -60)
                      }
                      y={padding}
                      width="120"
                      height="60"
                      rx="8"
                      fill="#071B33"
                      className="opacity-95 shadow-lg"
                    />
                    {/* Tooltip Title: Month name */}
                    <text
                      x={
                        incomePoints[activeMonthIdx].x + 
                        (activeMonthIdx > 8 ? -75 : activeMonthIdx < 3 ? 75 : 0)
                      }
                      y={padding + 16}
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-[9px] font-black"
                    >
                      شهر {monthLabels[activeMonthIdx]}
                    </text>
                    {/* Income value */}
                    <text
                      x={
                        incomePoints[activeMonthIdx].x + 
                        (activeMonthIdx > 8 ? -75 : activeMonthIdx < 3 ? 75 : 0)
                      }
                      y={padding + 32}
                      textAnchor="middle"
                      fill="#8F8BEA"
                      className="text-[9px] font-bold"
                    >
                      الوارد: {monthlyIncome[activeMonthIdx].toLocaleString()} ⃁
                    </text>
                    {/* Expense value */}
                    <text
                      x={
                        incomePoints[activeMonthIdx].x + 
                        (activeMonthIdx > 8 ? -75 : activeMonthIdx < 3 ? 75 : 0)
                      }
                      y={padding + 48}
                      textAnchor="middle"
                      fill="#C86B4F"
                      className="text-[9px] font-bold"
                    >
                      الصادر: {monthlyExpenses[activeMonthIdx].toLocaleString()} ⃁
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
                <span className="text-sm font-black font-mono text-brand-navy">{avgExpenses.toLocaleString()} <RiyalSymbol className="mr-0.5 text-slate-500" /></span>
              </div>
            </div>

            <div className="w-full space-y-2">
              {categories.map((c, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: c.color }}></span>
                    <span className="text-slate-600">{c.name}</span>
                  </div>
                  <div className="flex gap-2 items-center font-mono">
                    <span className="font-bold text-brand-navy">{c.value.toLocaleString()} <RiyalSymbol className="mr-0.5 text-slate-400" /></span>
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
          
          <div className="p-4 rounded-2xl border border-brand-gray bg-slate-50/50 flex justify-between items-center text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-navy">تمويل شخصي / التزامات قائمة</h4>
                <p className="text-[10px] text-slate-400">حسم مباشر من الرصيد • استقطاع تلقائي</p>
              </div>
            </div>
            <div className="text-left font-mono">
              <span className="text-sm font-black block text-brand-navy">{(avgObligations > 250 ? avgObligations - 250 : avgObligations).toLocaleString()} <RiyalSymbol className="mr-0.5 text-slate-500" /></span>
              <span className="text-[10px] text-slate-400 block">يوم 27 من كل شهر</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-brand-gray bg-slate-50/50 flex justify-between items-center text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/5 flex items-center justify-center text-brand-purple">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-navy">فواتير الاتصالات وبوابات الدفع</h4>
                <p className="text-[10px] text-slate-400">فوترة الاتصالات السعودية ومتاجر إلكترونية</p>
              </div>
            </div>
            <div className="text-left font-mono">
              <span className="text-sm font-black block text-brand-navy">{(avgObligations > 250 ? 250 : 0).toLocaleString()} <RiyalSymbol className="mr-0.5 text-slate-500" /></span>
              <span className="text-[10px] text-slate-400 block">متوسط صرف متكرر</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
