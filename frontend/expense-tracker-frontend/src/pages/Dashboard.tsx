// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Wallet,
//   TrendingUp,
//   TrendingDown,
//   PiggyBank,
//   ArrowUpRight,
//   Calendar,
// } from 'lucide-react';
// import StatisticCard from '../components/cards/StatisticCard';
// import ExpenseCard from '../components/cards/ExpenseCard';
// import Button from '../components/common/Button';
// import expenseService from '../services/expenseService';
// import { Expense, DashboardStats } from '../types';
// import { formatINR } from '../utils/format';

// const Dashboard = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [statsData, expensesData] = await Promise.all([
//           expenseService.getStats(),
//           expenseService.getAll({ sortBy: 'date', sortOrder: 'desc' }),
//         ]);
//         setStats(statsData as DashboardStats);
//         setRecentExpenses(expensesData.slice(0, 5));
//       } catch (error) {
//         console.error('Failed to fetch dashboard data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

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
//           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-600 mt-1">
//             Welcome back! Here's your financial overview.
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
//             This Month
//           </Button>
//           <Link to="/add-expense">
//             <Button leftIcon={<TrendingUp className="w-4 h-4" />}>Add Expense</Button>
//           </Link>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatisticCard
//   title="Total Balance"
//   value={formatINR(stats?.totalBalance || 0)}
//   icon={Wallet}
//   iconColor="text-blue-600"
//   iconBgColor="bg-blue-50"
//   trend={{ value: 12.5, isPositive: true }}
// />
//         <StatisticCard
//   title="Total Income"
//   value={formatINR(stats?.totalBalance || 0)}
//   icon={Wallet}
//   iconColor="text-blue-600"
//   iconBgColor="bg-blue-50"
//   trend={{ value: 12.5, isPositive: true }}
// />
//         <StatisticCard
//   title="Total Expense"
//   value={formatINR(stats?.totalBalance || 0)}
//   icon={Wallet}
//   iconColor="text-blue-600"
//   iconBgColor="bg-blue-50"
//   trend={{ value: 12.5, isPositive: true }}
// />
//         <StatisticCard
//   title="Monthly saving"
//   value={formatINR(stats?.totalBalance || 0)}
//   icon={Wallet}
//   iconColor="text-blue-600"
//   iconBgColor="bg-blue-50"
//   trend={{ value: 12.5, isPositive: true }}
// />
//       </div>

//       {/* Recent Transactions List */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
//             <p className="text-sm text-gray-500">Your latest financial activities</p>
//           </div>
//           <Link
//             to="/expenses"
//             className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
//           >
//             View All
//             <ArrowUpRight className="w-4 h-4 ml-1" />
//           </Link>
//         </div>

//         <div className="space-y-3">
//           {recentExpenses.length > 0 ? (
//             recentExpenses.map((expense) => (
//               <ExpenseCard key={expense.id} expense={expense} />
//             ))
//           ) : (
//             <p className="text-gray-500 text-center py-4">No recent transactions found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import StatisticCard from '../components/cards/StatisticCard';
import ExpenseCard from '../components/cards/ExpenseCard';
import Button from '../components/common/Button';
import expenseService from '../services/expenseService';
import { Expense } from '../types';
import { formatINR } from '../utils/format';

const Dashboard = () => {
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [calculatedStats, setCalculatedStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
    monthlySaving: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expensesData = await expenseService.getAll();
        
        const totalIncome = expensesData
          .filter((e) => e.type === 'income')
          .reduce((sum, e) => sum + Number(e.amount), 0);

        const totalExpense = expensesData
          .filter((e) => e.type === 'expense')
          .reduce((sum, e) => sum + Number(e.amount), 0);

        const totalBalance = totalIncome - totalExpense;
        const monthlySaving = totalIncome > totalExpense ? totalIncome - totalExpense : 0;

        setCalculatedStats({
          totalIncome,
          totalExpense,
          totalBalance,
          monthlySaving
        });

        const sortedExpenses = [...expensesData].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentExpenses(sortedExpenses.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
            All Time
          </Button>
          <Link to="/add-expense">
            <Button leftIcon={<TrendingUp className="w-4 h-4" />}>Add Expense</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard
          title="Total Balance"
          value={formatINR(calculatedStats.totalBalance)}
          icon={Wallet}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          trend={{ value: 12.5, isPositive: calculatedStats.totalBalance >= 0 }}
        />
        <StatisticCard
          title="Total Income"
          value={formatINR(calculatedStats.totalIncome)}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatisticCard
          title="Total Expense"
          value={formatINR(calculatedStats.totalExpense)}
          icon={TrendingDown}
          iconColor="text-rose-600"
          iconBgColor="bg-rose-50"
          trend={{ value: 12.5, isPositive: false }}
        />
        <StatisticCard
          title="Monthly saving"
          value={formatINR(calculatedStats.monthlySaving)}
          icon={PiggyBank}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          trend={{ value: 12.5, isPositive: true }}
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-500">Your latest financial activities</p>
          </div>
          <Link
            to="/expenses"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            View All
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;