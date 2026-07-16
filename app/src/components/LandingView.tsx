import React from 'react';
import { Shield, Sparkles, TrendingUp, CheckCircle2, ChevronLeft, ArrowLeft } from 'lucide-react';
import { ScreenId } from '../types';

interface LandingViewProps {
  onNavigate: (screenId: ScreenId) => void;
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 md:py-20 lg:py-24">
      {/* Background modern geometric shapes (Tuwaiq & Alinma inspired) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-12 -left-20 w-96 h-96 rounded-full bg-brand-purple filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-brand-clay filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content Block */}
          <div className="lg:col-span-7 space-y-8 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>هاكاثون أمد للتقنية المالية 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-navy leading-tight">
              اختبر قدرتك <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-clay via-brand-purple to-brand-indigo">
                قبل الالتزام المالي
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              قدها تحلل تدفقك النقدي والتزاماتك لتصدر مؤشر ملاءة وشهادة مختصرة قابلة للمشاركة دون كشف الحساب الكامل. حل ذكي ومبتكر للمستقلين وأصحاب الدخل غير المنتظم للتحقق من الملاءة بأمان تام وخصوصية متناهية.
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-col sm:flex-row-reverse gap-4 justify-start pt-2">
              <button
                id="btn-start-evaluation"
                onClick={() => onNavigate('consent')}
                className="px-8 py-4 rounded-xl bg-gradient-to-l from-brand-navy to-brand-indigo text-white font-bold hover:shadow-lg hover:shadow-brand-navy/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>ابدأ اختبار الملاءة</span>
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <button
                id="btn-view-sample"
                onClick={() => onNavigate('certificate')}
                className="px-8 py-4 rounded-xl bg-white border border-brand-gray text-brand-navy font-bold hover:bg-brand-gray/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>عرض نموذج الشهادة</span>
              </button>
            </div>

            {/* Micro-copy representing privacy */}
            <div className="flex items-center gap-2 text-xs text-slate-500 justify-start">
              <Shield className="w-4 h-4 text-brand-success" />
              <span>نشارك الملخص فقط، وليس كشف الحساب الكامل. بياناتك مشفرة ومحمية ببروتوكولات المصرفية المفتوحة.</span>
            </div>
          </div>

          {/* Visual Floating Card Block */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Background design elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/10 to-brand-clay/10 rounded-3xl transform rotate-3 scale-105 pointer-events-none"></div>
            
            {/* Interactive Preview Card Container */}
            <div className="w-full max-w-sm bg-brand-navy text-white rounded-3xl p-6 shadow-2xl relative border border-white/10 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Card glossy reflection */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full filter blur-xl"></div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-brand-purple font-medium">بطاقة ملاءة ذكية</span>
                <div className="flex items-center gap-1.5 text-brand-clay">
                  <div className="w-2 h-2 rounded-full bg-brand-clay animate-ping"></div>
                  <span className="text-xs font-semibold font-mono">قدها QDH</span>
                </div>
              </div>

              {/* Solvency Circle Score */}
              <div className="flex flex-col items-center my-6 space-y-3">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {/* SVG Arc for gauge */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-white/10 fill-none"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-brand-clay fill-none"
                      strokeWidth="10"
                      strokeDasharray="339"
                      strokeDashoffset="95" // representing ~72%
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-center">
                    <span className="text-3xl font-extrabold font-mono block">72</span>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest block">مؤشر قدها</span>
                  </div>
                </div>

                <div className="bg-brand-clay/20 text-brand-clay border border-brand-clay/30 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-clay"></span>
                  <span>مناسب بحذر</span>
                </div>
              </div>

              {/* Card specs list */}
              <div className="space-y-3.5 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">القسط المستهدف للتقييم:</span>
                  <span className="font-bold">1,200 ر.س / شهرياً</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">نسبة الالتزامات المقدرة:</span>
                  <span className="font-bold text-brand-clay">37%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">حالة الخصوصية:</span>
                  <span className="text-brand-success font-semibold">ملخص مختصر نشط</span>
                </div>
              </div>

              {/* Bottom footer bar on card */}
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-white/40">
                <span>تحديث تلقائي عبر المصرفية المفتوحة</span>
                <span className="font-mono">VERIFIED</span>
              </div>
            </div>
          </div>

        </div>

        {/* Benefits Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          
          <div className="bg-white rounded-2xl p-6 border border-brand-gray hover:border-brand-purple/30 transition-all shadow-sm space-y-4 text-right">
            <div className="w-12 h-12 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy">تحليل ذكي للتدفق النقدي</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              يقوم نظام قدها بقراءة وتحليل كشوف الحسابات البنكية بشكل مشفر وحساب متوسط الدخل والتذبذب الحقيقي على مدار 12 شهراً بدقة تامة.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-gray hover:border-brand-purple/30 transition-all shadow-sm space-y-4 text-right">
            <div className="w-12 h-12 rounded-xl bg-brand-clay/5 flex items-center justify-center text-brand-clay">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy">شهادة ملاءة مختصرة</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              أصدر وثيقة توثيق ملاءة رسمية مختصرة تحتوي على مؤشراتك العامة فقط لمشاركتها مع الجهات الممولة دون الحاجة لكشف خصوصية عملياتك كاملة.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-gray hover:border-brand-purple/30 transition-all shadow-sm space-y-4 text-right">
            <div className="w-12 h-12 rounded-xl bg-brand-purple/5 flex items-center justify-center text-brand-purple">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy">توصيات عملية للتحسين</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              إذا كانت ملاءتك بحاجة لحذر، يقدم لك المساعد الذكي خطة مخصصة بالخطوات والتواريخ والنسب لزيادة الملاءة ورفع مؤشر القبول بنجاح.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
