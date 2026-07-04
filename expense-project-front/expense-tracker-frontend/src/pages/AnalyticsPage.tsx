// import { useState, useEffect } from 'react';
// import { TrendingUp, TrendingDown, Calendar, Target, AlertCircle } from 'lucide-react';
// import StatisticCard from '../components/cards/StatisticCard';
// import MonthlySpendingChart from '../components/charts/MonthlySpendingChart';
// import CategoryPieChart from '../components/charts/CategoryPieChart';
// import expenseService from '../services/expenseService';
// import { categories } from '../services/categoryService';

// interface AnalyticsData {
//   monthlySpending: { month: string; amount: number }[];
//   categorySpending: { name: string; value: number; color: string }[];
//   highestExpense: { title: string; amount: number; category: string };
//   avgMonthlySpending: number;
//   spendingTrend: number;
//   topCategories: { name: string; amount: number; percentage: number }[];
// }

// const AnalyticsPage = () => {
//   const [data, setData] = useState<AnalyticsData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState<'6months' | 'year'>('6months');

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const expenses = await expenseService.getAll();
//         const expenseItems = expenses.filter((e) => e.type === 'expense');

//         const monthlySpending = [
//           { month: 'Jan', amount: 3200 },
//           { month: 'Feb', amount: 2900 },
//           { month: 'Mar', amount: 3100 },
//           { month: 'Apr', amount: 3400 },
//           { month: 'May', amount: 3000 },
//           { month: 'Jun', amount: 3600 },
//         ];

//         const categoryTotals: Record<string, number> = {};
//         expenseItems.forEach((e) => {
//           categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
//         });

//         const categorySpending = Object.entries(categoryTotals).map(([name, value]) => {
//           const cat = categories.find((c) => c.name === name);
//           return {
//             name,
//             value,
//             color: cat?.color || '#6B7280',
//           };
//         });

//         const highestExpense = expenseItems.reduce(
//           (max, e) => (e.amount > max.amount ? e : max),
//           { title: '', amount: 0, category: '' }
//         );

//         const totalSpending = expenseItems.reduce((sum, e) => sum + e.amount, 0);
//         const avgMonthlySpending = totalSpending / 6;

//         const sortedCategories = Object.entries(categoryTotals)
//           .map(([name, amount]) => ({
//             name,
//             amount,
//             percentage: Math.round((amount / totalSpending) * 100),
//           }))
//           .sort((a, b) => b.amount - a.amount);

//         setData({
//           monthlySpending,
//           categorySpending,
//           highestExpense,
//           avgMonthlySpending,
//           spendingTrend: 12.5,
//           topCategories: sortedCategories.slice(0, 5),
//         });
//       } catch (error) {
//         console.error('Failed to fetch analytics:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [timeRange]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
//           <p className="text-gray-600 mt-1">
//             Insights into your spending patterns and financial trends.
//           </p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setTimeRange('6months')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//               timeRange === '6months'
//                 ? 'bg-blue-50 text-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             6 Months
//           </button>
//           <button
//             onClick={() => setTimeRange('year')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//               timeRange === 'year'
//                 ? 'bg-blue-50 text-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             1 Year
//           </button>
//         </div>
//       </div>

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatisticCard
//           title="Avg Monthly Spending"
//           value={`$${(data?.avgMonthlySpending || 0).toLocaleString('en-US', {
//             minimumFractionDigits: 2,
//           })}`}
//           icon={Calendar}
//           iconColor="text-blue-600"
//           iconBgColor="bg-blue-50"
//         />
//         <StatisticCard
//           title="Spending Trend"
//           value={`${data?.spendingTrend || 0}%`}
//           icon={(data?.spendingTrend || 0) > 0 ? TrendingUp : TrendingDown}
//           iconColor={(data?.spendingTrend || 0) > 0 ? 'text-red-600' : 'text-emerald-600'}
//           iconBgColor={(data?.spendingTrend || 0) > 0 ? 'bg-red-50' : 'bg-emerald-50'}
//           subtitle={data?.spendingTrend! > 0 ? 'Increasing' : 'Decreasing'}
//         />
//         <StatisticCard
//           title="Highest Expense"
//           value={`$${(data?.highestExpense.amount || 0).toLocaleString('en-US', {
//             minimumFractionDigits: 2,
//           })}`}
//           icon={AlertCircle}
//           iconColor="text-orange-600"
//           iconBgColor="bg-orange-50"
//           subtitle={data?.highestExpense.title}
//         />
//         <StatisticCard
//           title="Budget Goal"
//           value="75%"
//           icon={Target}
//           iconColor="text-purple-600"
//           iconBgColor="bg-purple-50"
//           subtitle="$3,000 / $4,000"
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Monthly Spending Trend */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Monthly Spending Trend</h2>
//             <p className="text-sm text-gray-500">Your spending patterns over time</p>
//           </div>
//           <MonthlySpendingChart data={data?.monthlySpending || []} height={280} />
//         </div>

