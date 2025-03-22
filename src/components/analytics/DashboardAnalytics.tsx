
import { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DashboardAnalyticsProps {
  transactions: Transaction[];
}

const COLORS = ['#8B5CF6', '#0EA5E9', '#F97316', '#10B981', '#EF4444'];
const STATUS_COLORS = {
  completed: '#10B981',
  pending: '#F97316',
  cancelled: '#EF4444',
};

const DashboardAnalytics = ({ transactions }: DashboardAnalyticsProps) => {
  const isMobile = useIsMobile();
  
  // Transaction by date (last 30 days)
  const transactionTrends = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dateMap: Record<string, { count: number, value: number }> = {};
    
    // Initialize all dates in the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dateMap[dateString] = { count: 0, value: 0 };
    }
    
    // Fill with actual data
    transactions.forEach(transaction => {
      const transactionDate = transaction.date ? new Date(transaction.date) : null;
      if (transactionDate && transactionDate >= thirtyDaysAgo) {
        const dateString = transactionDate.toISOString().split('T')[0];
        if (dateMap[dateString]) {
          dateMap[dateString].count += 1;
          dateMap[dateString].value += transaction.totalAmount || 0;
        }
      }
    });
    
    // Convert to array for charts
    return Object.entries(dateMap)
      .map(([date, data]) => ({
        date,
        count: data.count,
        value: data.value,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7); // Show only last 7 days for clarity
  }, [transactions]);
  
  // Status distribution
  const statusDistribution = useMemo(() => {
    const statusMap: Record<string, number> = {
      completed: 0,
      pending: 0,
      cancelled: 0,
    };
    
    transactions.forEach(transaction => {
      const status = transaction.status || 'pending';
      statusMap[status] = (statusMap[status] || 0) + 1;
    });
    
    return Object.entries(statusMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);
  
  // Financial summary
  const financialSummary = useMemo(() => {
    const summary = {
      totalTransactions: transactions.length,
      totalValue: 0,
      avgTransactionValue: 0,
      pendingAmount: 0,
      completedAmount: 0,
    };
    
    transactions.forEach(transaction => {
      const amount = transaction.totalAmount || 0;
      summary.totalValue += amount;
      
      if (transaction.status === 'pending') {
        summary.pendingAmount += amount;
      } else if (transaction.status === 'completed') {
        summary.completedAmount += amount;
      }
    });
    
    summary.avgTransactionValue = transactions.length 
      ? summary.totalValue / transactions.length 
      : 0;
    
    return summary;
  }, [transactions]);
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Financial Summary Cards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{financialSummary.totalTransactions}</div>
          <div className="text-xs text-muted-foreground">
            Value: {formatCurrency(financialSummary.totalValue)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(financialSummary.avgTransactionValue)}
          </div>
          <div className="text-xs text-muted-foreground">
            Per transaction
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(financialSummary.pendingAmount)}</div>
          <div className="text-xs text-muted-foreground">
            Completed: {formatCurrency(financialSummary.completedAmount)}
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction Trends Chart */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-md font-medium">Transaction Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ChartContainer
              config={{
                count: {
                  theme: {
                    light: "#8B5CF6",
                    dark: "#A78BFA",
                  },
                  label: "Transactions",
                },
                value: {
                  theme: {
                    light: "#0EA5E9",
                    dark: "#38BDF8",
                  },
                  label: "Value",
                },
              }}
            >
              <LineChart
                data={transactionTrends}
                margin={{
                  top: 5,
                  right: 20,
                  left: isMobile ? 0 : 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    return new Date(date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    });
                  }}
                  fontSize={12}
                />
                <YAxis yAxisId="left" fontSize={12} width={isMobile ? 30 : 40} />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => formatCurrency(value).replace('₹', '')} 
                  fontSize={12}
                  width={isMobile ? 30 : 40}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="bg-white/95 dark:bg-gray-800/95"
                      formatter={(value, name) => {
                        if (name === 'value') {
                          return formatCurrency(Number(value));
                        }
                        return value;
                      }}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8B5CF6"
                  activeDot={{ r: 8 }}
                  yAxisId="left"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0EA5E9" 
                  yAxisId="right" 
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Status Distribution Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-md font-medium">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            {statusDistribution.length > 0 ? (
              <ChartContainer 
                config={{
                  completed: {
                    theme: {
                      light: STATUS_COLORS.completed,
                      dark: STATUS_COLORS.completed,
                    },
                    label: "Completed",
                  },
                  pending: {
                    theme: {
                      light: STATUS_COLORS.pending,
                      dark: STATUS_COLORS.pending,
                    },
                    label: "Pending",
                  },
                  cancelled: {
                    theme: {
                      light: STATUS_COLORS.cancelled,
                      dark: STATUS_COLORS.cancelled,
                    },
                    label: "Cancelled",
                  },
                }}
              >
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="bg-white/95 dark:bg-gray-800/95"
                      />
                    }
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="text-muted-foreground">No data available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAnalytics;
