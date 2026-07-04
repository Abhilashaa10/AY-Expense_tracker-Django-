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
import { Expense, DashboardStats } from '../types';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, expensesData] = await Promise.all([
          expenseService.getStats(),
          expenseService.getAll({ sortBy: 'date', sortOrder: 'desc' }),
        ]);
        setStats(statsData as DashboardStats);
        setRecentExpenses(expensesData.slice(0, 5));
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
            This Month
          </Button>
          <Link to="/add-expense">
            <Button leftIcon={<TrendingUp className="w-4 h-4" />}>Add Expense</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard
          title="Total Balance"
          value={`₹${(stats?.totalBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={Wallet}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatisticCard
          title="Total Income"
          value={`₹${(stats?.totalIncome || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatisticCard
          title="Total Expense"
          value={`₹${(stats?.totalExpense || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          trend={{ value: 3.1, isPositive: false }}
        />
        <StatisticCard
          title="Monthly Savings"
          value={`₹${(stats?.monthlySavings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={PiggyBank}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          trend={{ value: 15.3, isPositive: true }}
        />
      </div>

      {/* Recent Transactions List */}
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