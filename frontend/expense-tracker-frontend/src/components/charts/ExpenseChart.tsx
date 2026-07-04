import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ExpenseChartProps {
  data: { date: string; income: number; expense: number }[];
  height?: number;
}

const ExpenseChart = ({ data, height = 300 }: ExpenseChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
          dx={-10}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }}
          formatter={(value: number) => [`$${value}`, '']}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#10B981"
          strokeWidth={2}
          fill="url(#incomeGradient)"
          name="Income"
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="#3B82F6"
          strokeWidth={2}
          fill="url(#expenseGradient)"
          name="Expense"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;
