import { Expense } from '../../types';
import { Edit2, Trash2, TrendingDown } from 'lucide-react';
import { categories } from '../../services/categoryService';

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  const category = categories.find((c) => c.name === expense.category);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: (category?.color ?? '#6B7280') + '15' }}
          >
            <TrendingDown className="w-6 h-6" style={{ color: category?.color ?? '#6B7280' }} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{expense.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: (category?.color ?? '#6B7280') + '20',
                  color: category?.color ?? '#6B7280',
                }}
              >
                {category?.label ?? expense.category}
              </span>
              <span>{new Date(expense.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold text-gray-900">
            ${Number(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit?.(expense)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete?.(expense)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {expense.note && (
        <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          {expense.note}
        </p>
      )}
    </div>
  );
};

export default ExpenseCard;