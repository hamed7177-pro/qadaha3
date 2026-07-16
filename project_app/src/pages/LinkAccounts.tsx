import React, { useState, useEffect } from "react";
import { 
  Landmark, 
  Check, 
  Loader2, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight,
  Info,
  Lock
} from "lucide-react";

interface Bank {
  id: number;
  name_ar: string;
  name_en: string;
  code: string;
  logo_url: string;
  color: string;
}

interface LinkedAccount {
  id: number;
  bank: Bank;
  account_number: string;
  iban: string;
  balance: number;
  account_type: string;
  label: string;
  linked_at: string;
}

const API_BASE = "http://localhost:8000/api";

export default function LinkAccounts() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Syncing and deleting states
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Wizard state
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [wizardStep, setWizardStep] = useState(0); // 0: Idle/Closed, 1: Consent, 2: Login, 3: OTP, 4: Select Accounts, 5: Success
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmittingLink, setIsSubmittingLink] = useState(false);

  // Fetch banks & accounts on mount
  useEffect(() => {
    fetchBanks();
    fetchLinkedAccounts();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const res = await fetch(`${API_BASE}/banks/`);
      if (!res.ok) throw new Error("Failed to load banks");
      const data = await res.json();
      setBanks(data);
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل قائمة البنوك.");
    } finally {
      setLoadingBanks(false);
    }
  };

  const fetchLinkedAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const res = await fetch(`${API_BASE}/accounts/`);
      if (!res.ok) throw new Error("Failed to load linked accounts");
      const data = await res.json();
      setLinkedAccounts(data);
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل الحسابات المربوطة.");
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Start Open Banking flow
  const handleStartLink = (bank: Bank) => {
    setSelectedBank(bank);
    setWizardStep(1); // open consent step
    setUsername("");
    setPassword("");
    setOtp("");
  };

  // Close Wizard
  const handleCloseWizard = () => {
    setSelectedBank(null);
    setWizardStep(0);
  };

  // Handle Login submission (moves to OTP)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setWizardStep(3); // OTP step
  };

  // Handle OTP submission (links account)
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !selectedBank) return;
    
    try {
      setIsSubmittingLink(true);
      const res = await fetch(`${API_BASE}/accounts/link/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bank_id: selectedBank.id }),
      });
      
      if (!res.ok) throw new Error("Link failed");
      
      setWizardStep(5); // Success step
      fetchLinkedAccounts(); // reload accounts list
    } catch (err) {
      console.error(err);
      alert("فشلت عملية الربط. يرجى التحقق من المدخلات والمحاولة مرة أخرى.");
    } finally {
      setIsSubmittingLink(false);
    }
  };

  // Sync account
  const handleSyncAccount = async (id: number) => {
    try {
      setSyncingId(id);
      const res = await fetch(`${API_BASE}/accounts/${id}/sync/`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Sync failed");
      await fetchLinkedAccounts();
    } catch (err) {
      console.error(err);
      alert("فشل تحديث الحساب.");
    } finally {
      setSyncingId(null);
    }
  };

  // Unlink account
  const handleUnlinkAccount = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في إلغاء ربط هذا الحساب؟ سيتم مسح جميع البيانات والعمليات المرتبطة به.")) {
      return;
    }
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/accounts/${id}/unlink/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Unlink failed");
      await fetchLinkedAccounts();
    } catch (err) {
      console.error(err);
      alert("فشل إلغاء ربط الحساب.");
    } finally {
      setDeletingId(null);
    }
  };

  // Summarize stats
  const totalBalance = linkedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const uniqueBanksCount = new Set(linkedAccounts.map(acc => acc.bank.code)).size;

  return (
    <div className="space-y-gutter pb-8 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-headline-lg text-headline-lg text-primary-container">ربط الحسابات البنكية</h2>
        <p className="text-on-surface-variant font-body-md">
          قم بربط حساباتك البنكية عبر المصرفية المفتوحة (Open Banking) بشكل آمن لاستيراد معاملاتك وتحليل ملاءتك المالية تلقائياً.
        </p>
      </div>

      {/* Security Banner */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between gap-4 flex-row-reverse">
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
            <Lock size={20} />
          </div>
          <div className="text-right">
            <h4 className="font-title-lg text-body-lg font-bold text-primary-container">ربط آمن ومشفر بنسبة 100%</h4>
            <p className="text-label-md text-on-surface-variant">
              نحن نلتزم بمعايير البنك المركزي السعودي (SAMA) للمصرفية المفتوحة. لا يتم حفظ كلمات مرورك أبداً.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#005B3A]/10 text-[#005B3A] rounded-full text-xs font-bold">
          <ShieldCheck size={16} />
          <span>مرخص من SAMA</span>
        </div>
      </div>

      {/* Aggregate Stats Card */}
      {linkedAccounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft border border-surface-container flex flex-col justify-between">
            <span className="text-on-surface-variant text-label-md">البنوك المرتبطة</span>
            <div className="flex items-baseline gap-2 mt-2 justify-start flex-row-reverse">
              <span className="text-headline-lg font-bold text-primary-container">{uniqueBanksCount}</span>
              <span className="text-on-surface-variant text-label-sm">بنوك نشطة</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft border border-surface-container flex flex-col justify-between">
            <span className="text-on-surface-variant text-label-md">الحسابات النشطة</span>
            <div className="flex items-baseline gap-2 mt-2 justify-start flex-row-reverse">
              <span className="text-headline-lg font-bold text-primary-container">{linkedAccounts.length}</span>
              <span className="text-on-surface-variant text-label-sm">حسابات بنكية</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft border border-surface-container flex flex-col justify-between border-r-4 border-r-secondary">
            <span className="text-on-surface-variant text-label-md">إجمالي الرصيد المجمع</span>
            <div className="flex items-baseline gap-2 mt-2 justify-start flex-row-reverse">
              <span className="text-headline-lg font-bold text-secondary">{totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              <span className="text-on-surface-variant text-label-sm font-bold">ر.س</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Linked Accounts List (Left/Main col) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-soft border border-outline-variant overflow-hidden">
            <div className="bg-surface-container p-4 border-b border-outline-variant flex justify-between items-center flex-row-reverse">
              <h3 className="font-title-lg text-title-lg font-bold text-primary-container">حساباتك المربوطة</h3>
              <span className="text-xs px-2.5 py-1 bg-primary-container/10 text-primary-container rounded-full font-bold">
                {linkedAccounts.length} حساب
              </span>
            </div>
            
            <div className="p-6">
              {loadingAccounts ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={36} className="animate-spin text-secondary" />
                  <span className="text-on-surface-variant text-body-md">جاري تحميل الحسابات البنكية...</span>
                </div>
              ) : linkedAccounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-outline-variant mb-4">
                    <Landmark size={32} />
                  </div>
                  <h4 className="font-title-lg text-body-lg font-bold text-on-surface mb-2">لا توجد حسابات بنكية مرتبطة حالياً</h4>
                  <p className="text-on-surface-variant text-body-md max-w-md mx-auto mb-6">
                    ابدأ بربط حسابك البنكي الأول من قائمة البنوك المدعومة المجاورة لتتمكن من تحليل تدفقك المالي.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-surface-container/60">
                  {linkedAccounts.map((account) => (
                    <div 
                      key={account.id} 
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 flex-row-reverse"
                    >
                      <div className="flex items-center gap-4 flex-row-reverse">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                          style={{ backgroundColor: account.bank.color }}
                        >
                          {account.bank.name_en.substring(0, 3).toUpperCase()}
                        </div>
                        <div className="text-right">
                          <h4 className="font-body-lg font-bold text-primary-container">{account.label}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5" dir="ltr">
                            {account.bank.name_ar} | **** {account.account_number}
                          </p>
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-[#005B3A]/10 text-[#005B3A] rounded font-bold">
                            نشط ومتزامن
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-left">
                          <p className="text-xs text-on-surface-variant">الرصيد المتاح</p>
                          <p className="font-title-lg text-body-lg font-bold text-primary-container mt-0.5">
                            {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-xs text-on-surface-variant font-normal">ر.س</span>
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSyncAccount(account.id)}
                            disabled={syncingId !== null || deletingId !== null}
                            className="p-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary transition-all disabled:opacity-40"
                            title="تحديث البيانات"
                          >
                            <RefreshCw size={16} className={syncingId === account.id ? "animate-spin text-secondary" : ""} />
                          </button>
                          <button
                            onClick={() => handleUnlinkAccount(account.id)}
                            disabled={syncingId !== null || deletingId !== null}
                            className="p-2 rounded-lg border border-outline-variant/30 text-error hover:bg-error/5 hover:border-error transition-all disabled:opacity-40"
                            title="إلغاء ربط الحساب"
                          >
                            {deletingId === account.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bank Catalog (Right/Sidebar col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-soft border border-outline-variant overflow-hidden">
            <div className="bg-surface-container p-4 border-b border-outline-variant text-right">
              <h3 className="font-title-lg text-title-lg font-bold text-primary-container">البنوك المتاحة للربط</h3>
            </div>
            
            <div className="p-6">
              {loadingBanks ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <Loader2 size={24} className="animate-spin text-secondary" />
                  <span className="text-on-surface-variant text-xs">جاري تحميل البنوك المدعومة...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => handleStartLink(bank)}
                      className="group w-full flex items-center justify-between p-3.5 rounded-xl border border-outline-variant/30 hover:border-secondary transition-all text-right flex-row-reverse"
                    >
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: bank.color }}
                        >
                          {bank.name_en.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-body-md font-bold text-primary-container">{bank.name_ar}</h4>
                          <p className="text-[10px] text-on-surface-variant">ربط فوري وآمن</p>
                        </div>
                      </div>
                      
                      <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:bg-secondary group-hover:text-white transition-all">
                        <Plus size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Open Banking Wizard (Modal) */}
      {wizardStep > 0 && selectedBank && (
        <div className="fixed inset-0 bg-[#000d21]/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10 flex flex-col text-right">
            {/* Bank Branding Header */}
            <div 
              className="p-5 text-white flex items-center justify-between flex-row-reverse"
              style={{ backgroundColor: selectedBank.color }}
            >
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                  {selectedBank.name_en.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-title-lg text-body-lg font-bold">{selectedBank.name_ar}</h3>
                  <p className="text-[10px] text-white/80">بوابة المصرفية المفتوحة الآمنة</p>
                </div>
              </div>
              <button 
                onClick={handleCloseWizard}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-all text-xs"
              >
                إلغاء
              </button>
            </div>

            {/* Step Content */}
            <div className="p-6 flex-1">
              
              {/* Step 1: Consent */}
              {wizardStep === 1 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary-fixed text-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck size={28} />
                    </div>
                    <h4 className="font-title-lg text-body-lg font-bold text-primary-container">تفويض مشاركة البيانات البنكية</h4>
                  </div>
                  
                  <div className="bg-surface-container p-4 rounded-xl space-y-3">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      يطلب تطبيق <span className="font-bold text-secondary">قدها</span> تفويضاً مشفراً للوصول إلى البيانات التالية من حسابك:
                    </p>
                    <ul className="text-xs text-on-surface-variant space-y-1.5 pr-4 list-disc">
                      <li>تفاصيل وأرقام الحسابات البنكية.</li>
                      <li>الرصيد الحالي والمتاح لكل حساب.</li>
                      <li>سجل العمليات البنكية وآخر المعاملات.</li>
                    </ul>
                    <div className="text-[10px] text-[#005B3A] font-bold flex items-center gap-1 justify-end">
                      <span>جميع البيانات تخضع للتشفير العسكري لحمايتك</span>
                      <Lock size={10} />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="flex-1 py-2.5 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all text-sm"
                    >
                      موافق واستمرار
                    </button>
                    <button
                      onClick={handleCloseWizard}
                      className="flex-1 py-2.5 border border-outline-variant/40 text-on-surface-variant rounded-xl font-bold hover:bg-surface-container transition-all text-sm"
                    >
                      رفض
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Login */}
              {wizardStep === 2 && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="text-center mb-2">
                    <h4 className="font-title-lg text-body-lg font-bold text-primary-container">تسجيل الدخول البنكي الموحد</h4>
                    <p className="text-xs text-on-surface-variant mt-1">الرجاء إدخال بيانات الدخول لحسابك البنكي الافتراضي</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">اسم المستخدم أو رقم الهوية</label>
                      <input
                        type="text"
                        required
                        placeholder="أدخل اسم المستخدم"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-right text-sm focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">كلمة المرور البنكية</label>
                      <input
                        type="password"
                        required
                        placeholder="أدخل كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-right text-sm focus:outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-primary-container/5 rounded-xl flex items-start gap-2.5 flex-row-reverse border border-primary-container/10">
                    <Info size={16} className="text-primary-container mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      هذا الاتصال محاكى لأغراض التطوير والاختبار. يمكنك كتابة أي بيانات تسجيل دخول للعبور.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all text-sm flex items-center justify-center gap-1.5"
                  >
                    <span>طلب رمز التحقق OTP</span>
                    <ArrowRight size={16} className="rotate-180" />
                  </button>
                </form>
              )}

              {/* Step 3: OTP */}
              {wizardStep === 3 && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="text-center mb-2">
                    <h4 className="font-title-lg text-body-lg font-bold text-primary-container">إدخال رمز التحقق</h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      تم إرسال رمز تحقق مؤقت إلى جوالك المسجل. الرجاء إدخاله أدناه.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 text-center">رمز التحقق (OTP)</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="XXXX"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-32 mx-auto p-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-center tracking-widest text-lg font-bold focus:outline-none focus:border-secondary block"
                    />
                  </div>

                  <div className="p-3 bg-secondary-fixed-dim/10 rounded-xl text-center border border-secondary/10">
                    <p className="text-[10px] text-secondary leading-relaxed">
                      للربط السريع، أدخل أي رمز (مثال: 1234) وسيقوم الخادم بقبوله وإنشاء عمليات واقعية.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingLink}
                    className="w-full py-2.5 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {isSubmittingLink ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>جاري التحقق وإنشاء الحساب...</span>
                      </>
                    ) : (
                      <span>تأكيد الربط</span>
                    )}
                  </button>
                </form>
              )}

              {/* Step 5: Success */}
              {wizardStep === 5 && (
                <div className="space-y-5 text-center py-4">
                  <div className="w-16 h-16 bg-[#005B3A] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Check size={36} />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-title-lg text-body-lg font-bold text-primary-container">تم ربط حسابك البنكي بنجاح!</h4>
                    <p className="text-xs text-on-surface-variant">
                      تم الاتصال ببنك <span className="font-bold text-secondary">{selectedBank.name_ar}</span> واستيراد آخر 6 أشهر من العمليات والالتزامات بنجاح.
                    </p>
                  </div>

                  <button
                    onClick={handleCloseWizard}
                    className="w-full py-2.5 bg-primary-container text-white rounded-xl font-bold hover:bg-primary-container/90 transition-all text-sm"
                  >
                    العودة للحسابات المربوطة
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