//         {/* Category Distribution */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
//             <p className="text-sm text-gray-500">Where your money goes</p>
//           </div>
//           <CategoryPieChart data={data?.categorySpending || []} height={280} />
//         </div>
//       </div>

//       {/* Top Categories */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">Top Spending Categories</h2>
//           <p className="text-sm text-gray-500">Your biggest expense categories</p>
//         </div>
//         <div className="space-y-4">
//           {data?.topCategories.map((category, index) => {
//             const cat = categories.find((c) => c.name === category.name);
//             const maxAmount = data.topCategories[0]?.amount || 1;
//             return (
//               <div key={category.name}>
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center space-x-3">
//                     <span className="w-6 h-6 flex items-center justify-center text-sm font-medium text-gray-500">
//                       {index + 1}
//                     </span>
//                     <span className="font-medium text-gray-900">{category.name}</span>
//                   </div>
//                   <div className="text-right">
//                     <span className="font-semibold text-gray-900">
//                       ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                     </span>
//                     <span className="text-sm text-gray-500 ml-2">({category.percentage}%)</span>
//                   </div>
//                 </div>
//                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full rounded-full transition-all duration-500"
//                     style={{
//                       width: `${(category.amount / maxAmount) * 100}%`,
//                       backgroundColor: cat?.color || '#6B7280',
//                     }}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyticsPage;


import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, AlertCircle } from 'lucide-react';
import StatisticCard from '../components/cards/StatisticCard';
import MonthlySpendingChart from '../components/charts/MonthlySpendingChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import expenseService from '../services/expenseService';
import { categories } from '../services/categoryService';
import { formatINR } from '../utils/format';
import { Expense } from '../types';

interface AnalyticsData {
  monthlySpending: { month: string; amount: number }[];
  categorySpending: { name: string; value: number; color: string }[];
  highestExpense: { title: string; amount: number; category: string };
  avgMonthlySpending: number;
  spendingTrend: number;
  topCategories: { name: string; amount: number; percentage: number }[];
  totalExpenses: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const buildMonthlySpending = (expenses: Expense[], monthCount: number) => {
  const now = new Date();
  const result: { month: string; amount: number }[] = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = `${MONTHS[month]} ${year !== now.getFullYear() ? year : ''}`.trim();

    const total = expenses
      .filter((e) => {
        const ed = new Date(e.date);
        return ed.getFullYear() === year && ed.getMonth() === month;
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);

    result.push({ month: label, amount: total });
  }
  return result;
};

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'6months' | 'year'>('6months');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const expenses = await expenseService.getAll();
        const monthCount = timeRange === '6months' ? 6 : 12;

        // Monthly spending from real data
        const monthlySpending = buildMonthlySpending(expenses, monthCount);

        // Category breakdown from real data
        const categoryTotals: Record<string, number> = {};
        expenses.forEach((e) => {
          categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
        });

