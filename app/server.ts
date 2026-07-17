import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini API client initialization to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not defined in the environment secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for Qadaha Smart Assistant Chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGeminiClient();

    // System instruction to act as Qadaha's smart financial counselor
    const systemInstruction = `
أنت "مستشار قدها المالي الذكي" - مساعد ذكاء اصطناعي تفاعلي لمنصة "قدها" (منصة ملاءة مالية سعودية مبنية على المصرفية المفتوحة).
منصة "قدها" تساعد أصحاب الدخل غير المنتظم مثل المصممين المستقلين والمستقلين وأصحاب المشاريع الناشئة والعمل الحر على تقييم قدرتهم المالية والملاءة قبل التقديم على تمويل أو تقسيط.

تتحدث باللغة العربية بأسلوب مهني، مطمئن، ذكي، سعودي، ومحفز. 
عند إجابة المستخدم، التزم بالحقائق والمعلومات الخاصة بالملف المالي لـ "فهد" (أو أي مستخدم آخر):
- الاسم: فهد (مصمم مستقل)
- متوسط الدخل الشهري الفعلي (السنوي): 11,800 ريال سعودي
- الالتزامات الشهرية الحالية: 3,200 ريال سعودي
- المصاريف التقديرية الأخرى: 4,950 ريال سعودي
- القسط الجديد الذي ترغب في اختباره: 1,200 ريال سعودي
- نسبة الالتزامات الإجمالية الحالية (بدون القسط الجديد): 27% من الدخل
- نسبة الالتزامات بعد القسط الجديد: 37% من الدخل
- مؤشر "قدها" الحالي: 72/100 (النتيجة: مناسب بحذر 🟡)
- السبب الرئيسي للحذر: تذبذب الدخل الشهري كصاحب عمل حر خلال العام ومحدودية الفائض المالي بعد المصاريف والالتزام الجديد.

قدم نصائح عملية بناءً على تساؤلات المستخدم:
1. كيفية تحسين مؤشر قدها (مثل خفض المصاريف المتغيرة بنسبة 15%، بناء صندوق طوارئ واحتياطي بقيمة 5,000 ريال، تأجيل الالتزام الجديد لشهرين أو تخفيض القسط إلى 900 ريال بدلاً من 1,200 ريال).
2. شرح أن تقرير قدها هو "تحليل ملاءة داعم" مبني على التدفقات النقدية والعمليات الفعلية وليس تقريراً ائتمانياً رسمياً (مثل سمة)، مما يحمي خصوصية كشف الحساب بمشاركة الملخص فقط.
3. التحدث بنبرة ودية ومشجعة جداً للأعمال الحرة والشباب الطموح في المملكة متوافقاً مع أهداف رؤية 2030 وتطوير قطاع التقنية المالية بالتعاون مع بنك الإنماء وأكاديمية طويق.

أجب باختصار وبشكل منظم وبنقاط سريعة وسهلة القراءة وموجهة مباشرة لسؤال المستخدم.
`.trim();

    // Reconstruct the chat with the history provided
    // Using simple generateContent because it's stateless on the API level but we feed history
    const contents: any[] = [];

    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add the current prompt
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || 'عذراً، لم أستطع معالجة طلبك حالياً.';
    res.json({ reply: text });

  } catch (error: any) {
    console.error('Error with Gemini API:', error);
    // Graceful error fallback
    res.json({
      reply: `مرحباً بك! مستشار قدها هنا لمساعدتك. (ملاحظة: واجهنا صعوبة في الاتصال بمحرك الذكاء الاصطناعي بسبب عدم تهيئة مفتاح GEMINI_API_KEY، ولكن يمكنك استخدام النظام التفاعلي ومحاكي الملاءة في المنصة لتجربة كاملة). 

نصيحتي لك كـ "فهد": مؤشر ملاءتك الحالي هو 72/100 (مناسب بحذر). التزامك الجديد بقيمة 1,200 ر.س يرفع نسبة التزاماتك إلى 37%. أنصحك بالتالي لرفع المؤشر إلى 81:
1. تقليل فوري للمصاريف غير الضرورية بنسبة 15%.
2. ادخار فائض مالي لبناء احتياطي طوارئ بقيمة 5,000 ر.س.
3. التفكير في تقليل القسط المستهدف إلى 900 ر.س.`
    });
  }
});

// Proxy all other /api/* requests to Django backend on http://127.0.0.1:8000
app.all('/api/*', async (req, res, next) => {
  if (req.path === '/api/gemini/chat' || req.path === '/api/health') {
    return next();
  }
  // const urll = "http://127.0.0.1:8000";
  const urll = "https://qadaha3-one.vercel.app";

  const djangoUrl = `${urll}${req.originalUrl}`;
  try {
    const response = await fetch(djangoUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error(`Error proxying to Django (${djangoUrl}):`, error);
    res.status(502).json({ error: 'Failed to communicate with Django backend' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', time: new Date() });
});

// Setup Vite or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Qadaha Server] Running on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start Qadaha server:', err);
});
