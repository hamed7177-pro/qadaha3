import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, CreditCard, ChevronLeft, ChevronRight, Plus, RefreshCw, Check, ArrowLeft, ArrowRight, XCircle } from 'lucide-react';
import { ScreenId, BankAccount } from '../types';
import RiyalSymbol, { formatCurrency } from './RiyalSymbol';

interface SaudiBankOption {
  id: string;
  name: string;
  fullName: string;
  color: string;
  logoLetter: string;
}

const SAUDI_BANKS: SaudiBankOption[] = [
  { id: 'alrajhi', name: 'مصرف الراجحي', fullName: 'مصرف الراجحي (الخدمات المصرفية للأفراد)', color: 'bg-blue-800', logoLetter: 'ر' },
  { id: 'riyad', name: 'بنك الرياض', fullName: 'بنك الرياض (حسابات الأعمال والأفراد)', color: 'bg-amber-500', logoLetter: 'ض' },
  { id: 'sab', name: 'البنك الأول SAB', fullName: 'البنك السعودي الأول (SAB)', color: 'bg-red-600', logoLetter: 'س' },
  { id: 'fransi', name: 'البنك السعودي الفرنسي', fullName: 'البنك السعودي الفرنسي (التمويل الشخصي)', color: 'bg-cyan-700', logoLetter: 'ف' },
  { id: 'anb', name: 'البنك العربي الوطني', fullName: 'البنك العربي الوطني (ANB)', color: 'bg-emerald-600', logoLetter: 'ع' },
];

interface ConnectViewProps {
  onNavigate: (screenId: ScreenId) => void;
}

