import { UserFinancials, Transaction } from '../types';

// Helper to calculate stan00dard deviation
export function calculateStdev(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

// Default 12-month income data for Fahad (showing realistic freelance fluctuations)
export const FAHAD_12M_INCOME = [
  12500, 11000, 9500, 14000, 11800, 10500,
  13200, 8900, 12000, 11500, 14200, 12500
];

// Default 12-month expenses (with some fluctuation)
export const FAHAD_12M_EXPENSES = [
  5100, 4800, 4500, 5200, 4950, 4700,
  5300, 4400, 5000, 4800, 5400, 5100
];

// Default 12-month current obligations (3,200 SAR fixed per month)
export const FAHAD_12M_OBLIGATIONS = Array(12).fill(3200);

/**
 * Calculates complete financial analysis including Qadaha Score, Volatility, and stability
 */
export function analyzeFinancials(
  income12m: number[],
  expenses12m: number[],
  obligations12m: number[],
  proposedInstallment: number
): UserFinancials {
  const monthsCount = 12;

  // Average monthly totals
  const avgIncome = income12m.reduce((sum, v) => sum + v, 0) / monthsCount;
  const avgExpenses = expenses12m.reduce((sum, v) => sum + v, 0) / monthsCount;
  const avgObligations = obligations12m.reduce((sum, v) => sum + v, 0) / monthsCount;

  // Volatility of income (Std dev of income)
  const incomeVolatility = calculateStdev(income12m);
  // Volatility score scaled to 0-100 (high deviation = high volatility)
  // E.g., if stdev is 1800 SAR on a 11800 SAR income, that is ~15% volatility.
  // We match the Python formula: min(round(volatility / 100), 100)
  const incomeVolatilityScore = Math.min(Math.round(incomeVolatility / 100), 100);

  // Monthly surplus history
  const monthlySurpluses = income12m.map((inc, i) => {
    return inc - expenses12m[i] - obligations12m[i];
  });

  const surplusStdev = calculateStdev(monthlySurpluses);
  // Stability score: max(0, min(100, 100 - round(surplusStdev / 100)))
  const cashflowStabilityScore = Math.max(0, Math.min(100, 100 - Math.round(surplusStdev / 100)));

  // Total obligations (current + new proposed installment)
  const totalObligationsWithNew = avgObligations + proposedInstallment;
  const finalSurplus = avgIncome - avgExpenses - totalObligationsWithNew;
  const obligationToIncomeRatio = totalObligationsWithNew / avgIncome;

  // Determine prediction status based on ratio, surplus, and volatility
  let prediction: 'Suitable' | 'Caution' | 'NotSuitable' = 'Suitable';

  if (obligationToIncomeRatio > 0.45 || finalSurplus < 500) {
    prediction = 'NotSuitable';
  } else if (obligationToIncomeRatio > 0.30 || incomeVolatilityScore > 12 || finalSurplus < 2000) {
    prediction = 'Caution';
  }

  // Calculate the custom Qadaha score (0 to 100)
  // Using the Python formula weights:
  // surplus_score = min(max(avg_monthly_surplus / 5000, 0), 1)
  // stability_score = cashflow_stability_score / 100
  // obligation_score = 1 - min(max(obligation_to_income_ratio / 0.6, 0), 1)
  // base_score: Suitable = 1.0, Caution = 0.5, NotSuitable = 0.0
  // score = 0.40 * base_score + 0.30 * confidence + 0.10 * surplus_score + 0.10 * stability_score + 0.10 * obligation_score
  // Let's assume a confidence value of 0.88 for our model.
  const confidence = 0.88;
  const baseScoreWeight = prediction === 'Suitable' ? 1.0 : prediction === 'Caution' ? 0.5 : 0.0;

  const surplusScore = Math.min(Math.max(finalSurplus / 5000, 0), 1);
  const stabilityScoreObj = cashflowStabilityScore / 100;
  const obligationScore = 1 - Math.min(Math.max(obligationToIncomeRatio / 0.6, 0), 1);

  const rawScore = (
    0.40 * baseScoreWeight +
    0.30 * confidence +
    0.10 * surplusScore +
    0.10 * stabilityScoreObj +
    0.10 * obligationScore
  );

  // Scaled up to max of 97 as specified in the python script: qadaha_score = round(min(score * 97, 97), 1)
  const qadahaScoreRaw = Math.min(rawScore * 97, 97);
  // Rounded to nearest single decimal place
  const qadahaScore = Math.round(qadahaScoreRaw * 10) / 10;

  // Risk Level
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (qadahaScore >= 80) {
    riskLevel = 'Low';
  } else if (qadahaScore >= 50) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }

  // Generate Reasons
  const reasons: string[] = [];
  if (obligationToIncomeRatio > 0.4) {
    reasons.push('ارتفاع نسبة الالتزامات إلى الدخل عن الحد الموصى به (40%).');
  } else if (obligationToIncomeRatio > 0.3) {
    reasons.push('نسبة الالتزامات متوسطة وتقترب من الحدود الحرجة.');
  } else {
    reasons.push('نسبة التزامات منخفضة وممتازة مقارنة بمتوسط الدخل.');
  }

  if (incomeVolatilityScore > 15) {
    reasons.push('تذبذب عالي في الدخل الشهري بسبب طبيعة العمل الحر (المستقل).');
  } else if (incomeVolatilityScore > 8) {
    reasons.push('تذبذب طبيعي ومقبول في تدفقات الدخل السنوية.');
  } else {
    reasons.push('استقرار ممتاز في تدفق الدخل الشهري.');
  }

  if (cashflowStabilityScore > 70) {
    reasons.push('التدفق النقدي العام يظهر استقراراً إيجابياً وبنية ادخار جيدة.');
  } else {
    reasons.push('تراجع استقرار التدفق النقدي نظراً لزيادة المصاريف المتغيرة.');
  }

  if (finalSurplus > 2000) {
    reasons.push('يوجد فائض شهري متاح جيد يدعم تغطية أي ظروف طارئة.');
  } else if (finalSurplus > 500) {
    reasons.push('الفائض النقدي الشهري بعد الالتزام الجديد ضيق وصغير.');
  } else {
    reasons.push('عجز أو فائض حرج جداً لا يتحمل أي التزام مالي إضافي.');
  }

  // Generate Recommendations
  const recommendations: string[] = [];
  if (prediction === 'Suitable') {
    recommendations.push('حافظ على استقرار دخلك الحالي واستمر في وتيرة الادخار.');
    recommendations.push('تجنب التوقيع على التزامات ائتمانية متزامنة أخرى في الوقت الراهن.');
    recommendations.push('قم بتأكيد حجز التمويل فوراً وشارك شهادتك مع جهة التمويل.');
  } else if (prediction === 'Caution') {
    if (obligationToIncomeRatio > 0.35) {
      recommendations.push('حاول تقليص التزاماتك الحالية أو سداد أحد الديون الصغيرة قبل الدخول في هذا الالتزام.');
    }
    if (incomeVolatilityScore > 10) {
      recommendations.push('اعمل على زيادة استقرار الدخل عبر جدولة دفعات مشاريعك المستقلة بانتظام.');
    }
    recommendations.push('خفّض مصاريف المطاعم والترفيه بنسبة 15% لتوفير فائض إضافي يعادل 740 ر.س شهرياً.');
    recommendations.push('قم ببناء احتياطي مالي طوارئ بقيمة 5,000 ر.س على الأقل في محفظتك الادخارية.');
    recommendations.push('ابحث عن إمكانية تعديل قسط الالتزام الجديد ليكون 900 ر.س بدلاً من 1,200 ر.س (تأجيل الالتزام لشهرين).');
  } else {
    recommendations.push('أجل التقديم على هذا التمويل أو التقسيط حالياً لتفادي التعثر المالي.');
    recommendations.push('ركز فترتك القادمة على زيادة الفائض المالي عبر ضغط المصاريف التشغيلية واليومية.');
    recommendations.push('سدد الأرصدة المستحقة على البطاقات الائتمانية لخفض نسبة الالتزام الإجمالي.');
    recommendations.push('قم ببناء سجل تدفق نقدي مستقر لمدة 90 يوماً إضافية لإعادة تقييم ملاءتك.');
  }

  return {
    name: 'فهد',
    role: 'مصمم مستقل',
    avgMonthlyIncome12m: Math.round(avgIncome),
    monthlyObligations: Math.round(avgObligations),
    avgMonthlyExpenses: Math.round(avgExpenses),
    proposedInstallment: proposedInstallment,
    incomeVolatilityScore,
    cashflowStabilityScore,
    qadahaScore,
    prediction,
    riskLevel,
    reasons,
    recommendations
  };
}

