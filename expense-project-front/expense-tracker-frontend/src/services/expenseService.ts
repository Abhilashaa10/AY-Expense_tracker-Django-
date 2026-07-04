import api from './api';
import { Expense } from '../types';

export interface ExpenseFilters {
  category?: string;
  date?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ExpenseData {
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export interface DashboardStats {
  totalExpense: number;
  totalBalance: number;
  totalIncome: number;
  monthlySavings: number;
}

const expenseService = {
  async getAll(filters?: ExpenseFilters): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'All') {
      params.append('category', filters.category.toLowerCase());
    }
    if (filters?.date) {
      params.append('date', filters.date);
    }
    const response = await api.get(`/expenses/?${params.toString()}`);
    return response.data;
  },

  async getById(id: number): Promise<Expense> {
    const response = await api.get(`/expenses/${id}/`);
    return response.data;
  },

  async create(data: ExpenseData): Promise<Expense> {
    const response = await api.post('/expenses/', {
      title: data.title,
      amount: data.amount,
      category: data.category.toLowerCase(),
      date: data.date,
      note: data.note || '',
    });
    return response.data;
  },

  async update(id: number, data: ExpenseData): Promise<Expense> {
    const response = await api.put(`/expenses/${id}/`, {
      title: data.title,
      amount: data.amount,
      category: data.category.toLowerCase(),
      date: data.date,
      note: data.note || '',
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/expenses/${id}/`);
  },

  // Calculated locally from real expense data — Django has no stats endpoint
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/expenses/');
    const expenses: Expense[] = response.data;
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return {
      totalExpense,
      totalBalance: 0,
      totalIncome: 0,
      monthlySavings: 0,
    };
  },
};

export default expenseService;