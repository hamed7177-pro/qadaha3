import { Bell, Settings, HelpCircle, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

export function TopNav() {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "لوحة التحكم";
      case "/link-accounts":
        return "ربط الحسابات";
      case "/cash-flow":
        return "تحليل التدفق المالي";
      case "/simulator":
        return "محاكي الالتزام";
      case "/certificate":
        return "شهادة قدها";
      case "/chat":
        return "شات قدها";
      case "/improvement-plan":
        return "خطة التحسين المالي";
      default:
        return "";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface dark:bg-surface-dim shadow-sm flex flex-row-reverse justify-between items-center h-16 px-margin-desktop w-full transition-all">
      {/* Left Side (RTL) / Trailing Actions & Profile */}
      <div className="flex items-center gap-4 flex-row-reverse">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary dark:text-primary-fixed hover:bg-surface-container-high transition-colors">
            <Bell size={20} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary dark:text-primary-fixed hover:bg-surface-container-high transition-colors">
            <Settings size={20} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary dark:text-primary-fixed hover:bg-surface-container-high transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>
        <div className="w-px h-8 bg-outline-variant mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer group flex-row-reverse">
          <img
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border border-outline-variant group-hover:border-secondary transition-colors"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQwMc7FkQpJltxSxXilSWNpJYura0fXwYCT-rm0cVFSJA3IQvYjuyQGBdYo6tHHqzoC_oKadLlWc9tvGMnPMShpXvobZY4ol1NLkwjMFJ4wMuVZ39KfcOHTI0ipvMJ3Q-o5lSYz40hU3EIl22nojOE38x464VVv6uQ1LBUgnNGYkiZl5lhYAHMRcQ0ZBM0yr6WfUDXteeQ_PfV6KGLPwPxo8f2W4srEwBj3DE_UM_5Wmlq5u61HnxlFdfWEq1iD-1Son7uaIxX3xg"
          />
          <div className="hidden sm:block text-right">
            <p className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-secondary transition-colors">
              عبدالله محمد
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">حساب شخصي</p>
          </div>
          <ChevronDown size={20} className="text-outline group-hover:text-secondary transition-colors" />
        </div>
      </div>
      
      {/* Right Side (RTL) / Breadcrumbs or Title */}
      <div className="flex items-center flex-row-reverse">
        <h2 className="font-headline-md text-headline-md font-bold text-primary">{getPageTitle()}</h2>
      </div>
    </header>
  );
}