// Generate some sample transactions for the sandbox dashboard
export function getMockTransactions(): Transaction[] {
  return [
    { id: '1', date: '2026-07-10', amount: 12500, type: 'INCOME', category: 'دخل مشروع مستقل', description: 'دفعة مشروع تصميم هوية بصرية - شركة حلول' },
    { id: '2', date: '2026-07-05', amount: 3200, type: 'OBLIGATION', category: 'تمويل سيارة تأجيري', description: 'قسط تمويل السيارات الشهري - مصرف الإنماء' },
    { id: '3', date: '2026-07-03', amount: 1200, type: 'EXPENSE', category: 'سكن وفواتير', description: 'فاتورة الكهرباء والماء والاتصالات المشتركة' },
    { id: '4', date: '2026-06-28', amount: 950, type: 'EXPENSE', category: 'مطاعم وترفيه', description: 'مصاريف معيشية ومشتريات قهوة ومطاعم' },
    { id: '5', date: '2026-06-25', amount: 14000, type: 'INCOME', category: 'دخل مشروع مستقل', description: 'الدفعة النهائية لتطوير تطبيق متجر إلكتروني' },
    { id: '6', date: '2026-06-15', amount: 1500, type: 'EXPENSE', category: 'أدوات برمجية واشتراكات', description: 'اشتراك Adobe Creative Cloud وFigma السنوي' },
    { id: '7', date: '2026-06-05', amount: 3200, type: 'OBLIGATION', category: 'تمويل سيارة تأجيري', description: 'قسط تمويل السيارات الشهري - مصرف الإنماء' },
    { id: '8', date: '2026-05-28', amount: 11000, type: 'INCOME', category: 'دخل مشروع مستقل', description: 'عقد استشاري شهري - وكالة إبداع' },
    { id: '9', date: '2026-05-12', amount: 800, type: 'EXPENSE', category: 'مواصلات وبنزين', description: 'تعبئة وقود وبطاقة شحن مواصلات' }
  ];
}
