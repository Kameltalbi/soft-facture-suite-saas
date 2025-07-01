
import { Card, CardContent } from '@/components/ui/card';

interface Document {
  id: string;
  type: 'invoice' | 'quote' | 'delivery' | 'credit';
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

interface SalesStatsProps {
  documents: Document[];
  selectedMonth: number;
  months: Array<{ value: number; label: string }>;
}

export function SalesStats({ documents, selectedMonth, months }: SalesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Factures ce mois</p>
              <p className="text-2xl font-bold text-neutral-900">{documents.filter(d => d.type === 'invoice').length}</p>
            </div>
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Devis en attente</p>
              <p className="text-2xl font-bold text-neutral-900">{documents.filter(d => d.type === 'quote').length}</p>
            </div>
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">CA filtré</p>
              <p className="text-2xl font-bold text-neutral-900">
                {documents.reduce((sum, doc) => sum + (doc.amount > 0 ? doc.amount : 0), 0).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
            </div>
            <div className="w-3 h-3 bg-success rounded-full"></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Avoirs émis</p>
              <p className="text-2xl font-bold text-neutral-900">{documents.filter(d => d.type === 'credit').length}</p>
            </div>
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
