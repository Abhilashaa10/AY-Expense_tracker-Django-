import { Category } from '../types';

const categories: Category[] = [
  { id: '1', name: 'Food', color: '#3B82F6', icon: 'UtensilsCrossed' },
  { id: '2', name: 'Transportation', color: '#10B981', icon: 'Car' },
  { id: '3', name: 'Entertainment', color: '#8B5CF6', icon: 'Film' },
  { id: '4', name: 'Utilities', color: '#F59E0B', icon: 'Zap' },
  { id: '5', name: 'Health', color: '#EF4444', icon: 'Heart' },
  { id: '6', name: 'Shopping', color: '#EC4899', icon: 'ShoppingBag' },
  { id: '7', name: 'Income', color: '#10B981', icon: 'Wallet' },
  { id: '8', name: 'Other', color: '#6B7280', icon: 'MoreHorizontal' },
];

const categoryService = {
  async getAll(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(categories), 100);
    });
  },

  async getById(id: string): Promise<Category | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(categories.find((c) => c.id === id)), 100);
    });
  },
};

export default categoryService;
export { categories };
