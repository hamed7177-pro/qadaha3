import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Landmark, Lock, Menu, X, ArrowLeftRight, HelpCircle, 
  ChevronLeft, CreditCard, Sparkles, Home, LayoutDashboard, Link2, 
  Calculator, Award, MessageSquare, LogOut, Check 
} from 'lucide-react';
import { ScreenId } from './types';

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
    <div className="flex flex-col h-full justify-between p-6">
      
      {/* Top Sidebar Body */}
      <div className="space-y-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 flex-row-reverse">
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
          <div className="flex items-center gap-1.5 flex-row-reverse justify-start">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex-row-reverse text-right cursor-pointer group ${
                        isActive 
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
        <div className="flex items-center gap-3 flex-row-reverse">
          {/* Avatar frame */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-clay flex items-center justify-center font-bold text-white text-xs border-2 border-white/20">
            فهد
          </div>
          <div>
            <span className="text-xs font-black text-white block">فهد العتيبي</span>
            <span className="text-[9px] text-slate-400 block">مصمم مستقل • عميل معتمد</span>
          </div>
        </div>

        {/* Security Indicator */}
        <div className="flex items-center gap-1.5 flex-row-reverse justify-start text-[9px] text-slate-400 bg-white/5 p-2 rounded-lg">
          <Lock className="w-3 h-3 text-brand-success" />
          <span>البيانات مشفرة ومحمية بالكامل</span>
        </div>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg flex text-right font-sans selection:bg-brand-purple/20 relative">
      
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-brand-navy text-white h-screen fixed top-0 right-0 z-40 border-l border-white/5 no-print">
        <SidebarContent />
      </aside>

      {/* 2. Main Workspace Container */}
      <div className="flex-1 flex flex-col lg:mr-72 min-h-screen">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="lg:hidden bg-brand-navy text-white sticky top-0 z-40 shadow-md border-b border-white/5 no-print px-4 h-20 flex flex-row-reverse justify-between items-center">
          
          {/* Logo brand and name */}
          <div className="flex items-center gap-3 flex-row-reverse">
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
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row-reverse items-center justify-between gap-3">
            
            <div className="flex items-center gap-2 flex-row-reverse shrink-0">
              <div className="w-2 h-2 rounded-full bg-brand-clay animate-ping"></div>
              <span className="text-xs font-black text-brand-navy">لوحة تحكيم الهاكاثون (التنقل السريع بين الواجهات الـ 10):</span>
            </div>

            {/* Scrollable screen buttons list */}
            <div className="w-full sm:w-auto overflow-x-auto whitespace-nowrap py-1 scrollbar-none flex gap-1.5 flex-row-reverse justify-start">
              {hackathonScreens.map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => handleNavigate(screen.id as ScreenId)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                    currentScreen === screen.id 
                      ? 'bg-brand-navy text-white border-brand-navy shadow-sm scale-105' 
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {screen.label}
                </button>
              ))}
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
            <DashboardView onNavigate={handleNavigate} />
          )}
          {currentScreen === 'test_obligation' && (
            <TestObligationView 
              onNavigate={handleNavigate} 
              onUpdateInstallment={setTestedInstallment}
              currentInstallment={testedInstallment}
            />
          )}
          {currentScreen === 'result' && (
            <ResultView 
              onNavigate={handleNavigate} 
              testedInstallment={testedInstallment}
            />
          )}
          {currentScreen === 'certificate' && (
            <CertificateView 
              onNavigate={handleNavigate} 
              testedInstallment={testedInstallment}
            />
          )}
          {currentScreen === 'recommendations' && (
            <RecommendationsView 
              onNavigate={handleNavigate} 
              testedInstallment={testedInstallment}
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
            <div className="p-4 border-b border-white/10 flex justify-between items-center flex-row-reverse">
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
