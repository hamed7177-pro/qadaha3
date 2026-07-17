import React, { useState } from 'react';
import { ShieldCheck, Share2, Download, Copy, Printer, Check, QrCode, Lock, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { ScreenId, Certificate, UserFinancials } from '../types';
import RiyalSymbol, { formatCurrency } from './RiyalSymbol';
import { analyzeFinancials, FAHAD_12M_INCOME, FAHAD_12M_EXPENSES, FAHAD_12M_OBLIGATIONS } from '../utils/calculations';

interface CertificateViewProps {
  onNavigate: (screenId: ScreenId) => void;
  testedInstallment: number;
  financials: UserFinancials | null;
  loading: boolean;
  certificate: Certificate | null;
}

export default function CertificateView({ onNavigate, testedInstallment, financials, loading, certificate }: CertificateViewProps) {
  if (loading || !financials || !certificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-purple border-t-transparent animate-spin"></div>
        <p className="text-sm font-bold text-brand-navy">جاري توليد شهادة الملاءة المعتمدة...</p>
      </div>
    );
  }

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { verificationId, issueDate, expiryDate, status, acceptedBy, acceptedDate } = certificate;

  const handleCopyLink = () => {
    // Generate mock verification URL matching the app URL structures
    const url = `${window.location.origin}/funder?verificationId=${verificationId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-right">

      {/* Page header and quick navigation */}
      <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-black text-brand-navy">توثيق قدها للملاءة المالية</h2>
          <p className="text-xs text-slate-400">شارك ملخص ملاءتك بأمان تام دون المساس بسرية عملياتك البنكية</p>
        </div>
        <button
          onClick={() => onNavigate('result')}
          className="px-4 py-2 rounded-xl border border-brand-gray bg-white text-xs font-bold hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>الرجوع لمؤشر الملاءة</span>
        </button>
      </div>

      {/* Main Certificate Mockup (Beautifully styled like an official credential) */}
      <div className="bg-white rounded-3xl border-4 border-double border-amber-600/30 p-6 sm:p-12 shadow-2xl relative overflow-hidden bg-[radial-gradient(#f7f7f4_1px,transparent_1px)] [background-size:16px_16px] print:border-amber-600">

        {/* Status banner if expired or used */}
        {status === 'expired' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-right flex items-center gap-2 text-red-700 justify-center font-bold text-xs no-print">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>هذه الشهادة منتهية الصلاحية. صلاحية شهادات قدها هي شهر واحد فقط من تاريخ الإصدار.</span>
          </div>
        )}
        {status === 'used' && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-right flex items-center gap-2 text-amber-800 justify-center font-bold text-xs no-print">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>هذه الشهادة تم قبولها واستخدامها مسبقاً للحصول على تمويل من جهة ({acceptedBy}) بتاريخ {acceptedDate}.</span>
          </div>
        )}

        {/* Beautiful diagonal visual stamp */}
        {status === 'used' && (
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-dashed border-red-600/40 rounded-2xl px-6 py-3 text-red-600/50 font-black text-2xl tracking-widest uppercase pointer-events-none select-none z-20 flex flex-col items-center">
            <span>تم الاستخدام</span>
            <span className="text-xs font-bold font-sans mt-1">USED & APPROVED</span>
          </div>
        )}
        {status === 'expired' && (
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-dashed border-red-600/40 rounded-2xl px-6 py-3 text-red-600/50 font-black text-2xl tracking-widest uppercase pointer-events-none select-none z-20 flex flex-col items-center">
            <span>منتهية الصلاحية</span>
            <span className="text-xs font-bold font-sans mt-1">EXPIRED</span>
          </div>
        )}

        {/* Certificate Watermark / Subtle design emblem */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-navy/[0.01] rounded-full border border-brand-navy/[0.03] pointer-events-none flex items-center justify-center">
          <div className="w-60 h-60 rounded-full border-4 border-double border-brand-navy/[0.02]"></div>
        </div>

        {/* Header Block of Certificate */}
        <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-6 pb-8 border-b border-brand-gray relative z-10">

          {/* Logo / Emblems */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-navy to-brand-indigo flex items-center justify-center text-white font-black font-sans shadow-md border border-brand-purple/20">
              ق
            </div>
            <div className="text-right">
              <h1 className="text-xl font-black text-brand-navy leading-none">منصة قدها</h1>
              <span className="text-[10px] text-slate-400 font-mono">QADAHA SOLVENCY PORTAL</span>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center md:text-left space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-amber-700 tracking-tight">شهادة الملاءة المعتمدة</h2>
            <p className="text-[10px] text-slate-400 font-bold font-mono">OFFICIAL STATEMENT OF SOLVENCY</p>
          </div>

        </div>

        {/* Certificate Body text */}
        <div className="py-8 space-y-6 relative z-10 text-right">

          {/* Introduction Statement */}
          <p className="text-sm text-slate-700 leading-relaxed">
            تشهد منصة <span className="font-bold text-brand-navy">قدها</span> لتقييم الملاءة عبر المصرفية المفتوحة (Sandbox) بأن العميل الموضح بياناته أدناه قد خضع لعملية تحليل الملاءة المالية والمؤشرات الإحصائية لدخله والتزاماته على مدار <span className="font-bold text-brand-navy">12 شهراً ماضية</span>، وصدرت له النتيجة المعتمدة للالتزام المستهدف:
          </p>

          {/* Secure User profile details block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-bg/60 p-4 rounded-2xl border border-brand-gray">
            <div className="space-y-1 text-right">
              <span className="text-[10px] text-slate-400 font-bold">اسم المستفيد الأول (محمي):</span>
              <span className="text-sm font-extrabold text-brand-navy block">{financials.name.split(' ')[0]}ـ** ({financials.role})</span>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] text-slate-400 font-bold">حالة الملاءة التقديرية للطلب:</span>
              <span className={`text-sm font-extrabold block flex items-center gap-1.5 justify-end ${financials.prediction === 'Suitable'
                ? 'text-brand-success'
                : financials.prediction === 'NotSuitable'
                  ? 'text-red-600'
                  : 'text-brand-clay'
                }`}>
                <span className={`w-2 h-2 rounded-full block ${financials.prediction === 'Suitable'
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
                      : 'مناسب بحذر'}{' '}
                  (مؤشر: {financials.qadahaScore}/100)
                </span>
              </span>
            </div>
          </div>

          {/* Secure financials summary list (No direct bank statements exposed!) */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-brand-navy border-r-2 border-brand-clay pr-2">ملخص المؤشرات والملاءة المالية الموثقة:</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">

              {/* average monthly income */}
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                <span className="text-slate-500">متوسط الدخل الشهري الفعلي لمدة سنة (12 شهر):</span>
                <span className="font-extrabold font-mono text-brand-navy">{formatCurrency(financials.avgMonthlyIncome12m)} <RiyalSymbol className="mr-1 text-slate-500" /></span>
              </div>

              {/* obligations */}
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                <span className="text-slate-500">الالتزامات البنكية والقروض الأخرى القائمة:</span>
                <span className="font-extrabold font-mono text-brand-navy">{formatCurrency(financials.monthlyObligations)} <RiyalSymbol className="mr-1 text-slate-500" /></span>
              </div>

              {/* tested installment */}
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                <span className="text-slate-500">القسط الشهري المقترح للتفتيش / التمويل:</span>
                <span className="font-extrabold font-mono text-brand-clay">{formatCurrency(testedInstallment)} <RiyalSymbol className="mr-1 text-brand-clay" /></span>
              </div>

              {/* surplus */}
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                <span className="text-slate-500">متوسط الفائض المالي المتاح شهرياً:</span>
                <span className="font-extrabold font-mono text-brand-navy">{formatCurrency(financials.avgMonthlyIncome12m - financials.monthlyObligations - testedInstallment - financials.avgMonthlyExpenses)} <RiyalSymbol className="mr-1 text-slate-500" /></span>
              </div>

              {/* volatility index */}
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2 md:col-span-2">
                <span className="text-slate-500">مؤشر تذبذب الدخل الشهري:</span>
                <span className="font-bold text-brand-navy">
                  {financials.incomeVolatilityScore <= 15 ? 'مستوى منخفض جداً' : financials.incomeVolatilityScore <= 30 ? 'مستوى متوسط' : 'مستوى متذبذب مرتفع'} ({financials.incomeVolatilityScore}%)
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* QR, Verification, Stamp Footer of Certificate */}
        <div className="pt-8 border-t border-brand-gray flex flex-col md:flex-row-reverse justify-between items-center gap-8 relative z-10">

          {/* QR Code and link verification box */}
          <div className="flex items-center gap-4 flex-row-reverse">
            {/* Mock QR Code container with beautiful styles */}
            <div className="w-20 h-20 bg-slate-100 rounded-xl border border-brand-gray p-2 flex items-center justify-center shrink-0">
              <QrCode className="w-16 h-16 text-brand-navy" />
            </div>

            <div className="text-right space-y-1">
              <span className="text-[9px] text-slate-400 font-bold block">امسح للتحقق الرقمي الفوري:</span>
              <span className="text-xs font-bold text-brand-navy font-mono block">{verificationId}</span>
              <p className="text-[9px] text-slate-400 leading-tight">
                يمكن للجهة التمويلية مطابقة الشهادة فوراً عبر مسح الرمز والتحقق الآمن.
              </p>
            </div>
          </div>

          {/* Issue meta details / Signatures */}
          <div className="text-center md:text-left text-xs space-y-1 font-mono text-slate-500">
            <div>رقم التوثيق: <span className="font-bold text-brand-navy">{verificationId}</span></div>
            <div>تاريخ الإصدار: <span>{issueDate}</span></div>
            <div>تاريخ الانتهاء: <span>{expiryDate}</span></div>
            <div className="pt-2 text-[10px] text-slate-400 uppercase font-bold tracking-widest text-brand-success flex items-center gap-1 justify-center md:justify-start">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مضمون وموثق بالكامل</span>
            </div>
          </div>

        </div>

        {/* Absolute Security / Privacy alert at the bottom */}
        <div className="mt-8 pt-4 border-t border-brand-gray text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-brand-success" />
          <span>هذا التقرير لا يعرض تفاصيل العمليات اليومية أو كشف الحساب البنكي الكامل للعميل حمايةً لخصوصيته.</span>
        </div>

      </div>

      {/* Sharing / Export CTAs Bar (no-print) */}
      <div className="bg-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row-reverse justify-between items-center gap-4 no-print border border-brand-gray">

        <div className="flex items-center gap-2 flex-row-reverse text-right">
          <AlertCircle className="w-5 h-5 text-brand-purple shrink-0" />
          <p className="text-xs text-slate-600 leading-tight">
            نشارك الملخص فقط، وليس كشف الحساب الكامل. يمكنك نسخ رابط التوثيق للجهة أو طباعته كـ PDF.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">

          <button
            id="btn-copy-link"
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-lg bg-brand-navy text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-indigo transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-brand-success" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ الرابط!' : 'نسخ رابط التوثيق'}</span>
          </button>

          <button
            id="btn-print-pdf"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-lg bg-white border border-brand-gray text-brand-navy font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-brand-clay" />
            <span>{downloading ? 'جاري التحميل...' : 'تحميل PDF / طباعة'}</span>
          </button>

          <button
            onClick={() => onNavigate('funder')}
            className="px-4 py-2.5 rounded-lg bg-brand-purple/10 text-brand-purple font-bold text-xs flex items-center gap-1.5 hover:bg-brand-purple/20 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>عرض بوابة التحقق للجهة</span>
          </button>

        </div>
      </div>

    </div>
  );
}
