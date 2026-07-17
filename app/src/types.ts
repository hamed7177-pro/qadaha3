export type ScreenId =
  | 'landing'
  | 'consent'
  | 'connect'
  | 'dashboard'
  | 'test_obligation'
  | 'result'
  | 'certificate'
  | 'recommendations'
  | 'privacy'
  | 'funder';

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  isConnected: boolean;
  lastUpdated: string;
  allowedScopes: string[];
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'OBLIGATION';
  category: string;
  description: string;
}

export interface UserFinancials {
  name: string;
  role: string;
  avgMonthlyIncome12m: number;
  monthlyObligations: number;
  avgMonthlyExpenses: number;
  proposedInstallment: number;
  incomeVolatilityScore: number; // 0 to 100
  cashflowStabilityScore: number; // 0 to 100
  qadahaScore: number; // 0 to 100
  prediction: 'Suitable' | 'Caution' | 'NotSuitable';
  riskLevel: 'Low' | 'Medium' | 'High';
  reasons: string[];
  recommendations: string[];
  monthlyIncomeHistory?: number[];
  monthlyExpensesHistory?: number[];
  monthlyObligationsHistory?: number[];
  currentQadahaScore?: number;
  currentPrediction?: 'Suitable' | 'Caution' | 'NotSuitable';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Certificate {
  verificationId: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'used' | 'expired';
  acceptedBy?: string;
  acceptedDate?: string;
}
