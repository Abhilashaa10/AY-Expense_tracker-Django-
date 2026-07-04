import api from './api';
import { Expense } from '../types';

export interface ExpenseFilters {
  category?: string;
  date?: string;
}

export interface ExpenseData {
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

const expenseService = {
  async getAll(filters?: ExpenseFilters): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'All') {
      params.append('category', filters.category);
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
    const response = await api.post('/expenses/', data);
    return response.data;
  },

  async update(id: number, data: ExpenseData): Promise<Expense> {
    const response = await api.put(`/expenses/${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/expenses/${id}/`);
  },
};

export default expenseService;