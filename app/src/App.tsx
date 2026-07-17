import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Landmark, Lock, Menu, X, ArrowLeftRight, HelpCircle,
  ChevronLeft, CreditCard, Sparkles, Home, LayoutDashboard, Link2,
  Calculator, Award, MessageSquare, LogOut, Check
} from 'lucide-react';
import { ScreenId, Certificate, UserFinancials } from './types';

// Importing all 10 Screens/Views
import LandingView from './components/LandingView';
import ConsentView from './components/ConsentView';
import ConnectView from './components/ConnectView';
import DashboardView from './components/DashboardView';
import TestObligationView from './components/TestObligationView';
import ResultView from './components/ResultView';
import CertificateView from './components/CertificateView';
import RecommendationsView from './components/RecommendationsView';
import PrivacyView from './components/PrivacyView';
import FunderView from './components/FunderView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');
  const [testedInstallment, setTestedInstallment] = useState<number>(1200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialVerificationId, setInitialVerificationId] = useState<string>('');

  // Backend connection state variables
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('7'); // Default to Fahad (ID 7)
  const [financials, setFinancials] = useState<UserFinancials | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  // Generate a dynamic certificate when financials is loaded or updated
  useEffect(() => {
    if (financials) {
      const today = new Date();
      const issueStr = today.toISOString().split('T')[0];

      const expiry = new Date(today);
      expiry.setMonth(today.getMonth() + 1);
      const expiryStr = expiry.toISOString().split('T')[0];

      // Verification ID format: QDH-YYYY-XXXX
      const year = today.getFullYear();
      const uniqueCode = String((selectedUserId.charCodeAt(0) * 100 + Math.round(testedInstallment) % 1000)).padStart(4, '0');
      const verificationId = `QDH-${year}-${uniqueCode}`;

      setCertificate({
        verificationId,
        issueDate: issueStr,
        expiryDate: expiryStr,
        status: 'active'
      });
    } else {
      setCertificate(null);
    }
  }, [financials, selectedUserId, testedInstallment]);


  const API_BASE_URL = 'https://qadaha3-one.vercel.app';

  // Fetch list of open banking users from Django Sandbox on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        const hasFahad = data.some((u: any) => u.id === 7);
        if (hasFahad) {
          setSelectedUserId('7');
        } else if (data.length > 0) {
          setSelectedUserId(data[0].id.toString());
        }
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        // Fallback static users for sandbox if API is completely unavailable
        const mockUsers = [
          { id: 7, full_name: 'فهد العتيبي', role: 'مصمم مستقل', national_id: '1020304050', phone: '0501234567', email: 'fahad@example.com' }
        ];
        setUsers(mockUsers);
        setSelectedUserId('7');
      });
  }, []);

  // Fetch real-time AI ML predictions and cashflow statistics on user or installment change
  useEffect(() => {
    if (!selectedUserId) return;
    setLoading(true);

    const proposedUrl = `${API_BASE_URL}/api/predict/?user_id=${selectedUserId}&installment=${testedInstallment}`;
    const currentUrl = `${API_BASE_URL}/api/predict/?user_id=${selectedUserId}&installment=0`;

    const proposedPromise = fetch(proposedUrl).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch proposed prediction');
      return res.json();
    });

    const currentPromise = fetch(currentUrl).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch current prediction');
      return res.json();
    });

    Promise.all([proposedPromise, currentPromise])
      .then(([proposedData, currentData]) => {
        let proposedPrediction: 'Suitable' | 'Caution' | 'NotSuitable' = 'Caution';
        if (proposedData.prediction === 'Suitable') {
          proposedPrediction = 'Suitable';
        } else if (proposedData.prediction === 'Not Suitable') {
          proposedPrediction = 'NotSuitable';
        }

        let currentPrediction: 'Suitable' | 'Caution' | 'NotSuitable' = 'Caution';
        if (currentData.prediction === 'Suitable') {
          currentPrediction = 'Suitable';
        } else if (currentData.prediction === 'Not Suitable') {
          currentPrediction = 'NotSuitable';
        }

        let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
        if (proposedData.risk_level.includes('منخفضة')) {
          riskLevel = 'Low';
        } else if (proposedData.risk_level.includes('عالية')) {
          riskLevel = 'High';
        }

        setFinancials({
          name: proposedData.user.full_name,
          role: proposedData.user.role || 'عميل معتمد',
          avgMonthlyIncome12m: proposedData.financials.avg_income,
          monthlyObligations: proposedData.financials.avg_obligations,
          avgMonthlyExpenses: proposedData.financials.avg_expenses,
          proposedInstallment: testedInstallment,
          incomeVolatilityScore: proposedData.financials.income_volatility,
          cashflowStabilityScore: proposedData.financials.cashflow_stability,
          qadahaScore: proposedData.qadaha_score,
          prediction: proposedPrediction,
          riskLevel: riskLevel,
          reasons: proposedData.reasons,
          recommendations: proposedData.recommendations,
          monthlyIncomeHistory: proposedData.financials.monthly_income,
          monthlyExpensesHistory: proposedData.financials.monthly_expenses,
          monthlyObligationsHistory: proposedData.financials.monthly_obligations,
          currentQadahaScore: currentData.qadaha_score,
          currentPrediction: currentPrediction
        } as any);
      })
      .catch((err) => {
        console.error('Error fetching financials:', err);
        // Fallback mock data matching Fahad's specs so the app functions properly
        if (selectedUserId === '7') {
          setFinancials({
            name: 'فهد العتيبي',
            role: 'مصمم مستقل',
            avgMonthlyIncome12m: 11800,
            monthlyObligations: 3200,
            avgMonthlyExpenses: 4937.5,
            proposedInstallment: testedInstallment,
            incomeVolatilityScore: 16,
            cashflowStabilityScore: 72,
            qadahaScore: 72,
            prediction: 'Caution',
            riskLevel: 'Medium',
            reasons: [
              "تذبذب الدخل الشهري كصاحب عمل حر خلال العام",
              "محدودية الفائض المالي بعد المصاريف والالتزام الجديد"
            ],
            recommendations: [
              "تقليل فوري للمصاريف غير الضرورية بنسبة 15%.",
              "ادخار فائض مالي لبناء احتياطي طوارئ بقيمة 5,000 ر.س.",
              "التفكير في تقليل القسط المستهدف إلى 900 ر.س."
            ],
            monthlyIncomeHistory: [11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800, 11800],
            monthlyExpensesHistory: [8500, 9200, 7800, 8900, 9500, 8100, 8400, 9000, 8700, 9100, 8300, 8600],
            monthlyObligationsHistory: [3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200],
            currentQadahaScore: 88,
            currentPrediction: 'Suitable'
          } as any);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedUserId, testedInstallment]);

  const selectedUser = users.find((u) => u.id.toString() === selectedUserId) ||
    (selectedUserId === '7' ? { full_name: 'فهد العتيبي', role: 'مصمم مستقل' } : null);

  // Parse URL pathname and query parameter on mount/popstate to route accordingly
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace(/^\//, '') || 'landing';
      const params = new URLSearchParams(window.location.search);
      const verificationId = params.get('verificationId');

      const validScreens: ScreenId[] = [
        'landing', 'consent', 'connect', 'dashboard',
        'test_obligation', 'result', 'certificate',
        'recommendations', 'privacy', 'funder'
      ];

      let targetScreen: ScreenId = 'landing';
      if (validScreens.includes(path as ScreenId)) {
        targetScreen = path as ScreenId;
      }

      if (verificationId) {
        setInitialVerificationId(verificationId);
        targetScreen = 'funder';
      }

      setCurrentScreen(targetScreen);
    };

    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Quick navigation option list for the Hackathon judges
  const hackathonScreens = [
    { id: 'landing', label: '1. الرئيسية Landing' },
    { id: 'consent', label: '2. الموافقة Consent' },
    { id: 'connect', label: '3. الربط Sandbox' },
    { id: 'dashboard', label: '4. لوحة التحكم Dashboard' },
    { id: 'test_obligation', label: '5. محاكي القسط Simulator' },
    { id: 'result', label: '6. مؤشر الملاءة Result' },
    { id: 'certificate', label: '7. شهادة قدها Certificate' },
    { id: 'recommendations', label: '8. خطة التحسين & Chat' },
    { id: 'privacy', label: '9. الخصوصية Privacy' },
    { id: 'funder', label: '10. بوابة التحقق Checker' },
  ];

  // Sidebar Menu Groups structure
  const menuGroups = [
    {
      title: "البداية والربط البنكي",
      items: [
        { id: 'landing', label: 'الرئيسية والمقدمة', icon: Home },
        { id: 'consent', label: 'الموافقة والربط الآمن', icon: Link2 },
      ]
    },
    {
      title: "التحليل المالي والتقييم",
      items: [
        { id: 'dashboard', label: 'لوحة تحكم المؤشرات', icon: LayoutDashboard },
        { id: 'test_obligation', label: 'محاكي الالتزام والقسط', icon: Calculator },
        { id: 'result', label: 'مؤشر ملاءة قدها', icon: Sparkles },
      ]
    },
    {
      title: "المخرجات والتمويل",
      items: [
        { id: 'certificate', label: 'شهادة الملاءة المعتمدة', icon: Award },
        { id: 'recommendations', label: 'خطة التحسين والمستشار AI', icon: MessageSquare },
      ]
    },
    {
      title: "التحكم والأمان",
      items: [
        { id: 'privacy', label: 'إدارة الصلاحيات والخصوصية', icon: Lock },
        { id: 'funder', label: 'بوابة التحقق للشركاء', icon: Landmark },
      ]
    }
  ];

  // Auto scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const handleNavigate = (screenId: ScreenId) => {
    const path = `/${screenId}`;
    let search = '';

    if (screenId === 'funder' && initialVerificationId) {
      search = `?verificationId=${initialVerificationId}`;
    }

    window.history.pushState(null, '', `${path}${search}`);
    setCurrentScreen(screenId);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col min-h-full justify-between p-6">

      {/* Top Sidebar Body */}
      <div className="space-y-8">

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => handleNavigate('landing')}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-clay to-brand-purple flex items-center justify-center text-white font-black text-lg cursor-pointer hover:scale-105 transition-transform shrink-0"
          >
            ق
          </div>
          <div className="text-right cursor-pointer" onClick={() => handleNavigate('landing')}>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">قدها</h1>
            <span className="text-[9px] text-slate-400 font-mono tracking-widest block mt-0.5">QADAHA SOLVENCY</span>
          </div>
        </div>

        {/* Sandbox Status Badge */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-right">
          <div className="flex items-center gap-1.5 justify-start">
            <span className="w-2 h-2 rounded-full bg-brand-success block animate-pulse"></span>
            <span className="text-[10px] font-bold text-white">اتصال نشط بالـ Sandbox</span>
          </div>
          <span className="text-[9px] text-slate-400 block mt-1 leading-normal">
            المصرفية المفتوحة بموجب ضوابط البنك المركزي السعودي SAMA
          </span>
        </div>

        {/* Navigation List Groups */}
        <nav className="space-y-6 text-right">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider pr-1">
                {group.title}
              </h3>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentScreen === item.id ||
                    (item.id === 'consent' && currentScreen === 'connect');

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id as ScreenId)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right cursor-pointer group ${isActive
                        ? 'bg-brand-clay text-white shadow-md shadow-brand-clay/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

      </div>

      {/* Bottom Profile Details Card */}
      <div className="border-t border-white/10 pt-4 space-y-4 text-right">
        {selectedUser ? (
          <div className="flex items-center gap-3">
            {/* Avatar frame */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-clay flex items-center justify-center font-bold text-white text-xs border-2 border-white/20">
              {selectedUser.full_name.substring(0, 3)}
            </div>
            <div>
              <span className="text-xs font-black text-white block">{selectedUser.full_name}</span>
              <span className="text-[9px] text-slate-400 block">{selectedUser.role || 'عميل معتمد'}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400">جاري تحميل الملف...</div>
        )}

        {/* Security Indicator */}
        <div className="flex items-center gap-1.5 justify-start text-[9px] text-slate-400 bg-white/5 p-2 rounded-lg">
          <Lock className="w-3 h-3 text-brand-success" />
          <span>البيانات مشفرة ومحمية بالكامل</span>
        </div>
      </div>

    </div>
  );
  const isAppInitialized = users.length > 0 && financials !== null;

  if (!isAppInitialized) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center text-center p-6 text-white relative overflow-hidden" dir="rtl">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(143,139,234,0.08)_0,transparent_100%)]"></div>

        <div className="space-y-8 max-w-md w-full relative z-10">
          {/* Logo Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-brand-clay to-brand-purple flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-brand-purple/25 animate-pulse">
            ق
          </div>

          {/* Text Info */}
          <div className="space-y-3">
            <h2 className="text-2xl font-black tracking-tight text-white">منصة قدها للملاءة المالية</h2>
            <p className="text-xs text-slate-300">جاري الاتصال بالـ Open Banking Sandbox وتحميل المؤشرات المالية...</p>
          </div>

          {/* Progress / Loading indicator */}
          <div className="space-y-4">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <div className="absolute top-0 right-0 bottom-0 bg-gradient-to-l from-brand-clay to-brand-purple w-1/2 rounded-full animate-loading-bar"></div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>SAMA Open Banking API v1.0</span>
              <span>جاري التحميل...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex text-right font-sans selection:bg-brand-purple/20 relative overflow-x-hidden" dir="rtl">

      {/* 1. Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-brand-navy text-white h-screen fixed top-0 right-0 z-40 border-l border-white/5 no-print overflow-y-auto scrollbar-thin">
        <SidebarContent />
      </aside>

      {/* 2. Main Workspace Container */}
      <div className="flex-1 flex flex-col lg:mr-72 min-h-screen min-w-0 max-w-full">

        {/* Mobile Header (Hidden on Desktop) */}
        <header className="lg:hidden bg-brand-navy text-white sticky top-0 z-40 shadow-md border-b border-white/5 no-print px-4 h-20 flex justify-between items-center">

          {/* Logo brand and name */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => handleNavigate('landing')}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-clay to-brand-purple flex items-center justify-center text-white font-black text-lg cursor-pointer"
            >
              ق
            </div>
            <div className="text-right">
              <h1 className="text-lg font-black tracking-tight leading-none text-white">قدها</h1>
              <span className="text-[9px] text-slate-400 font-mono">QADAHA</span>
            </div>
          </div>

          {/* Quick connection status indicator */}
          <div className="flex items-center gap-1.5 text-[10px] bg-white/5 px-2.5 py-1 rounded-full text-brand-success border border-white/10">
            <span className="w-2 h-2 rounded-full bg-brand-success block animate-ping"></span>
            <span>الربط آمن</span>
          </div>

          {/* Mobile menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-brand-clay transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </header>

        {/* Judges / Evaluators Hackathon Interactive Controller (Sticky under top line, no-print) */}
        <div className="bg-brand-gray border-b border-slate-300 py-3 no-print sticky top-20 lg:top-0 z-30 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-start gap-3">

            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-2 h-2 rounded-full bg-brand-clay animate-ping"></div>
                <span className="text-xs font-black text-brand-navy">التحكم التجريبي:</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500">المستفيد:</span>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="px-2.5 py-1.5 text-[10px] font-bold text-brand-navy bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-purple cursor-pointer"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.role || 'عمل حر'})
                    </option>
                  ))}
                </select>
              </div>

              {certificate && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold text-slate-500">حالة الشهادة:</span>
                  <select
                    value={certificate.status}
                    onChange={(e) => {
                      const val = e.target.value as 'active' | 'expired' | 'used';
                      const today = new Date();
                      let issueStr = today.toISOString().split('T')[0];

                      const expiry = new Date(today);
                      expiry.setMonth(today.getMonth() + 1);
                      let expiryStr = expiry.toISOString().split('T')[0];

                      if (val === 'expired') {
                        const pastDate = new Date();
                        pastDate.setDate(pastDate.getDate() - 45); // 45 days ago
                        issueStr = pastDate.toISOString().split('T')[0];

                        const pastExpiry = new Date(pastDate);
                        pastExpiry.setMonth(pastExpiry.getMonth() + 1);
                        expiryStr = pastExpiry.toISOString().split('T')[0];
                      }

                      setCertificate({
                        ...certificate,
                        status: val,
                        issueDate: issueStr,
                        expiryDate: expiryStr,
                        acceptedBy: val === 'used' ? 'بنك الراجحي' : undefined,
                        acceptedDate: val === 'used' ? new Date().toISOString().split('T')[0] : undefined
                      });
                    }}
                    className="px-2.5 py-1.5 text-[10px] font-bold text-brand-navy bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-purple cursor-pointer"
                  >
                    <option value="active">نشطة (صلاحية شهر)</option>
                    <option value="expired">منتهية الصلاحية</option>
                    <option value="used">مستعملة (تم أخذ قرض)</option>
                  </select>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 3. Render Current Screen Content */}
        <main className="flex-1 p-4 md:p-8">
          {currentScreen === 'landing' && (
            <LandingView onNavigate={handleNavigate} />
          )}
          {currentScreen === 'consent' && (
            <ConsentView onNavigate={handleNavigate} />
          )}
          {currentScreen === 'connect' && (
            <ConnectView onNavigate={handleNavigate} />
          )}
          {currentScreen === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              financials={financials}
              loading={loading}
            />
          )}
          {currentScreen === 'test_obligation' && (
            <TestObligationView
              onNavigate={handleNavigate}
              onUpdateInstallment={setTestedInstallment}
              currentInstallment={testedInstallment}
              financials={financials}
              loading={loading}
            />
          )}
          {currentScreen === 'result' && (
            <ResultView
              onNavigate={handleNavigate}
              testedInstallment={testedInstallment}
              financials={financials}
              loading={loading}
            />
          )}
          {currentScreen === 'certificate' && (
            <CertificateView
              onNavigate={handleNavigate}
              testedInstallment={testedInstallment}
              financials={financials}
              loading={loading}
              certificate={certificate}
            />
          )}
          {currentScreen === 'recommendations' && (
            <RecommendationsView
              onNavigate={handleNavigate}
              testedInstallment={testedInstallment}
              financials={financials}
              loading={loading}
            />
          )}
          {currentScreen === 'privacy' && (
            <PrivacyView onNavigate={handleNavigate} />
          )}
          {currentScreen === 'funder' && (
            <FunderView
              onNavigate={handleNavigate}
              testedInstallment={testedInstallment}
              initialVerificationId={initialVerificationId}
              financials={financials}
              loading={loading}
              certificate={certificate}
              onAcceptCertificate={(bankName: string) => {
                if (certificate) {
                  setCertificate({
                    ...certificate,
                    status: 'used',
                    acceptedBy: bankName,
                    acceptedDate: new Date().toISOString().split('T')[0]
                  });
                }
              }}
              onResetCertificate={() => {
                if (certificate) {
                  setCertificate({
                    ...certificate,
                    status: 'active',
                    acceptedBy: undefined,
                    acceptedDate: undefined
                  });
                }
              }}
            />
          )}
        </main>

        {/* 4. Footer */}
        <footer className="bg-brand-navy text-white/50 text-xs py-8 border-t border-white/5 no-print mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">

            <div className="flex items-center justify-center gap-1.5 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-brand-success" />
              <span>منصة قدها لتوثيق الملاءة المالية الآمنة 2026</span>
            </div>

            <p className="max-w-xl mx-auto leading-relaxed">
              جميع البيانات المصرفية والعمليات والمدخلات مشفرة ومؤمنة تماماً بموجب ضوابط الأمن السيبراني والمصرفية المفتوحة بالمملكة العربية السعودية.
            </p>

            <div className="text-[10px] text-white/30 pt-2 border-t border-white/5">
              مشاركة الملخص فقط، وليس كشف الحساب الكامل • تطوير فكرة ومنصة قدها
            </div>

          </div>
        </footer>

      </div>

      {/* 5. Mobile Side Navigation Drawer (Sliding from Right) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-row-reverse no-print">

          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Menu */}
          <aside className="relative flex flex-col w-72 bg-brand-navy text-white h-full shadow-2xl z-10 animate-slideInRight">
            {/* Close Button Inside Menu */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">القائمة الرئيسية</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded sidebar menu */}
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>

          </aside>

        </div>
      )}

    </div>
  );
}
