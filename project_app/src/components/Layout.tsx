import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased w-full" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen md:mr-[280px] w-full transition-all duration-300">
        <TopNav />
        <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-low overflow-x-hidden">
          <div className="max-w-container-max mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
