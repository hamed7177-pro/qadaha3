import React, { useState } from 'react';
import { ShieldCheck, ToggleLeft, ToggleRight, Trash2, Clock, Check, ArrowRight, ShieldAlert, Lock, RefreshCw, EyeOff } from 'lucide-react';
import { ScreenId } from '../types';

interface PrivacyViewProps {
  onNavigate: (screenId: ScreenId) => void;
}

export default function PrivacyView({ onNavigate }: PrivacyViewProps) {
  const [activeSharing, setActiveSharing] = useState(true);
  const [scopes, setScopes] = useState({
    transactions: true,
    analytics: true,
    certificate: true,
  });

  const [logs, setLogs] = useState([
    { event: 'تم إنشاء شهادة الملاءة بنجاح', date: '2026-07-16 11:24 ص', type: 'success' },
    { event: 'تم نسخ رابط التوثيق المالي لمشاركته', date: '2026-07-16 11:25 ص', type: 'info' },
    { event: 'تم تحديث البيانات من مصرف الإنماء عبر المصرفية المفتوحة', date: '2026-07-16 11:15 ص', type: 'refresh' },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleToggleSharing = () => {
    const nextState = !activeSharing;
    setActiveSharing(nextState);
    showToast(nextState ? 'تم تفعيل مشاركة الشهادة ورابط التوثيق' : 'تم إيقاف رابط المشاركة بنجاح. لن تتمكن أي جهة من رؤية ملاءتك.');
    
    // Add event log
    setLogs([
      { 
        event: nextState ? 'تم تمكين مشاركة رابط الشهادة' : 'تم تعطيل وإلغاء صلاحية مشاركة الشهادة فوراً', 
        date: 'الآن', 
        type: nextState ? 'success' : 'warn' 
      },
      ...logs
    ]);
  };

  const handleDeleteAll = () => {
    const confirmDelete = window.confirm('هل أنت متأكد من رغبتك في حذف جميع بيانات التحليل المالي والملفات المرتبطة من منصة قدها بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.');
    if (confirmDelete) {
      showToast('تم حذف جميع البيانات وكشوفات الحسابات المرتبطة بنجاح.');
      setTimeout(() => {
        onNavigate('landing');
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-right">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-brand-navy text-white px-6 py-3 rounded-xl shadow-2xl z-50 text-sm font-bold flex items-center gap-2 border border-brand-purple/20">
          <Check className="w-4 h-4 text-brand-success" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy">إدارة الخصوصية والصلاحيات النشطة</h2>
          <p className="text-xs text-slate-400">تحكم بخصوصية بياناتك وصلاحيات الشهادة، والغي الارتباط فوراً بأي وقت</p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 rounded-xl border border-brand-gray bg-white text-xs font-bold hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
        >
          <span>الرجوع للوحة التحكم</span>
        </button>
      </div>

      {/* Sharing controls switch card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gray shadow-sm space-y-4">
        <div className="flex justify-between items-center flex-row-reverse">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-brand-navy">مشاركة رابط الشهادة والتوثيق</h3>
            <p className="text-xs text-slate-400">عند تعطيل هذا الخيار، سيتم إلغاء صلاحية رابط التوثيق وQR للجهات الخارجية فوراً</p>
          </div>

          <button
            onClick={handleToggleSharing}
            className="text-brand-purple hover:scale-105 transition-transform cursor-pointer"
          >
            {activeSharing ? (
              <ToggleRight className="w-14 h-10 fill-brand-purple/20" />
            ) : (
              <ToggleLeft className="w-14 h-10 text-slate-300" />
            )}
          </button>
        </div>

        {/* Security alert box */}
        <div className="bg-amber-50/50 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 flex-row-reverse">
          <EyeOff className="w-5 h-5 text-brand-clay shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-brand-navy block">مبدأ السيادة على البيانات:</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              رابط التوثيق والشهادة هي ملكك بالكامل. بمجرد تعطيل المشاركة أعلاه، لن يتمكن أي مصرف أو جهة تمويلية (حتى وإن كان لديهم رابط التحقق) من فتح صفحة التوثيق أو رؤية مؤشر قدها الخاص بك.
            </p>
          </div>
        </div>
      </div>

      {/* Grid for Active Scopes and Operation logs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Active scopes checkboxes list */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-brand-gray p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-navy">صلاحيات النظام النشطة</h3>
          
          <div className="space-y-4">
            
            {/* Scope 1 */}
            <div className="flex justify-between items-center flex-row-reverse pb-3 border-b border-dashed border-slate-100 text-xs">
              <div>
                <span className="font-bold text-brand-navy block">قراءة وتحليل العمليات اليومية</span>
                <span className="text-[10px] text-slate-400">نشطة للحسابات المرتبطة</span>
              </div>
              <input 
                type="checkbox" 
                checked={scopes.transactions} 
                onChange={(e) => setScopes({ ...scopes, transactions: e.target.checked })}
                className="rounded text-brand-purple focus:ring-brand-purple w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Scope 2 */}
            <div className="flex justify-between items-center flex-row-reverse pb-3 border-b border-dashed border-slate-100 text-xs">
              <div>
                <span className="font-bold text-brand-navy block">تحليل التدفق النقدي الإجمالي والمصاريف</span>
                <span className="text-[10px] text-slate-400">مطلوبة لتحديث مؤشر الملاءة</span>
              </div>
              <input 
                type="checkbox" 
                checked={scopes.analytics} 
                onChange={(e) => setScopes({ ...scopes, analytics: e.target.checked })}
                className="rounded text-brand-purple focus:ring-brand-purple w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Scope 3 */}
            <div className="flex justify-between items-center flex-row-reverse pb-3 border-b border-dashed border-slate-100 text-xs">
              <div>
                <span className="font-bold text-brand-navy block">توليد شهادة الملاءة المختصرة</span>
                <span className="text-[10px] text-slate-400">تسمح بإنتاج رابط مشاركة آمن</span>
              </div>
              <input 
                type="checkbox" 
                checked={scopes.certificate} 
                onChange={(e) => setScopes({ ...scopes, certificate: e.target.checked })}
                className="rounded text-brand-purple focus:ring-brand-purple w-4 h-4 cursor-pointer"
              />
            </div>

          </div>

          {/* Delete All analysis button */}
          <div className="pt-4 border-t border-brand-gray text-left">
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2.5 rounded-xl border border-brand-danger/30 text-brand-danger hover:bg-brand-danger/[0.03] transition-all text-xs font-bold flex items-center gap-1.5 justify-center cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف كافة بيانات التقييم بشكل نهائي</span>
            </button>
          </div>
        </div>

        {/* Audit Operation Logs */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-brand-gray p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-brand-navy">سجل العمليات الأخير</h3>
          
          <div className="space-y-4">
            {logs.map((l, i) => (
              <div key={i} className="flex gap-2.5 flex-row-reverse text-right text-xs leading-normal items-start">
                <div className="w-2 h-2 rounded-full bg-brand-purple shrink-0 mt-1.5"></div>
                <div className="space-y-0.5">
                  <span className="font-bold text-brand-navy block">{l.event}</span>
                  <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1 flex-row-reverse">
                    <Clock className="w-3 h-3" />
                    <span>{l.date}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
