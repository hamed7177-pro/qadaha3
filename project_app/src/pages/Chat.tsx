import { Send, Bot, Paperclip } from "lucide-react";

export default function Chat() {
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-surface-container-low px-3 py-1.5 rounded-full flex items-center gap-2 border border-surface-variant">
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
          <span className="font-label-sm text-on-surface-variant">متصل - جاهز للمساعدة</span>
        </div>
        <h1 className="font-display-lg text-headline-lg-mobile text-primary-container">شات قدها</h1>
      </div>

      <div className="flex-1 bg-surface-container-lowest rounded-2xl shadow-soft border border-surface-container flex flex-col overflow-hidden relative">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="text-center">
            <span className="bg-surface-container px-3 py-1 rounded-full text-label-sm font-label-sm text-on-surface-variant">
              اليوم، 10:42 ص
            </span>
          </div>
          
          {/* Bot Message */}
          <div className="flex items-start gap-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
              <Bot size={20} />
            </div>
            <div className="flex flex-col items-end">
              <span className="font-label-sm text-on-surface-variant mb-1">شات قدها</span>
              <div className="bg-surface-container-low border border-surface-variant rounded-2xl rounded-tr-none p-4 max-w-lg text-right">
                <p className="font-body-md text-on-surface">
                  مرحبًا، أنا شات قدها. يمكنني مساعدتك في فهم نتائج تحليلك المالي واقتراح طرق لتحسين قدرتك على الالتزام.
                </p>
              </div>
            </div>
          </div>
          
          {/* Suggested Questions */}
          <div className="mt-4 flex flex-col items-end gap-2">
            <span className="font-label-sm text-on-surface-variant ml-2">أسئلة مقترحة:</span>
            <div className="flex flex-wrap justify-end gap-2">
              <button className="bg-surface-container-lowest border border-outline-variant hover:border-secondary hover:text-secondary text-on-surface font-label-md py-2 px-4 rounded-full transition-colors">
                هل أستطيع تحمل قسط 1,500 ر.س؟
              </button>
              <button className="bg-surface-container-lowest border border-outline-variant hover:border-secondary hover:text-secondary text-on-surface font-label-md py-2 px-4 rounded-full transition-colors">
                كيف أرفع مؤشر الملاءة؟
              </button>
              <button className="bg-surface-container-lowest border border-outline-variant hover:border-secondary hover:text-secondary text-on-surface font-label-md py-2 px-4 rounded-full transition-colors">
                لماذا حصلت على "مناسب بحذر"؟
              </button>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-surface-variant bg-surface">
          <div className="relative flex items-center bg-surface-container-low border border-surface-variant rounded-full focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <button className="p-3 text-on-surface-variant hover:text-primary transition-colors flex-shrink-0">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="اكتب سؤالك هنا..." 
              className="flex-1 bg-transparent border-none py-3 px-4 text-body-md font-body-md text-on-surface focus:outline-none focus:ring-0 text-right"
              dir="rtl"
            />
            <button className="p-2 mr-2 ml-2 bg-secondary text-on-secondary rounded-full hover:bg-secondary-container transition-colors flex-shrink-0 flex items-center justify-center w-10 h-10">
              <Send size={18} className="transform rotate-180" />
            </button>
          </div>
          <p className="text-center font-label-sm text-[10px] text-outline mt-3">
            يعتمد شات قدها على البيانات التي وافق المستخدم على مشاركتها فقط لغرض التحليل وتقديم الرؤى. المعلومات المقدمة هي للإرشاد المالي ولا تمثل قرارًا ائتمانيًا أو موافقة على التمويل من أي جهة.
          </p>
        </div>
      </div>
    </div>
  );
}