export default function ConnectView({ onNavigate }: ConnectViewProps) {
  // Mock initial linked accounts
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: 'alinma',
      bankName: 'مصرف الإنماء (حساب الراتب والأعمال المستقلة)',
      accountType: 'حساب جاري رئيسي',
      accountNumber: 'SA93 0500 0000 1234 5678 9012',
      balance: 14850,
      isConnected: true,
      lastUpdated: 'منذ دقيقة واحدة',
      allowedScopes: ['العمليات', 'الرصيد', 'الملاءة']
    },
    {
      id: 'tuwaiq',
      bankName: 'محفظة طويق الرقمية الفورية',
      accountType: 'محفظة رقمية مستقلة',
      accountNumber: 'SA20 0110 0000 9876 5432 1000',
      balance: 2450,
      isConnected: true,
      lastUpdated: 'منذ دقيقة واحدة',
      allowedScopes: ['العمليات', 'الرصيد']
    },
    {
      id: 'snb',
      bankName: 'البنك الأهلي السعودي (حساب الادخار)',
      accountType: 'حساب ادخار فرعي',
      accountNumber: 'SA45 1000 0000 5555 4444 3333',
      balance: 12000,
      isConnected: false,
      lastUpdated: 'غير مرتبط',
      allowedScopes: []
    }
  ]);

  const [isLinking, setIsLinking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<SaudiBankOption | null>(null);
  const [linkingProgress, setLinkingProgress] = useState(0);

  const toggleConnect = (id: string) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        const nextState = !acc.isConnected;
        showToast(nextState ? `تم ربط ${acc.bankName} بنجاح` : `تم قطع الاتصال بـ ${acc.bankName}`);
        return {
          ...acc,
          isConnected: nextState,
          lastUpdated: nextState ? 'الآن' : 'غير مرتبط',
          allowedScopes: nextState ? ['العمليات', 'الرصيد'] : []
        };
      }
      return acc;
    }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLinkNew = () => {
    setIsModalOpen(true);
  };

  const startSimulatedLink = (bank: SaudiBankOption) => {
    setSelectedBank(bank);
    setLinkingProgress(10);
    setIsLinking(true);
    
    // Simulate connection progress
    const interval = setInterval(() => {
      setLinkingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsLinking(false);
      setIsModalOpen(false);
      setSelectedBank(null);
      
      const randomBalance = Math.floor(Math.random() * 22000) + 3000;
      const randomIbanSuffix = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
      const newAccount: BankAccount = {
        id: `${bank.id}_${Date.now()}`,
        bankName: `${bank.fullName}`,
        accountType: 'حساب جاري إضافي',
        accountNumber: `SA${Math.floor(Math.random() * 80) + 10} ${bank.id === 'alrajhi' ? '8000' : '4500'} 0000 ${randomIbanSuffix.slice(0,4)} ${randomIbanSuffix.slice(4,8)} ${randomIbanSuffix.slice(8,12)}`,
        balance: randomBalance,
        isConnected: true,
        lastUpdated: 'الآن',
        allowedScopes: ['العمليات', 'الرصيد', 'الملاءة']
      };
      
      setAccounts(prev => [newAccount, ...prev]);
      showToast(`تم ربط حساب ${bank.name} بنجاح عبر المصرفية المفتوحة`);
    }, 1800);
  };

  const activeCount = accounts.filter(a => a.isConnected).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-brand-navy text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-slideUp text-sm font-bold flex items-center gap-2 border border-brand-purple/20">
          <Check className="w-4 h-4 text-brand-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Progress Steps Header */}
      <div className="bg-white rounded-2xl p-6 border border-brand-gray shadow-sm">
        <div className="flex flex-row-reverse items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-gray -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 right-0 w-2/5 h-1 bg-brand-purple -translate-y-1/2 z-0 transition-all"></div>
          
          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-brand-purple">الموافقة</span>
          </div>

          <div className="flex flex-col items-center z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-purple/20">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-brand-purple">ربط الحساب</span>
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

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-brand-gray p-6 sm:p-10 shadow-lg space-y-8">
        
        {/* Heading */}
        <div className="flex flex-col sm:flex-row-reverse justify-between items-start gap-4 text-right">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              ربط الحسابات عبر المصرفية المفتوحة
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              بيئة الفحص والتجربة لربط الحسابات البنكية ومحاكاة الربط الفعلي مع Sandbox المصرفية المفتوحة
            </p>
          </div>
          
          <button
            onClick={handleLinkNew}
            disabled={isLinking}
            className="px-4 py-2.5 rounded-xl bg-brand-navy/5 hover:bg-brand-navy/10 text-brand-navy font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-brand-gray"
          >
            <Plus className="w-4 h-4 text-brand-clay" />
            <span>{isLinking ? 'جاري ربط حساب...' : 'ربط حساب جديد'}</span>
          </button>
        </div>

        {/* Security bar */}
        <div className="bg-brand-success/5 border border-brand-success/20 rounded-xl p-3.5 flex items-center gap-3 flex-row-reverse text-right">
          <ShieldCheck className="w-5 h-5 text-brand-success shrink-0" />
          <p className="text-xs text-brand-navy font-medium leading-relaxed">
            اتصال مشفر آمن بـ 256 بت • صلاحية وصول للقراءة فقط • لا يمكننا سحب أو تحويل الأموال • يمكنك إلغاء ربط أي حساب بنكي فوراً وبكبسة زر واحدة.
          </p>
        </div>

        {/* Accounts Cards List */}
        <div className="space-y-4">
          {accounts.map((acc) => (
            <div 
              key={acc.id}
              className={`p-6 rounded-2xl border transition-all text-right grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative ${acc.isConnected ? 'border-brand-purple/20 bg-brand-purple/[0.02] shadow-sm' : 'border-brand-gray bg-white opacity-70'}`}
            >
              
              {/* Account Details */}
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-2 flex-row-reverse justify-start">
                  <CreditCard className={`w-5 h-5 ${acc.isConnected ? 'text-brand-purple' : 'text-slate-400'}`} />
                  <h3 className="text-sm sm:text-base font-bold text-brand-navy">{acc.bankName}</h3>
                </div>
                
                <p className="text-xs text-slate-500 font-mono tracking-wider">{acc.accountNumber}</p>
                
                <div className="flex flex-wrap gap-2 flex-row-reverse justify-start pt-1">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                    {acc.accountType}
                  </span>
                  
                  {acc.isConnected ? (
                    <>
                      <span className="text-[10px] bg-brand-success/10 text-brand-success px-2.5 py-1 rounded-full font-bold">
                        متصل وآمن
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium self-center mr-1">
                        تحديث: {acc.lastUpdated}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] bg-slate-200 text-slate-500 px-2.5 py-1 rounded-full font-bold">
                      غير متصل
                    </span>
                  )}
                </div>
              </div>

              {/* Account Balance & Connection Toggle */}
              <div className="md:col-span-4 flex flex-row md:flex-col justify-between items-center md:items-end gap-3 border-t md:border-t-0 border-brand-gray pt-4 md:pt-0">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">الرصيد المتاح</span>
                  <span className="text-lg font-black text-brand-navy font-mono">
                    {acc.isConnected ? (
                      <>
                        {formatCurrency(acc.balance)} <RiyalSymbol className="mr-1 text-slate-500 text-sm" />
                      </>
                    ) : '—'}
                  </span>
                </div>

                <button
                  onClick={() => toggleConnect(acc.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${acc.isConnected ? 'bg-brand-clay/10 text-brand-clay hover:bg-brand-clay/20' : 'bg-brand-navy text-white hover:bg-brand-indigo'}`}
                >
                  {acc.isConnected ? 'قطع الاتصال' : 'ربط الحساب'}
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4 justify-between border-t border-brand-gray">
          
          <button
            id="btn-continue-analysis"
            disabled={activeCount === 0}
            onClick={() => onNavigate('dashboard')}
            className={`px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeCount > 0 ? 'bg-gradient-to-l from-brand-navy to-brand-indigo text-white hover:shadow-lg hover:shadow-brand-navy/20 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <span>متابعة التحليل المالي</span>
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('consent')}
            className="px-6 py-3.5 rounded-xl border border-brand-gray text-slate-500 hover:bg-slate-50 transition-colors font-medium text-sm flex items-center gap-1 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الرجوع للموافقة</span>
          </button>
        </div>

      </div>

      {/* Bank Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print animate-fadeIn">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isLinking && setIsModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-gray relative z-10 text-right space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center flex-row-reverse border-b border-brand-gray pb-4">
              <h3 className="text-lg font-black text-brand-navy">ربط حساب بنكي جديد</h3>
              <button 
                type="button"
                disabled={isLinking}
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {isLinking && selectedBank ? (
              /* Linking Animation View */
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-slate-100 border-t-brand-purple rounded-full animate-spin"></div>
                  <div className={`w-12 h-12 rounded-full ${selectedBank.color} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                    {selectedBank.logoLetter}
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <h4 className="text-sm font-bold text-brand-navy">جاري الاتصال الآمن بـ {selectedBank.name}...</h4>
                  <p className="text-[10px] text-slate-400">يتم تشفير وتوثيق الاتصال بموجب معايير المصرفية المفتوحة (SAMA)</p>
                </div>

                <div className="w-full max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-purple transition-all duration-200" 
                    style={{ width: `${Math.min(linkingProgress, 100)}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              /* Bank Selection Grid */
              <div className="space-y-4">
                <p className="text-xs text-slate-500">اختر من البنوك السعودية المتاحة لمحاكاة ربط حسابك الإضافي في بيئة الفحص والتجربة:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAUDI_BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => startSimulatedLink(bank)}
                      className="p-4 rounded-xl border border-brand-gray hover:border-brand-purple/30 bg-white hover:bg-brand-purple/[0.01] hover:shadow-sm transition-all text-right flex items-center gap-3 flex-row-reverse cursor-pointer group"
                    >
                      <div className={`w-9 h-9 rounded-lg ${bank.color} text-white flex items-center justify-center font-black text-sm shrink-0 transition-transform group-hover:scale-105`}>
                        {bank.logoLetter}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-brand-navy block truncate">{bank.name}</span>
                        <span className="text-[9px] text-slate-400 block truncate">{bank.fullName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 border-t border-brand-gray pt-4">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
              <span>اتصال مشفر 256 بت للقراءة فقط بموجب ضوابط SAMA</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
