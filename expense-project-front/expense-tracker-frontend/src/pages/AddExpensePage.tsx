// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, DollarSign, Tag, FileText, ArrowLeft, Save } from 'lucide-react';
// import Input from '../components/common/Input';
// import Select from '../components/common/Select';
// import Button from '../components/common/Button';
// import expenseService from '../services/expenseService';
// import categoryService, { categories } from '../services/categoryService';

// const AddExpensePage = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     amount: '',
//     category: '',
//     date: new Date().toISOString().split('T')[0],
//     notes: '',
//     type: 'expense' as 'income' | 'expense',
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const categoryOptions = categories.map((c) => ({ value: c.name, label: c.name }));

//   const typeOptions = [
//     { value: 'expense', label: 'Expense' },
//     { value: 'income', label: 'Income' },
//   ];

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validate = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.title.trim()) newErrors.title = 'Title is required';
//     if (!formData.amount) newErrors.amount = 'Amount is required';
//     else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0)
//       newErrors.amount = 'Enter a valid amount';
//     if (!formData.category) newErrors.category = 'Category is required';
//     if (!formData.date) newErrors.date = 'Date is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setIsLoading(true);
//     try {
//       await expenseService.create({
//         title: formData.title,
//         amount: Number(formData.amount),
//         category: formData.category,
//         date: formData.date,
//         notes: formData.notes,
//         type: formData.type,
//       });
//       navigate('/expenses');
//     } catch (error) {
//       console.error('Failed to add expense:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="mb-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back
//         </button>
//         <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
//         <p className="text-gray-600 mt-1">Record a new income or expense transaction.</p>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//         {/* Type Toggle */}
//         <div className="flex space-x-4 mb-6">
//           {typeOptions.map((option) => (
//             <button
//               key={option.value}
//               type="button"
//               onClick={() => setFormData((prev) => ({ ...prev, type: option.value as 'income' | 'expense' }))}
//               className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
//                 formData.type === option.value
//                   ? option.value === 'income'
//                     ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500'
//                     : 'bg-red-50 text-red-600 border-2 border-red-500'
//                   : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
//               }`}
//             >
//               {option.value === 'income' ? (
//                 <span className="flex items-center justify-center">
//                   <DollarSign className="w-4 h-4 mr-2" />
//                   {option.label}
//                 </span>
//               ) : (
//                 <span className="flex items-center justify-center">
//                   <Tag className="w-4 h-4 mr-2" />
//                   {option.label}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-2">
//             <Input
//               label="Title"
//               name="title"
//               placeholder="Enter transaction title"
//               value={formData.title}
//               onChange={handleChange}
//               error={errors.title}
//             />
//           </div>

//           <Input
//             label="Amount"
//             name="amount"
//             type="number"
//             step="0.01"
//             placeholder="0.00"
//             value={formData.amount}
//             onChange={handleChange}
//             error={errors.amount}
//             leftIcon={<DollarSign className="w-5 h-5" />}
//           />

//           <Select
//             label="Category"
//             name="category"
//             options={categoryOptions}
//             placeholder="Select a category"
//             value={formData.category}
//             onChange={handleChange}
//             error={errors.category}
//           />

//           <Input
//             label="Date"
//             name="date"
//             type="date"
//             value={formData.date}
//             onChange={handleChange}
//             error={errors.date}
//             leftIcon={<Calendar className="w-5 h-5" />}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (Optional)</label>
//           <textarea
//             name="notes"
//             rows={3}
//             placeholder="Add any additional notes..."
//             value={formData.notes}
//             onChange={handleChange}
//             className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 resize-none"
//           />
//         </div>

//         <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
//           <Button type="button" variant="outline" onClick={() => navigate(-1)}>
//             Cancel
//           </Button>
//           <Button type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
//             Save Transaction
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddExpensePage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Tag, FileText, ArrowLeft, Save, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import expenseService from '../services/expenseService';
import categoryService, { categories } from '../services/categoryService';

const AddExpensePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    type: 'expense' as 'income' | 'expense',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

const categoryOptions = categories.map((c) => ({ value: c.name, label: c.label }));
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
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
      await expenseService.create({
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        note: formData.note,
        // type: formData.type,
      });
      navigate('/expenses');
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isExpense = formData.type === 'expense';

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header View */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add Transaction</h1>
          <p className="text-sm text-gray-500">Keep your financial records accurate and updated.</p>
        </div>
      </div>

      {/* Main Interactive Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Modern Segmented Controller for Income/Expense */}
        <div className="p-1 bg-gray-50/70 border-b border-gray-100 flex rounded-t-2xl">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type: 'expense' }))}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all Rs.{
              isExpense
                ? 'bg-white text-rose-600 shadow-sm border border-gray-100/50'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ArrowUpRight className={`w-4 h-4 Rs.{isExpense ? 'text-rose-500' : 'text-gray-400'}`} />
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type: 'income' }))}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all Rs.{
              !isExpense
                ? 'bg-white text-emerald-600 shadow-sm border border-gray-100/50'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ArrowDownLeft className={`w-4 h-4 Rs.{!isExpense ? 'text-emerald-500' : 'text-gray-400'}`} />
            Income
          </button>
        </div>

        {/* Input Form Structure */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="space-y-5">
            <div>
              <Input
                label="Transaction Title"
                name="title"
                placeholder="e.g., Grocery Shopping, Salary Paycheck"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative">
                <Input
                  label="Amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  error={errors.amount}
                  leftIcon={
                    <DollarSign className={`w-4 h-4 Rs.{!isExpense ? 'text-emerald-500' : 'text-gray-400'}`} />
                  }
                />
              </div>

              <div>
                <Select
                  label="Category"
                  name="category"
                  options={categoryOptions}
                  placeholder="Choose category"
                  value={formData.category}
                  onChange={handleChange}
                  error={errors.category}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  error={errors.date}
                  leftIcon={<Calendar className="w-4 h-4 text-gray-400" />}
                />
              </div>
              
              <div className="opacity-40 hidden sm:block pointer-events-none select-none">
                {/* Visual alignment balancing spacer */}
                <span className="text-xs block font-medium mb-1.5 invisible">Spacer</span>
                <div className="h-[42px] border border-dashed border-gray-200 rounded-xl bg-gray-50/50" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Note <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Add vendor tags, payment methods, or extra descriptions..."
                  value={formData.note}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl transition-all resize-none focus:outline-none focus:ring-2 focus:border-transparent Rs.{
                    !isExpense 
                      ? 'focus:ring-emerald-500/20 focus:border-emerald-500' 
                      : 'focus:ring-indigo-500/20 focus:border-indigo-500'
                  } hover:border-gray-300`}
                />
              </div>
            </div>
          </div>

          {/* Explicit Bottom Form Controls */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading} 
              leftIcon={<Save className="w-4 h-4" />}
              className={`font-medium shadow-sm shadow-indigo-100 transition-colors Rs.{
                !isExpense 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-emerald-50' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              Save Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpensePage;