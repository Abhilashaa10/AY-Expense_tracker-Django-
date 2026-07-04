import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Plus, Trash2, Edit2, Calendar as CalendarIcon, X } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import ExpenseCard from '../components/cards/ExpenseCard';
import Modal, { ConfirmModal } from '../components/common/Modal';
import expenseService from '../services/expenseService';
import { categories } from '../services/categoryService';
import { Expense } from '../types';
import { formatINR } from '../utils/format';

const ExpenseListPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Implemented Client Filters States
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.name, label: c.name })),
  ];

  const sortOptions = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'amount', label: 'Sort by Amount' },
  ];

  // Run data fetcher hook strictly watching properties supported by Django backend
  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter, filterDate]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await expenseService.getAll({
        category: categoryFilter,
        date: filterDate,
      });
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedExpense) return;
    setIsDeleting(true);
    try {
      await expenseService.delete(selectedExpense.id);
      setExpenses((prev) => prev.filter((e) => e.id !== selectedExpense.id));
      setShowDeleteModal(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Process sorting computations on client side instantly
  const displayedExpenses = expenses
    .filter((e) =>
      searchQuery === '' ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'amount') {
        return sortOrder === 'asc'
          ? Number(a.amount) - Number(b.amount)
          : Number(b.amount) - Number(a.amount);
      }
      return sortOrder === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Dynamically calculate aggregate cost based on current client filtering matrix
  const totalAmount = displayedExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">
            {displayedExpenses.length} transactions found
            {displayedExpenses.length > 0 && (
              <span className="ml-2 text-gray-500 font-medium">
                (Total: {formatINR(totalAmount)})
              </span>
            )}
          </p>
        </div>
        <Link to="/add-expense">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Expense</Button>
        </Link>
      </div>

      {/* Filters Area Grid */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-40"
            />
            
            {/* Integrated Custom Date Input Controls Elements */}
            <div className="flex items-center gap-2 relative">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 h-[42px] bg-white transition-all hover:border-gray-300"
              />
              {filterDate && (
                <button
                  type="button"
                  onClick={() => setFilterDate('')}
                  className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 h-[42px] flex items-center justify-center transition-colors"
                  title="Clear Date"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="w-40"
            />
            <Button
              variant="outline"
              onClick={toggleSort}
              leftIcon={<ArrowUpDown className="w-4 h-4" />}
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </div>
      </div>

      {/* View Toggle Layout Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'cards' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Primary Dynamic Ledger View Mapping Area */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : displayedExpenses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || categoryFilter !== 'All' || filterDate
              ? 'Try adjusting your filters or clearing search keys'
              : 'Start by adding your first expense'}
          </p>
          <Link to="/add-expense">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add Your First Expense</Button>
          </Link>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="space-y-3">
          {displayedExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={(expense) => navigate(`/edit-expense/${expense.id}`)}
              onDelete={() => {
                setSelectedExpense(expense);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedExpenses.map((expense) => {
                  const category = categories.find((c) => c.name === expense.category);
                  return (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{expense.title}</div>
                        {expense.notes && (
                          <div className="text-sm text-gray-500">{expense.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: category?.color + '20' || '#6B728020',
                            color: category?.color || '#6B7280',
                          }}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          expense.type === 'income' ? 'text-emerald-600' : 'text-gray-900'
                        }`}
                      >
                        {formatINR(expense.amount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/edit-expense/${expense.id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExpense(expense);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Layer */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete "${selectedExpense?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ExpenseListPage;