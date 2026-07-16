import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, CheckSquare, Square, Check, Lock, ChevronLeft, AlertCircle } from 'lucide-react';
import { ScreenId } from '../types';

interface ConsentViewProps {
  onNavigate: (screenId: ScreenId) => void;
}

export default function ConsentView({ onNavigate }: ConsentViewProps) {
  const [agreed, setAgreed] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [scopes, setScopes] = useState({
    transactions: true,
    analytics: true,
    obligations: true,
    certificate: true,
  });

  const handleNext = () => {
    if (agreed) {
      onNavigate('connect');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Steps Indicator Progress Bar */}
      <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-gray -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 right-0 w-1/5 h-1 bg-brand-purple -translate-y-1/2 z-0 transition-all"></div>
          
          {/* Steps */}
          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-brand-purple">الموافقة</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-brand-gray text-slate-400 flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-xs font-medium text-slate-400">ربط الحساب</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-brand-gray text-slate-400 flex items-center justify-center text-xs font-bold">3</div>
            <span className="text-xs font-medium text-slate-400">التحليل المالي</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-brand-gray text-slate-400 flex items-center justify-center text-xs font-bold">4</div>
            <span className="text-xs font-medium text-slate-400">اختبار الالتزام</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-brand-gray text-slate-400 flex items-center justify-center text-xs font-bold">5</div>
            <span className="text-xs font-medium text-slate-400">شهادة الملاءة</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-brand-gray p-6 sm:p-10 shadow-lg space-y-8 relative overflow-hidden">
        
        {/* Safe Badge indicator */}
        <div className="absolute top-0 left-0 bg-brand-success/10 border-b border-r border-brand-success/20 text-brand-success px-4 py-2 text-xs font-bold rounded-br-2xl flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" />
          <span>بيئة موافقة آمنة</span>
        </div>

        {/* Heading */}
        <div className="space-y-3 pt-4 text-center sm:text-right">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            شاشة الترحيب والموافقة الصريحة
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            مرحباً بك في منصة <span className="font-bold text-brand-indigo">قدها</span>. قبل ربط حسابك البنكي، نود إطلاعك على صلاحيات القراءة والتحليل التي سنستخدمها. نؤكد لك أن جميع بياناتك تُعامل بسرية تامة ولا نشارك تفاصيل العمليات مع أي جهة خارجية.
          </p>
        </div>

        {/* Reassurance Banner */}
        <div className="bg-brand-navy/5 border-r-4 border-brand-purple p-4 rounded-xl flex items-start gap-3 text-right">
          <ShieldAlert className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-brand-navy">مبدأ الخصوصية وتقليل البيانات</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              سنستخدم بيانات حسابك البنكي بغرض تحليل الملاءة واستخراج مؤشر قدها فقط. <span className="font-bold text-brand-navy">لن نقوم أبداً بمشاركة كشف الحساب الكامل</span> أو تفاصيل عملياتك البنكية اليومية مع أي جهة ائتمانية أو تمويلية.
            </p>
          </div>
        </div>

        {/* Permission List Scopes */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-brand-navy text-right">الصلاحيات المطلوبة:</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Scope 1 */}
            <div className={`p-4 rounded-xl border transition-all text-right space-y-2 relative ${scopes.transactions ? 'border-brand-purple/30 bg-brand-purple/5' : 'border-brand-gray bg-white'}`}>
              <div className="flex justify-between items-start">
                <span className="w-2 h-2 rounded-full bg-brand-purple mt-1.5"></span>
                <h4 className="text-sm font-bold text-brand-navy">قراءة وتحليل العمليات</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                مسح العمليات وتصنيف الدخل والمصاريف للـ 12 شهراً الماضية لحساب معدلات الاستقرار.
              </p>
            </div>

            {/* Scope 2 */}
            <div className={`p-4 rounded-xl border transition-all text-right space-y-2 relative ${scopes.analytics ? 'border-brand-purple/30 bg-brand-purple/5' : 'border-brand-gray bg-white'}`}>
              <div className="flex justify-between items-start">
                <span className="w-2 h-2 rounded-full bg-brand-purple mt-1.5"></span>
                <h4 className="text-sm font-bold text-brand-navy">تحليل الدخل والمصاريف</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                مقارنة متوسط الدخل الشهري مع المصاريف المتغيرة والثابتة لتحديد الهامش الإجمالي والاحتياطي.
              </p>
            </div>

            {/* Scope 3 */}
            <div className={`p-4 rounded-xl border transition-all text-right space-y-2 relative ${scopes.obligations ? 'border-brand-purple/30 bg-brand-purple/5' : 'border-brand-gray bg-white'}`}>
              <div className="flex justify-between items-start">
                <span className="w-2 h-2 rounded-full bg-brand-purple mt-1.5"></span>
                <h4 className="text-sm font-bold text-brand-navy">كشف الالتزامات المتكررة</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                التعرف على الفواتير، الأقساط، والالتزامات القائمة المستقطعة تلقائياً لمقارنتها بنسبة الاستدانة.
              </p>
            </div>

            {/* Scope 4 */}
            <div className={`p-4 rounded-xl border transition-all text-right space-y-2 relative ${scopes.certificate ? 'border-brand-purple/30 bg-brand-purple/5' : 'border-brand-gray bg-white'}`}>
              <div className="flex justify-between items-start">
                <span className="w-2 h-2 rounded-full bg-brand-purple mt-1.5"></span>
                <h4 className="text-sm font-bold text-brand-navy">إنشاء شهادة ملاءة مختصرة</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                ترخيص توليد وثيقة توثيق إلكترونية مشفرة ومختصرة برمز تحقق QR فريد دون مشاركة كشف حسابك.
              </p>
            </div>

          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="space-y-4 pt-4 border-t border-brand-gray">
          <label 
            onClick={() => setAgreed(!agreed)}
            className="flex items-start gap-3 text-right cursor-pointer group"
          >
            <div className="shrink-0 mt-0.5 text-brand-purple">
              {agreed ? (
                <CheckSquare className="w-6 h-6 fill-brand-purple/10" />
              ) : (
                <Square className="w-6 h-6 text-slate-400 group-hover:text-brand-purple transition-colors" />
              )}
            </div>
            <div className="space-y-1">
              <span className="text-sm font-bold text-brand-navy">
                أوافق على استخدام بيانات حسابي لغرض تحليل ملاءتي المالية وإصدار شهادة قدها فقط.
              </span>
              <p className="text-xs text-slate-500">
                أقر بقراءتي لسياسة الخصوصية وأوافق على ربط حسابي بشكل آمن لفترة مؤقتة. أستطيع إلغاء الربط وحذف البيانات بأي وقت.
              </p>
            </div>
          </label>

          {/* Privacy settings trigger link */}
          <div className="text-right">
            <button
              onClick={() => setShowPrivacySettings(!showPrivacySettings)}
              className="text-xs font-bold text-brand-purple hover:underline"
            >
              عرض وتعديل تفاصيل صلاحيات الخصوصية
            </button>
          </div>

          {/* Custom interactive privacy popover */}
          {showPrivacySettings && (
            <div className="bg-slate-50 rounded-xl p-4 border border-brand-gray text-right space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-brand-navy flex items-center gap-1 justify-end">
                <span>إعدادات خصوصية الملاءة المخصصة</span>
                <AlertCircle className="w-4 h-4 text-brand-purple" />
              </h4>
              <p className="text-[11px] text-slate-500">
                يمكنك تمكين أو تعطيل مستويات الوصول الفرعية التي يقوم بها النظام:
              </p>
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between">
                  <input 
                    type="checkbox" 
                    checked={scopes.transactions} 
                    onChange={(e) => setScopes({ ...scopes, transactions: e.target.checked })}
                    className="rounded text-brand-purple focus:ring-brand-purple"
                  />
                  <span>السماح بقراءة المعاملات السنوية (مطلوب للتقييم الدقيق)</span>
                </label>
                <label className="flex items-center justify-between">
                  <input 
                    type="checkbox" 
                    checked={scopes.analytics} 
                    onChange={(e) => setScopes({ ...scopes, analytics: e.target.checked })}
                    className="rounded text-brand-purple focus:ring-brand-purple"
                  />
                  <span>تخزين مؤشرات التحليلات الإحصائية فقط وحذف السجل المباشر</span>
                </label>
                <label className="flex items-center justify-between">
                  <input 
                    type="checkbox" 
                    checked={scopes.certificate} 
                    onChange={(e) => setScopes({ ...scopes, certificate: e.target.checked })}
                    className="rounded text-brand-purple focus:ring-brand-purple"
                  />
                  <span>السماح بإنشاء رابط QR للمشاركة الآمنة مع شركات التمويل</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-between border-t border-brand-gray">
          <button
            id="btn-agree-continue"
            disabled={!agreed}
            onClick={handleNext}
            className={`px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${agreed ? 'bg-gradient-to-l from-brand-navy to-brand-indigo text-white hover:shadow-lg hover:shadow-brand-navy/20 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <span>أوافق وأكمل</span>
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            id="btn-cancel-consent"
            onClick={() => onNavigate('landing')}
            className="px-6 py-3.5 rounded-xl border border-brand-gray text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors font-medium text-sm cursor-pointer"
          >
            إلغاء والعودة للرئيسية
          </button>
        </div>

      </div>
    </div>
  );
}
