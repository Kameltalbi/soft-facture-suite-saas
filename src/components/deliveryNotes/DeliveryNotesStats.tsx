
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

interface DeliveryNotesStatsProps {
  totalNotes: number;
  pendingNotes: number;
  sentNotes: number;
  deliveredNotes: number;
}

export function DeliveryNotesStats({ totalNotes, pendingNotes, sentNotes, deliveredNotes }: DeliveryNotesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total</p>
              <p className="text-2xl font-bold text-neutral-900">{totalNotes}</p>
            </div>
            <Package className="h-8 w-8 text-[#6A9C89]" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">En attente</p>
              <p className="text-2xl font-bold text-orange-600">{pendingNotes}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Envoyés</p>
              <p className="text-2xl font-bold text-blue-600">{sentNotes}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Livrés</p>
              <p className="text-2xl font-bold text-green-600">{deliveredNotes}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
