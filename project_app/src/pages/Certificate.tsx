import { ShieldCheck, CheckCircle2, QrCode } from "lucide-react";

export default function Certificate() {
  return (
    <div className="space-y-gutter pb-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-display-lg text-display-lg text-primary-container mb-2">شهادة قدها</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">التحقق الرسمي من الملاءة المالية</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-soft border border-surface-container overflow-hidden">
        {/* Certificate Header */}
        <div className="bg-surface-container p-6 border-b border-surface-variant relative overflow-hidden flex flex-col sm:flex-row justify-between items-center text-right">
          <div className="absolute left-0 top-0 w-32 h-32 opacity-5 pointer-events-none transform -translate-x-10 -translate-y-10">
            <ShieldCheck size={128} />
          </div>
          
          <div className="z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-row-reverse">
              <ShieldCheck className="text-secondary" size={28} />
              <h2 className="font-headline-md text-headline-md font-bold text-primary-container">رقم الشهادة: QDA-2024-8842</h2>
            </div>
            <p className="font-label-md text-on-surface-variant">تاريخ الإصدار: 24 مايو 2024 | صالحة حتى: 24 أغسطس 2024</p>
          </div>
          
          <div className="w-16 h-16 bg-surface-container-highest rounded-lg flex items-center justify-center mt-4 sm:mt-0">
            <QrCode size={40} className="text-outline" />
          </div>
        </div>

        <div className="p-8 flex flex-col gap-8 text-right">
          {/* User Info */}
          <div>
            <h3 className="font-label-md text-on-surface-variant mb-3">بيانات المستفيد (محمية)</h3>
            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl flex-row-reverse">
              <div className="w-12 h-12 bg-primary-fixed text-primary font-bold rounded-full flex items-center justify-center text-title-lg">
                م ع
              </div>
              <div>
                <p className="font-title-lg text-on-surface font-bold">م*** ع***</p>
                <p className="font-label-sm text-on-surface-variant" dir="ltr">رقم الهوية: **** **** 10</p>
              </div>
            </div>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low border border-surface-variant rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <ShieldCheck size={32} className="text-primary-container mb-3" />
              <p className="font-label-md text-on-surface-variant mb-2">الحالة العامة</p>
              <h4 className="font-headline-lg text-primary font-bold mb-3">مناسب بحذر</h4>
              <span className="bg-secondary-fixed-dim/30 text-secondary px-3 py-1 rounded-full font-label-sm flex items-center gap-1">
                تحت المراجعة
              </span>
            </div>
            
            <div className="bg-surface-container-low border border-surface-variant rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-container mb-3">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <p className="font-label-md text-on-surface-variant mb-2">مؤشر قدها</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display-lg text-primary font-bold">68</span>
                <span className="font-title-lg text-on-surface-variant">/100</span>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-lg flex-row-reverse">
              <CheckCircle2 className="text-[#0d652d]" size={24} />
              <span className="font-body-md text-on-surface">متوسط الدخل ضمن نطاق موثق</span>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-lg flex-row-reverse">
              <CheckCircle2 className="text-[#0d652d]" size={24} />
              <span className="font-body-md text-on-surface">نسبة الالتزامات ضمن نطاق قابل للتحمل</span>
            </div>
          </div>

          <hr className="border-surface-variant" />

          {/* Commitment Details */}
          <div>
            <h3 className="font-label-md text-on-surface-variant mb-4">تفاصيل الالتزام</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">نوع القسط</p>
                <p className="font-title-lg text-primary font-bold">شخصي</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">مقدار القسط</p>
                <p className="font-title-lg text-primary font-bold" dir="ltr">2,450 ر.س</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">مدة التقسيم</p>
                <p className="font-title-lg text-primary font-bold">60 شهر</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">الدفعة الأولية</p>
                <p className="font-title-lg text-primary font-bold" dir="ltr">0 ر.س</p>
              </div>
            </div>
          </div>
          
          {/* Footer Note */}
          <div className="bg-surface-container p-4 rounded-lg text-center flex items-center justify-center gap-2 flex-row-reverse">
             <ShieldCheck size={16} className="text-outline" />
             <p className="font-label-sm text-on-surface-variant">تم التحقق من التدفق النقدي بناءً على بيانات مصرفية مفتوحة بموافقة المستخدم. لا تحتوي الشهادة على كشف الحساب الكامل. تعتبر هذه الشهادة ملخصاً للحالة المالية.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
