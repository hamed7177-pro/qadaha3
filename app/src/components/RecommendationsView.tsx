import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ArrowRight, ArrowLeft, MessageSquare, Plus, CheckCircle, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';
import { ScreenId, ChatMessage } from '../types';

interface RecommendationsViewProps {
  onNavigate: (screenId: ScreenId) => void;
  testedInstallment: number;
}

export default function RecommendationsView({ onNavigate, testedInstallment }: RecommendationsViewProps) {
  
  // Custom 30/60/90 plan cards
  const steps = [
    {
      days: '30 يوم',
      title: 'ضغط وتقليل المصاريف المتغيرة',
      action: 'خفض فوري لمصاريف المعيشة اليومية والمطاعم والترفيه بنسبة 15%.',
      impact: 'يوفر حوالي 740 ر.س شهرياً فائض إضافي.',
      completed: false,
    },
    {
      days: '60 يوم',
      title: 'بناء الاحتياطي النقدي (صندوق الطوارئ)',
      action: 'توفير وادخار فائض مالي تراكمي بقيمة 5,000 ر.س في محفظة طويق الادخارية.',
      impact: 'يرفع مؤشر استقرار الرصيد بشكل ملحوظ ويعزز ملاءتك.',
      completed: false,
    },
    {
      days: '90 يوم',
      title: 'جدولة عقود ومستحقات المشاريع',
      action: 'تنظيم مواعيد دفعات عملائك المستقلين لتكون دورية في أول كل شهر هجري/ميلادي.',
      impact: 'يقلل مؤشر تذبذب الدخل إلى الحد الأدنى ويضمن الالتزام بانتظام.',
      completed: false,
    },
  ];

  // Chat with Gemini Integration
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'مرحباً فهد! أنا مستشارك المالي الذكي لـ "قدها". كيف يمكنني مساعدتك اليوم في فهم ملاءتك المالية أو تقديم نصائح لرفع مؤشرك من 72 إلى 81؟',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick questions
  const suggestedQuestions = [
    'كيف أرفع مؤشر ملاءتي إلى 81؟',
    'هل أستطيع تحمل قسط شهري بقيمة 1,500 ر.س؟',
    'لماذا نتيجة ملاءتي حالياً هي "مناسب بحذر"؟',
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call the secure Express backend proxy for Gemini
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-5), // send recent context
        }),
      });
      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: data.reply || 'عذراً، واجهت مشكلة في معالجة الرد.',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: 'مرحباً! يبدو أن هناك عطلاً مؤقتاً في الاتصال بالشبكة، ولكن كـ "فهد"، أنصحك بالعمل على بناء احتياطي 5,000 ر.س لتقليل الحذر التمويلي.',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-right">
      
      <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy">خطة التحسين والتوصيات الذكية</h2>
          <p className="text-xs text-slate-400">خطوات عملية وجدول زمني مدعوم بالذكاء الاصطناعي لرفع مؤشر قبولك المالي</p>
        </div>
        <button
          onClick={() => onNavigate('certificate')}
          className="px-4 py-2 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-indigo flex items-center gap-1 cursor-pointer"
        >
          <span>عرض شهادة الملاءة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Timeline Improvement Steps */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-gray p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center flex-row-reverse">
            <h3 className="text-lg font-bold text-brand-navy">خارطة الطريق لتحسين الملاءة (30 / 60 / 90 يوم)</h3>
            <span className="text-xs text-brand-success font-bold bg-brand-success/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>أثر الخطة: المؤشر سيرتفع إلى +81</span>
            </span>
          </div>

          <div className="relative border-r-2 border-brand-gray pr-6 space-y-8 mr-2">
            {steps.map((s, idx) => (
              <div key={idx} className="relative space-y-2">
                {/* Visual circle bullet */}
                <div className="absolute -right-[33px] top-1.5 w-4 h-4 rounded-full border-2 border-brand-purple bg-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple"></div>
                </div>

                <div className="flex justify-between items-baseline flex-row-reverse">
                  <span className="text-xs bg-brand-purple/10 text-brand-purple font-bold px-2.5 py-0.5 rounded-full font-mono">{s.days}</span>
                  <h4 className="text-base font-bold text-brand-navy">{s.title}</h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{s.action}</p>
                <div className="text-[11px] text-brand-clay font-semibold">الأثر المترتب: {s.impact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Musa'ed Qadaha AI Chatbot */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-gray shadow-md flex flex-col h-[520px] overflow-hidden relative">
          
          {/* Chat Header */}
          <div className="p-4 bg-brand-navy text-white flex justify-between items-center flex-row-reverse border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5 flex-row-reverse">
              <div className="w-9 h-9 rounded-xl bg-brand-clay flex items-center justify-center text-white shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-extrabold">مساعد قدها المالي</h3>
                <span className="text-[9px] text-brand-purple font-bold block">مستشار ملاءة ذكي • نشط حالياً</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-brand-success font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-ping"></div>
              <span>متصل</span>
            </div>
          </div>

          {/* Chat message logs */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-start flex-row' : 'justify-end flex-row-reverse'}`}
              >
                {/* Text box */}
                <div 
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed text-right relative shadow-sm ${m.sender === 'user' ? 'bg-gradient-to-l from-brand-navy to-brand-indigo text-white rounded-tl-none' : 'bg-white text-slate-800 border border-brand-gray rounded-tr-none'}`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className={`text-[8px] block mt-1.5 ${m.sender === 'user' ? 'text-white/50 text-left' : 'text-slate-400 text-left'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated Typist loader */}
            {loading && (
              <div className="flex gap-2.5 justify-end flex-row-reverse">
                <div className="bg-white border border-brand-gray rounded-2xl rounded-tr-none p-3.5 text-xs text-slate-500 shadow-sm">
                  <div className="flex items-center gap-1 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Suggested quick questions scrollbar */}
          <div className="p-2 border-t border-brand-gray bg-white overflow-x-auto whitespace-nowrap shrink-0 flex gap-2 justify-end no-scrollbar">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-purple/10 hover:text-brand-purple text-[10px] font-bold text-slate-600 transition-colors cursor-pointer border border-brand-gray inline-block"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input text controls */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 bg-white border-t border-brand-gray flex gap-2 items-center shrink-0"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اسأل مستشار قدها شيئاً..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-brand-gray text-xs focus:outline-none focus:border-brand-purple text-right"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2.5 rounded-xl text-white font-bold transition-all ${input.trim() && !loading ? 'bg-brand-clay hover:bg-brand-clay/90 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              <Send className="w-4 h-4 transform rotate-180" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
