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
import { Calendar, Tag, FileText, ArrowLeft, Save } from 'lucide-react';
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
    notes: '',
    type: 'expense' as 'income' | 'expense',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = categories.map((c) => ({ value: c.name, label: c.name }));

  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
  ];

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
        notes: formData.notes,
        type: formData.type,
      });
      navigate('/expenses');
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
        <p className="text-gray-600 mt-1">Record a new income or expense transaction.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Type Toggle */}
        <div className="flex space-x-4 mb-6">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, type: option.value as 'income' | 'expense' }))}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                formData.type === option.value
                  ? option.value === 'income'
                    ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500'
                    : 'bg-red-50 text-red-600 border-2 border-red-500'
                  : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center justify-center">
                <Tag className="w-4 h-4 mr-2" />
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Title"
              name="title"
              placeholder="Enter transaction title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
            />
          </div>

          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            leftIcon={<Tag className="w-5 h-5" />}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (Optional)</label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Add any additional notes..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 resize-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
            Save Transaction
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExpensePage;