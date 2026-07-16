import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { 
  LayoutDashboard, 
  Landmark, 
  Banknote, 
  LineChart, 
  BadgeCheck, 
  MessageSquare, 
  TrendingUp, 
  LogOut 
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "لوحة التحكم", path: "/", icon: LayoutDashboard },
    { name: "ربط الحسابات", path: "/link-accounts", icon: Landmark },
    { name: "تحليل التدفق المالي", path: "/cash-flow", icon: Banknote },
    { name: "محاكي الالتزام", path: "/simulator", icon: LineChart },
    { name: "شهادة قدها", path: "/certificate", icon: BadgeCheck },
    { name: "شات قدها", path: "/chat", icon: MessageSquare },
    { name: "خطة التحسين المالي", path: "/improvement-plan", icon: TrendingUp },
  ];

  return (
    <aside className="hidden md:flex bg-[#0a1d37] fixed right-0 top-0 h-full w-[280px] border-l border-white/10 shadow-sm flex-col items-end text-right px-4 py-8 z-50 transition-all duration-300 ease-in-out group/sidebar">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 w-full justify-start px-4 flex-row-reverse">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
          <img
            alt="Logo"
            className="w-8 h-8 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpTSX0BwivL4fbI9Yz7HF-Pe8IjMZGMDZF4y1risEl8R-CmrJFimQ7jye73Tnt4xwZ2JeucR5PL8Fknonz2xBaRjaK1Ai3gxdh7zVomZvlwIo9UBoFRZLgEijyPJue803wbRuE7kvix8YRqhafFnS1oPj-RiRxTRESd5mVf3iCh5i_JmiEl6PXMcC4RZDD3Ztm_ZVxzrYs6p3EDGCOWMV5dFX4B93CtlQRT7cw4EvTGG4qsB8og9HgF77TjxoXEulN1IoAdA6QRIk"
          />
        </div>
        <div className="text-right flex-1 sidebar-text transition-opacity duration-300">
          <h1 className="text-headline-md font-bold text-white leading-none">قدها</h1>
          <p className="text-[10px] text-white/60 mt-1">القدرة المالية</p>
        </div>
      </div>
      
      {/* Nav Items */}
      <nav className="flex flex-col gap-2 w-full mt-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 transition-all",
                isActive
                  ? "rounded-r-full bg-[#d97757] text-white"
                  : "rounded-lg text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="font-bold sidebar-text whitespace-nowrap">{link.name}</span>
              <Icon size={20} className={cn(isActive && "fill-current")} />
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto w-full">
        <button className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-white/50 hover:text-white transition-all">
          <span className="font-bold sidebar-text whitespace-nowrap">تسجيل الخروج</span>
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
}
