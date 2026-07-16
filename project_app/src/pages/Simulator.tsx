import { Info, Calculator, Save, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export default function Simulator() {
  const [hasDownPayment, setHasDownPayment] = useState(false);

  return (
    <div className="space-y-gutter pb-8">
      {/* Header Section */}
      <div className="mb-gutter text-right">
        <h1 className="text-display-lg font-display-lg text-primary-container mb-stack-sm">اختبر التزامًا جديدًا</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">قم بمحاكاة أثر الالتزامات المالية الجديدة على ميزانيتك قبل اتخاذ القرار.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Form Column (Right - RTL) */}
        <div className="lg:col-span-5 flex flex-col gap-gutter lg:order-2">
          <div className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-soft border border-surface-container-highest">
            <h2 className="text-headline-md font-headline-md text-primary-container mb-stack-lg text-right">تفاصيل الالتزام المقترح</h2>
            <form className="flex flex-col gap-stack-md text-right">
              
              <div className="flex flex-col">
                <label className="text-label-md font-label-md text-on-surface-variant mb-stack-sm">نوع الالتزام</label>
                <select className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg py-3 px-4 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-tertiary-fixed-dim transition-all appearance-none" dir="rtl">
                  <option value="installment">تقسيط</option>
                  <option value="loan">قرض شخصي</option>
                  <option value="car">تمويل سيارة</option>
                  <option value="mortgage">تمويل عقاري</option>
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-label-md font-label-md text-on-surface-variant mb-stack-sm">القسط الشهري المتوقع (ر.س)</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg py-3 pl-12 pr-4 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-tertiary-fixed-dim transition-all" dir="rtl" type="text" defaultValue="1,200" />
                  <span className="absolute left-4 top-3 text-on-surface-variant text-label-md">ر.س</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-label-md font-label-md text-on-surface-variant mb-stack-sm">مدة الالتزام (بالأشهر)</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg py-3 pl-16 pr-4 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-tertiary-fixed-dim transition-all" dir="rtl" type="number" defaultValue="12" />
                  <span className="absolute left-4 top-3 text-on-surface-variant text-label-md">شهرًا</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-label-md font-label-md text-on-surface-variant mb-stack-sm">تاريخ بداية الالتزام</label>
                <input className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg py-3 px-4 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-tertiary-fixed-dim transition-all" dir="rtl" type="date" defaultValue="2024-11-01" />
              </div>
              
              <div className="flex items-center justify-between mt-stack-sm bg-surface-container py-3 px-4 rounded-lg flex-row-reverse">
                <label className="text-body-md font-body-md text-on-surface cursor-pointer select-none" htmlFor="toggle">هل توجد دفعة أولية؟</label>
                <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    id="toggle" 
                    className="opacity-0 absolute block w-6 h-6 rounded-full cursor-pointer transition-transform duration-200 ease-in-out z-10"
                    checked={hasDownPayment}
                    onChange={(e) => setHasDownPayment(e.target.checked)}
                  />
                  <div className={cn("block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out", hasDownPayment ? "bg-secondary" : "bg-outline-variant")}></div>
                  <div className={cn("absolute top-0 block w-6 h-6 rounded-full bg-surface-container-lowest border-4 cursor-pointer transition-transform duration-200 ease-in-out", hasDownPayment ? "right-0 border-secondary translate-x-[-100%]" : "right-0 border-surface-container")}></div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-stack-sm mt-stack-lg flex-row-reverse">
                <button className="flex-1 bg-secondary text-on-primary font-title-lg text-title-lg py-3 px-6 rounded-lg hover:bg-on-secondary-container transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 flex-row-reverse" type="button">
                  <Calculator size={24} />
                  <span>احسب قدرتي</span>
                </button>
                <button className="flex-1 bg-transparent border-[1.5px] border-primary-container text-primary-container font-title-lg text-title-lg py-3 px-6 rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-2 flex-row-reverse" type="button">
                  <Save size={24} />
                  <span>حفظ كمسودة</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Simulation Preview Column (Left - RTL) */}
        <div className="lg:col-span-7 flex flex-col gap-gutter lg:order-1">
          <div className="bg-primary-container rounded-xl p-6 shadow-xl relative overflow-hidden flex items-start gap-4 text-right border-l-4 border-secondary flex-row-reverse">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #ffdbd0 0%, transparent 50%)' }}></div>
            <div className="bg-secondary p-3 rounded-full flex-shrink-0 z-10 text-on-secondary">
              <Info size={24} />
            </div>
            <div className="z-10">
              <h3 className="text-headline-md font-headline-md text-surface-bright mb-1">أثر الالتزام الجديد</h3>
              <p className="text-title-lg font-title-lg text-tertiary-fixed-dim leading-relaxed">
                بعد إضافة هذا الالتزام (1,200 ر.س)، ستصل نسبة الالتزامات الإجمالية إلى <span className="text-secondary-fixed font-bold">42%</span> من متوسط الدخل الشهري.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Before Card */}
            <div className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-soft border border-surface-container-highest text-right flex flex-col items-center">
              <div className="w-full bg-surface-container p-stack-sm rounded-lg mb-stack-md text-center">
                <span className="text-title-lg font-title-lg text-on-surface-variant">الوضع الحالي (قبل)</span>
              </div>
              <div className="relative w-40 h-40 flex items-center justify-center mb-stack-md">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#e4e2de" strokeWidth="8"></circle>
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#1a0f6d" strokeDasharray="251.2" strokeDashoffset="170.8" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-headline-lg font-headline-lg text-primary-container">32%</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">نسبة الالتزام</span>
                </div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center text-body-md font-body-md flex-row-reverse">
                  <span className="text-on-surface-variant flex items-center gap-2 flex-row-reverse">إجمالي الالتزامات <span className="w-3 h-3 rounded-full bg-tertiary-container block"></span></span>
                  <span className="text-primary-container font-bold" dir="ltr">4,500 ر.س</span>
                </div>
                <div className="flex justify-between items-center text-body-md font-body-md flex-row-reverse">
                  <span className="text-on-surface-variant flex items-center gap-2 flex-row-reverse">المتبقي للتصرف <span className="w-3 h-3 rounded-full bg-surface-container-highest block"></span></span>
                  <span className="text-primary-container font-bold" dir="ltr">9,500 ر.س</span>
                </div>
              </div>
            </div>

            {/* After Card */}
            <div className="bg-primary-container rounded-xl p-stack-lg shadow-xl border border-tertiary-container text-right flex flex-col items-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary rounded-full opacity-10 blur-2xl"></div>
              <div className="w-full bg-tertiary-container p-stack-sm rounded-lg mb-stack-md text-center z-10 border border-on-tertiary-container/30">
                <span className="text-title-lg font-title-lg text-secondary-fixed">الوضع المتوقع (بعد)</span>
              </div>
              <div className="relative w-40 h-40 flex items-center justify-center mb-stack-md z-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#334767" strokeWidth="8"></circle>
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#994629" strokeDasharray="251.2" strokeDashoffset="145.7" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-headline-lg font-headline-lg text-surface-bright">42%</span>
                  <span className="text-label-sm font-label-sm text-surface-variant opacity-80">نسبة الالتزام</span>
                </div>
              </div>
              <div className="w-full space-y-3 z-10">
                <div className="flex justify-between items-center text-body-md font-body-md flex-row-reverse">
                  <span className="text-surface-variant opacity-90 flex items-center gap-2 flex-row-reverse">إجمالي الالتزامات <span className="w-3 h-3 rounded-full bg-secondary block shadow-[0_0_8px_rgba(201,107,75,0.6)]"></span></span>
                  <span className="text-surface-bright font-bold" dir="ltr">5,700 ر.س</span>
                </div>
                <div className="flex justify-between items-center text-body-md font-body-md flex-row-reverse">
                  <span className="text-surface-variant opacity-90 flex items-center gap-2 flex-row-reverse">المتبقي للتصرف <span className="w-3 h-3 rounded-full bg-on-primary-fixed-variant block"></span></span>
                  <span className="text-surface-bright font-bold" dir="ltr">8,300 ر.س</span>
                </div>
              </div>
              
              {/* Caution Indicator */}
              <div className="mt-stack-md w-full bg-[#390c00]/40 border border-secondary/30 rounded-lg p-2 flex items-center justify-center gap-2 text-secondary-fixed z-10 flex-row-reverse">
                <AlertTriangle size={16} />
                <span className="text-label-sm font-label-sm">يقترب من الحد الأقصى الموصى به (45%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
