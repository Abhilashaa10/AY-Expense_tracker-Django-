import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, DollarSign, Tag, ArrowLeft, Save } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import expenseService from '../services/expenseService';
import { categories } from '../services/categoryService';

const AddExpensePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = categories.map((c) => ({ value: c.name, label: c.label }));

  // If editing, load the existing expense into the form
  useEffect(() => {
    if (!isEditing) return;
    const loadExpense = async () => {
      try {
        const expense = await expenseService.getById(Number(id));
        setFormData({
          title: expense.title,
          amount: String(expense.amount),
          category: expense.category,
          date: expense.date,
          note: expense.note || '',
        });
      } catch (error) {
        console.error('Failed to load expense:', error);
        navigate('/expenses');
      } finally {
        setIsFetching(false);
      }
    };
    loadExpense();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0)
      newErrors.amount = 'Enter a valid amount';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        note: formData.note,
      };

      if (isEditing) {
        await expenseService.update(Number(id), payload);
      } else {
        await expenseService.create(payload);
      }
      navigate('/expenses');
    } catch (error) {
      console.error('Failed to save expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update the details of your expense.' : 'Record a new expense.'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Title"
              name="title"
              placeholder="Enter expense title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
            />
          </div>

          <Input
            label="Amount (₹)"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            leftIcon={<DollarSign className="w-5 h-5" />}
          />

          <Select
            label="Category"
            name="category"
            options={categoryOptions}
            placeholder="Select a category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
          />

          <div className="md:col-span-2">
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Note <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            name="note"
            rows={3}
            placeholder="Add any additional notes..."
            value={formData.note}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 resize-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
            {isEditing ? 'Update Expense' : 'Save Expense'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExpensePage;