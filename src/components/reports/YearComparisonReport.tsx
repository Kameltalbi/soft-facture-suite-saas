
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useCurrency } from '@/contexts/CurrencyContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface YearComparisonReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function YearComparisonReport({ period }: YearComparisonReportProps) {
  const { currency } = useCurrency();
  const currentYear = new Date().getFullYear();
  
  // Données mockées - à remplacer par les vraies données
  const comparisonData = [
    { month: 'Jan', currentYear: 10200, previousYear: 8500, growth: 20.0 },
    { month: 'Fév', currentYear: 8640, previousYear: 9200, growth: -6.1 },
    { month: 'Mar', currentYear: 11760, previousYear: 9800, growth: 20.0 },
    { month: 'Avr', currentYear: 15000, previousYear: 12000, growth: 25.0 },
    { month: 'Mai', currentYear: 13440, previousYear: 11500, growth: 16.9 },
    { month: 'Juin', currentYear: 16560, previousYear: 14200, growth: 16.6 }
  ];

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: currency.decimal_places, 
      maximumFractionDigits: currency.decimal_places 
    })} ${currency.symbol}`;
  };

  const totalCurrentYear = comparisonData.reduce((sum, data) => sum + data.currentYear, 0);
  const totalPreviousYear = comparisonData.reduce((sum, data) => sum + data.previousYear, 0);
  const overallGrowth = ((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {overallGrowth > 0 ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
          <span className={`font-medium ${overallGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {overallGrowth > 0 ? '+' : ''}{overallGrowth.toFixed(1)}% vs {currentYear - 1}
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === 'currentYear' ? currentYear.toString() : (currentYear - 1).toString()
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="currentYear" 
              stroke="#6A9C89"
              strokeWidth={3}
              name={currentYear.toString()}
              dot={{ fill: '#6A9C89', strokeWidth: 2, r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="previousYear" 
              stroke="#64B5F6"
              strokeWidth={3}
              name={(currentYear - 1).toString()}
              dot={{ fill: '#64B5F6', strokeWidth: 2, r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total {currentYear}: </span>
          <span className="font-medium">{formatCurrency(totalCurrentYear)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Total {currentYear - 1}: </span>
          <span className="font-medium">{formatCurrency(totalPreviousYear)}</span>
        </div>
      </div>
    </div>
  );
}
