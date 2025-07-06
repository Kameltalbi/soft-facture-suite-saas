import { Card, CardContent } from '@/components/ui/card';
import { InvoiceStatus } from '@/types/invoice';

interface InvoicesStatsProps {
  invoices: any[];
}

export function InvoicesStats({ invoices }: InvoicesStatsProps) {
  const getStatusCount = (status: InvoiceStatus) => 
    invoices.filter(i => i.status === status).length;

  const stats = [
    {
      title: 'Total factures',
      count: invoices.length,
      color: 'bg-primary'
    },
    {
      title: 'Validées',
      count: getStatusCount('validated'),
      color: 'bg-green-500'
    },
    {
      title: 'Payées',
      count: getStatusCount('paid'),
      color: 'bg-success'
    },
    {
      title: 'Payées P.',
      count: getStatusCount('partially_paid'),
      color: 'bg-orange-500'
    },
    {
      title: 'Envoyées',
      count: getStatusCount('sent'),
      color: 'bg-secondary'
    },
    {
      title: 'En retard',
      count: getStatusCount('overdue'),
      color: 'bg-destructive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">{stat.title}</p>
                <p className="text-2xl font-bold text-neutral-900">{stat.count}</p>
              </div>
              <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}