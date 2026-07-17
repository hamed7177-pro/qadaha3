import React, { useState } from 'react';
import { ShieldCheck, Share2, Download, Copy, Printer, Check, QrCode, Lock, AlertCircle, FileText, ChevronRight, Award, Fingerprint, CheckCircle2, Clock } from 'lucide-react';
import { ScreenId, Certificate, UserFinancials } from '../types';
import RiyalSymbol from './RiyalSymbol';

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

  const surplus = financials.avgMonthlyIncome12m - financials.monthlyObligations - testedInstallment - financials.avgMonthlyExpenses;

  const predictionLabel = financials.prediction === 'Suitable'
    ? 'مناسب للالتزام'
    : financials.prediction === 'NotSuitable'
    ? 'غير مناسب'
    : 'مناسب بحذر';

  const predictionColor = financials.prediction === 'Suitable'
    ? 'text-emerald-600'
    : financials.prediction === 'NotSuitable'
    ? 'text-red-600'
    : 'text-amber-600';

  const predictionBg = financials.prediction === 'Suitable'
    ? 'bg-emerald-50 border-emerald-200'
    : financials.prediction === 'NotSuitable'
    ? 'bg-red-50 border-red-200'
    : 'bg-amber-50 border-amber-200';

  const predictionDot = financials.prediction === 'Suitable'
    ? 'bg-emerald-500'
    : financials.prediction === 'NotSuitable'
    ? 'bg-red-500'
    : 'bg-amber-500';

  const volatilityLabel = financials.incomeVolatilityScore <= 15
    ? 'مستوى منخفض جداً'
    : financials.incomeVolatilityScore <= 30
    ? 'مستوى متوسط'
    : 'مستوى متذبذب مرتفع';

  const handleCopyLink = () => {
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-right">

      {/* Page header */}
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

      {/* Status banner if expired or used */}
      {status === 'expired' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-right flex items-center gap-2 text-red-700 justify-center font-bold text-xs no-print">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>هذه الشهادة منتهية الصلاحية. صلاحية شهادات قدها هي شهر واحد فقط من تاريخ الإصدار.</span>
        </div>
      )}
      {status === 'used' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-right flex items-center gap-2 text-amber-800 justify-center font-bold text-xs no-print">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>هذه الشهادة تم قبولها واستخدامها مسبقاً للحصول على تمويل من جهة ({acceptedBy}) بتاريخ {acceptedDate}.</span>
        </div>
      )}

      {/* ============ CERTIFICATE CARD ============ */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl print:shadow-none">

        {/* Stamp overlays for used/expired */}
        {status === 'used' && (
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-dashed border-red-600/40 rounded-2xl px-6 py-3 text-red-600/50 font-black text-2xl tracking-widest uppercase pointer-events-none select-none z-30 flex flex-col items-center">
            <span>تم الاستخدام</span>
            <span className="text-xs font-bold font-sans mt-1">USED & APPROVED</span>
          </div>
        )}
        {status === 'expired' && (
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-dashed border-red-600/40 rounded-2xl px-6 py-3 text-red-600/50 font-black text-2xl tracking-widest uppercase pointer-events-none select-none z-30 flex flex-col items-center">
            <span>منتهية الصلاحية</span>
            <span className="text-xs font-bold font-sans mt-1">EXPIRED</span>
          </div>
        )}

        {/* ---- TOP HEADER BAND (Dark Navy) ---- */}
        <div className="bg-gradient-to-l from-brand-navy via-brand-indigo to-brand-navy px-6 sm:px-10 py-6 relative">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="flex flex-col sm:flex-row-reverse justify-between items-center gap-4 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-black text-lg border border-white/10 shadow-lg">
                ق
              </div>
              <div className="text-right">
                <h1 className="text-lg font-black text-white leading-none">منصة قدها</h1>
                <span className="text-[9px] text-white/40 font-mono tracking-wider">QADAHA SOLVENCY</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-black text-white tracking-tight">شهادة الملاءة المالية</h2>
              </div>
              <p className="text-[9px] text-white/40 font-mono tracking-widest mt-1">OFFICIAL STATEMENT OF SOLVENCY</p>
            </div>
          </div>
        </div>

        {/* ---- CERTIFICATE BODY (Light) ---- */}
        <div className="bg-gradient-to-b from-slate-50 to-white px-6 sm:px-10 py-8 relative">

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <div className="w-[400px] h-[400px] rounded-full border border-slate-100 opacity-50"></div>
            <div className="absolute w-[300px] h-[300px] rounded-full border border-slate-100 opacity-40"></div>
            <div className="absolute w-[200px] h-[200px] rounded-full border border-slate-100 opacity-30"></div>
          </div>

          <div className="relative z-10 space-y-6">

            {/* Introduction Statement */}
            <p className="text-sm text-slate-600 leading-relaxed">
              تشهد منصة <span className="font-bold text-brand-navy">قدها</span> لتقييم الملاءة عبر المصرفية المفتوحة (Sandbox) بأن العميل الموضح بياناته أدناه قد خضع لعملية تحليل ملاءة مالية شاملة على مدار <span className="font-bold text-brand-navy">12 شهراً ماضية</span>، وصدرت له النتيجة التالية:
            </p>

            {/* ---- Beneficiary & Status Row ---- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Beneficiary Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[10px] text-slate-400 font-bold">المستفيد</span>
                  <Fingerprint className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-brand-navy block">{financials.name.split(' ')[0]}ـ**</span>
                  <span className="text-xs text-slate-400">{financials.role}</span>
                </div>
              </div>

              {/* Status Card */}
              <div className={`rounded-2xl border p-5 space-y-3 shadow-sm ${predictionBg}`}>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[10px] text-slate-400 font-bold">حالة الملاءة</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <div className="text-right flex items-center gap-2 justify-end">
                  <div>
                    <span className={`text-lg font-black block ${predictionColor}`}>{predictionLabel}</span>
                    <span className="text-xs text-slate-500 font-mono">مؤشر: {financials.qadahaScore}/100</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${predictionDot} animate-pulse`}></div>
                </div>
              </div>
            </div>

            {/* ---- Financial Summary Table ---- */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-end">
                <h3 className="text-xs font-black text-brand-navy">ملخص المؤشرات المالية الموثقة</h3>
                <div className="w-1 h-4 bg-gradient-to-b from-brand-purple to-brand-clay rounded-full"></div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Table Row 1 */}
                <div className="grid grid-cols-2 divide-x divide-slate-100">
                  <div className="p-4 text-right space-y-1 border-b border-slate-100">
                    <span className="text-[10px] text-slate-400 block">متوسط الدخل الشهري (12 شهر)</span>
                    <span className="text-base font-black font-mono text-brand-navy flex items-center gap-1 justify-end">
                      {financials.avgMonthlyIncome12m.toLocaleString()}
                      <RiyalSymbol className="text-slate-400" />
                    </span>
                  </div>
                  <div className="p-4 text-right space-y-1 border-b border-slate-100">
                    <span className="text-[10px] text-slate-400 block">الالتزامات البنكية القائمة</span>
                    <span className="text-base font-black font-mono text-brand-navy flex items-center gap-1 justify-end">
                      {financials.monthlyObligations.toLocaleString()}
                      <RiyalSymbol className="text-slate-400" />
                    </span>
                  </div>
                </div>
                {/* Table Row 2 */}
                <div className="grid grid-cols-2 divide-x divide-slate-100">
                  <div className="p-4 text-right space-y-1 border-b border-slate-100">
                    <span className="text-[10px] text-slate-400 block">القسط المقترح للتمويل</span>
                    <span className="text-base font-black font-mono text-brand-clay flex items-center gap-1 justify-end">
                      {testedInstallment.toLocaleString()}
                      <RiyalSymbol className="text-brand-clay/60" />
                    </span>
                  </div>
                  <div className="p-4 text-right space-y-1 border-b border-slate-100">
                    <span className="text-[10px] text-slate-400 block">الفائض المالي المتاح شهرياً</span>
                    <span className={`text-base font-black font-mono flex items-center gap-1 justify-end ${surplus >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {surplus.toLocaleString()}
                      <RiyalSymbol className={surplus >= 0 ? 'text-emerald-400' : 'text-red-400'} />
                    </span>
                  </div>
                </div>
                {/* Table Row 3 - Full width */}
                <div className="p-4 text-right flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-navy">
                    {volatilityLabel} ({financials.incomeVolatilityScore}%)
                  </span>
                  <span className="text-[10px] text-slate-400">مؤشر تذبذب الدخل الشهري</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ---- FOOTER BAND (Dark Navy) ---- */}
        <div className="bg-gradient-to-l from-brand-navy via-brand-indigo to-brand-navy px-6 sm:px-10 py-6 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2"></div>

          <div className="flex flex-col sm:flex-row-reverse justify-between items-center gap-6 relative z-10">

            {/* QR Code & Verification */}
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-1.5 flex items-center justify-center shrink-0">
                <QrCode className="w-full h-full text-white/80" />
              </div>
              <div className="text-right space-y-1">
                <span className="text-[9px] text-white/40 font-bold block">رمز التحقق الرقمي</span>
                <span className="text-sm font-black text-white font-mono block tracking-wider">{verificationId}</span>
                <span className="text-[9px] text-white/30 block">امسح الرمز أو أدخل المعرف في بوابة التحقق</span>
              </div>
            </div>

            {/* Issue details */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <div className="text-center sm:text-left space-y-0.5">
                <span className="text-[9px] text-white/30 block">تاريخ الإصدار</span>
                <span className="text-xs font-bold text-white font-mono">{issueDate}</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10"></div>
              <div className="text-center sm:text-left space-y-0.5">
                <span className="text-[9px] text-white/30 block">تاريخ الانتهاء</span>
                <span className="text-xs font-bold text-white font-mono">{expiryDate}</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10"></div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-bold">موثق ومعتمد</span>
              </div>
            </div>

          </div>
        </div>

        {/* Privacy strip */}
        <div className="bg-slate-900 px-6 sm:px-10 py-3 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-500/70" />
          <span className="text-[9px] text-slate-500">هذا التقرير لا يعرض تفاصيل العمليات اليومية أو كشف الحساب البنكي الكامل للعميل حمايةً لخصوصيته.</span>
        </div>

      </div>

      {/* ============ SHARING BAR ============ */}
      <div className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row-reverse justify-between items-center gap-4 no-print border border-slate-200 shadow-sm">

        <div className="flex items-center gap-3 flex-row-reverse text-right">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5 text-brand-purple" />
          </div>
          <div>
            <p className="text-xs font-bold text-brand-navy">مشاركة آمنة</p>
            <p className="text-[10px] text-slate-400 leading-tight">نشارك الملخص فقط وليس كشف الحساب الكامل</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">

          <button
            id="btn-copy-link"
            onClick={handleCopyLink}
            className="px-5 py-2.5 rounded-xl bg-brand-navy text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-indigo transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ رابط التوثيق'}</span>
          </button>

          <button
            id="btn-print-pdf"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-brand-navy font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <Printer className="w-4 h-4 text-brand-clay" />
            <span>{downloading ? 'جاري التحميل...' : 'تحميل PDF / طباعة'}</span>
          </button>

          <button
            onClick={() => onNavigate('funder')}
            className="px-5 py-2.5 rounded-xl bg-brand-purple/10 text-brand-purple font-bold text-xs flex items-center gap-1.5 hover:bg-brand-purple/20 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>بوابة التحقق للشركاء</span>
          </button>

        </div>
      </div>

    </div>
  );
}
