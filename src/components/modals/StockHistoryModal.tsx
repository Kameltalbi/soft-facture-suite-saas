
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { History, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StockMovement {
  id: string;
  type: 'entree' | 'sortie' | 'ajustement';
  quantite: number;
  date_mouvement: string;
  motif?: string;
  commentaire?: string;
  user_name?: string;
}

interface StockHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    nom: string;
    unite: string;
  } | null;
}

// Mock data pour les mouvements
const mockMovements: StockMovement[] = [
  {
    id: '1',
    type: 'entree',
    quantite: 10,
    date_mouvement: '2024-01-20T10:00:00Z',
    motif: 'Réception fournisseur',
    commentaire: 'Commande #CMD-2024-001',
    user_name: 'Jean Dupont'
  },
  {
    id: '2',
    type: 'sortie',
    quantite: 2,
    date_mouvement: '2024-01-22T14:30:00Z',
    motif: 'Livraison client',
    commentaire: 'Facture #FAC-2024-012',
    user_name: 'Marie Martin'
  },
  {
    id: '3',
    type: 'entree',
    quantite: 5,
    date_mouvement: '2024-01-25T09:15:00Z',
    motif: 'Retour client',
    commentaire: 'Produit non conforme',
    user_name: 'Pierre Durant'
  },
  {
    id: '4',
    type: 'sortie',
    quantite: 1,
    date_mouvement: '2024-01-26T16:45:00Z',
    motif: 'Casse/Perte',
    commentaire: 'Produit endommagé',
    user_name: 'Jean Dupont'
  }
];

export function StockHistoryModal({ isOpen, onClose, product }: StockHistoryModalProps) {
  if (!product) return null;

  const renderMovementIcon = (type: string) => {
    switch (type) {
      case 'entree':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'sortie':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'ajustement':
        return <Settings className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const renderMovementBadge = (type: string) => {
    switch (type) {
      case 'entree':
        return <Badge variant="outline" className="text-green-700 border-green-200">Entrée</Badge>;
      case 'sortie':
        return <Badge variant="outline" className="text-red-700 border-red-200">Sortie</Badge>;
      case 'ajustement':
        return <Badge variant="outline" className="text-blue-700 border-blue-200">Ajustement</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Historique des mouvements - {product.nom}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h3 className="font-medium text-neutral-900 mb-2">Résumé</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-neutral-500">Entrées totales:</span>
                <span className="ml-2 font-medium text-green-600">
                  +{mockMovements.filter(m => m.type === 'entree').reduce((sum, m) => sum + m.quantite, 0)} {product.unite}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Sorties totales:</span>
                <span className="ml-2 font-medium text-red-600">
                  -{mockMovements.filter(m => m.type === 'sortie').reduce((sum, m) => sum + m.quantite, 0)} {product.unite}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Mouvements:</span>
                <span className="ml-2 font-medium">{mockMovements.length}</span>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead>Utilisateur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-mono text-sm">
                    {formatDate(movement.date_mouvement)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderMovementIcon(movement.type)}
                      {renderMovementBadge(movement.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      movement.type === 'entree' ? 'text-green-600' : 
                      movement.type === 'sortie' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {movement.type === 'entree' ? '+' : movement.type === 'sortie' ? '-' : '±'}
                      {movement.quantite} {product.unite}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{movement.motif || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-neutral-600">
                      {movement.commentaire || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{movement.user_name || '-'}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {mockMovements.length === 0 && (
            <div className="text-center py-8">
              <History className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-sm font-medium text-neutral-900">Aucun mouvement</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Aucun mouvement de stock enregistré pour ce produit.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
