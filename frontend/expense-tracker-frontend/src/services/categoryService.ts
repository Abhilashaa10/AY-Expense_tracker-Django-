import { Category } from '../types';

const categories: Category[] = [
  { id: '1', name: 'food', label: 'Food', color: '#3B82F6', icon: 'UtensilsCrossed' },
  { id: '2', name: 'transport', label: 'Transport', color: '#10B981', icon: 'Car' },
  { id: '3', name: 'rent', label: 'Rent', color: '#F59E0B', icon: 'Home' },
  { id: '4', name: 'utilities', label: 'Utilities', color: '#8B5CF6', icon: 'Zap' },
  { id: '5', name: 'entertainment', label: 'Entertainment', color: '#EC4899', icon: 'Film' },
  { id: '6', name: 'other', label: 'Other', color: '#6B7280', icon: 'MoreHorizontal' },
];

const categoryService = {
  async getAll(): Promise<Category[]> {
    return categories;
  },
};

export default categoryService;
export { categories };