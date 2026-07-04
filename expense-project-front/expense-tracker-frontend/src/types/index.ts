export interface User {
  id: number;
  username: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  color: string;
  icon: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  totalExpense: number;
  totalBalance: number;
  totalIncome: number;
  monthlySavings: number;
}