        const categorySpending = Object.entries(categoryTotals).map(([name, value]) => {
          const cat = categories.find((c) => c.name === name);
          return { name, value, color: cat?.color || '#6B7280' };
        });

        // Highest single expense
        const highestExpense = expenses.reduce(
          (max, e) => (Number(e.amount) > max.amount ? { title: e.title, amount: Number(e.amount), category: e.category } : max),
          { title: 'None', amount: 0, category: '' }
        );

        // Average monthly spending
        const totalSpending = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const avgMonthlySpending = monthCount > 0 ? totalSpending / monthCount : 0;

        // Spending trend: compare last month vs month before
        const now = new Date();
        const lastMonth = expenses
          .filter((e) => {
            const d = new Date(e.date);
            return d.getMonth() === (now.getMonth() - 1 + 12) % 12 && d.getFullYear() === now.getFullYear();
          })
          .reduce((sum, e) => sum + Number(e.amount), 0);

        const monthBefore = expenses
          .filter((e) => {
            const d = new Date(e.date);
            return d.getMonth() === (now.getMonth() - 2 + 12) % 12 && d.getFullYear() === now.getFullYear();
          })
          .reduce((sum, e) => sum + Number(e.amount), 0);

        const spendingTrend = monthBefore > 0
          ? Math.round(((lastMonth - monthBefore) / monthBefore) * 100)
          : 0;

        // Top categories
        const sortedCategories = Object.entries(categoryTotals)
          .map(([name, amount]) => ({
            name,
            amount,
            percentage: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0,
          }))
          .sort((a, b) => b.amount - a.amount);

        setData({
          monthlySpending,
          categorySpending,
          highestExpense,
          avgMonthlySpending,
          spendingTrend,
          topCategories: sortedCategories.slice(0, 5),
          totalExpenses: expenses.length,
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Insights into your spending — {data?.totalExpenses} expenses recorded.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTimeRange('6months')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '6months' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'year' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatisticCard
          title="Avg Monthly Spending"
          value={formatINR(data?.avgMonthlySpending || 0)}
          icon={Calendar}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatisticCard
          title="Spending Trend"
          value={`${Math.abs(data?.spendingTrend || 0)}%`}
          icon={(data?.spendingTrend || 0) > 0 ? TrendingUp : TrendingDown}
          iconColor={(data?.spendingTrend || 0) > 0 ? 'text-red-600' : 'text-emerald-600'}
          iconBgColor={(data?.spendingTrend || 0) > 0 ? 'bg-red-50' : 'bg-emerald-50'}
          subtitle={(data?.spendingTrend || 0) > 0 ? 'Up vs last month' : 'Down vs last month'}
        />
        <StatisticCard
          title="Highest Expense"
          value={formatINR(data?.highestExpense.amount || 0)}
          icon={AlertCircle}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
          subtitle={data?.highestExpense.title}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Spending Trend</h2>
            <p className="text-sm text-gray-500">Your actual spending over time</p>
          </div>
          <MonthlySpendingChart data={data?.monthlySpending || []} height={280} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
            <p className="text-sm text-gray-500">Where your money goes</p>
          </div>
          <CategoryPieChart data={data?.categorySpending || []} height={280} />
        </div>
      </div>

      {/* Top Categories */}
      {(data?.topCategories.length ?? 0) > 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Spending Categories</h2>
            <p className="text-sm text-gray-500">Your biggest expense categories</p>
          </div>
          <div className="space-y-4">
            {data?.topCategories.map((category, index) => {
              const cat = categories.find((c) => c.name === category.name);
              const maxAmount = data.topCategories[0]?.amount || 1;
              return (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 flex items-center justify-center text-sm font-medium text-gray-500">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 capitalize">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">
                        {formatINR(category.amount)}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">({category.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(category.amount / maxAmount) * 100}%`,
                        backgroundColor: cat?.color || '#6B7280',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">No expense data yet. Add some expenses to see analytics.</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;