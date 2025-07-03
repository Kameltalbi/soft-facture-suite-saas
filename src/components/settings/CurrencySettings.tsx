
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Coins, Plus, Star } from 'lucide-react';
import { Currency } from '@/types/settings';
import { CurrencyActionsMenu } from './CurrencyActionsMenu';

interface CurrencySettingsProps {
  currencies: Currency[];
  onAddCurrency: (currency: Omit<Currency, 'id' | 'tenant_id'>) => void;
  onSetPrimary: (currencyId: string) => void;
  onUpdateCurrency: (currencyId: string, currency: Partial<Currency>) => void;
  onDeleteCurrency: (currencyId: string) => void;
}

const COMMON_CURRENCIES = [
  { code: 'TND', symbol: 'DT', name: 'Dinar Tunisien' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar US' },
  { code: 'GBP', symbol: '£', name: 'Livre Sterling' },
  { code: 'MAD', symbol: 'د.م.', name: 'Dirham Marocain' },
  { code: 'DZD', symbol: 'د.ج', name: 'Dinar Algérien' },
];

export function CurrencySettings({ 
  currencies, 
  onAddCurrency, 
  onSetPrimary, 
  onUpdateCurrency, 
  onDeleteCurrency 
}: CurrencySettingsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    symbol: '',
    name: '',
    is_primary: false,
    decimal_places: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCurrency(newCurrency);
    setNewCurrency({ code: '', symbol: '', name: '', is_primary: false, decimal_places: 2 });
    setIsDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCurrency) {
      onUpdateCurrency(editingCurrency.id, {
        code: editingCurrency.code,
        symbol: editingCurrency.symbol,
        name: editingCurrency.name,
        decimal_places: editingCurrency.decimal_places,
      });
      setEditingCurrency(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setIsEditDialogOpen(true);
  };

  const handleQuickAdd = (currency: typeof COMMON_CURRENCIES[0]) => {
    onAddCurrency({
      ...currency,
      is_primary: currencies.length === 0,
      decimal_places: 2,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Devises
        </CardTitle>
        <CardDescription>
          Gérez les devises utilisées dans vos documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Add Common Currencies */}
        <div className="space-y-2">
          <Label>Devises courantes</Label>
          <div className="flex flex-wrap gap-2">
            {COMMON_CURRENCIES.map((currency) => {
              const isAdded = currencies.some(c => c.code === currency.code);
              return (
                <Button
                  key={currency.code}
                  variant={isAdded ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleQuickAdd(currency)}
                  disabled={isAdded}
                >
                  {currency.symbol} {currency.code}
                  {isAdded && <span className="ml-2 text-xs">(Ajoutée)</span>}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Current Currencies Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Devises configurées</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une devise personnalisée
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une devise personnalisée</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Code ISO (ex: USD)</Label>
                    <Input
                      id="code"
                      value={newCurrency.code}
                      onChange={(e) => setNewCurrency(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="USD"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbole</Label>
                    <Input
                      id="symbol"
                      value={newCurrency.symbol}
                      onChange={(e) => setNewCurrency(prev => ({ ...prev, symbol: e.target.value }))}
                      placeholder="$"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={newCurrency.name}
                      onChange={(e) => setNewCurrency(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Dollar US"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="decimal_places">Nombre de décimales</Label>
                    <Input
                      id="decimal_places"
                      type="number"
                      value={newCurrency.decimal_places}
                      onChange={(e) => setNewCurrency(prev => ({ ...prev, decimal_places: parseInt(e.target.value) || 0 }))}
                      min="0"
                      max="4"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Ajouter</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Symbole</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Décimales</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.id}>
                  <TableCell className="font-medium">{currency.code}</TableCell>
                  <TableCell>{currency.symbol}</TableCell>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell className="text-center">{currency.decimal_places}</TableCell>
                  <TableCell>
                    {currency.is_primary ? (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Principale
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Secondaire</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!currency.is_primary && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSetPrimary(currency.id)}
                      >
                        Définir comme principale
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <CurrencyActionsMenu
                      currency={currency}
                      onEdit={handleEdit}
                      onDelete={onDeleteCurrency}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Currency Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la devise</DialogTitle>
            </DialogHeader>
            {editingCurrency && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Code ISO</Label>
                  <Input
                    id="edit-code"
                    value={editingCurrency.code}
                    onChange={(e) => setEditingCurrency(prev => prev ? { ...prev, code: e.target.value.toUpperCase() } : null)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-symbol">Symbole</Label>
                  <Input
                    id="edit-symbol"
                    value={editingCurrency.symbol}
                    onChange={(e) => setEditingCurrency(prev => prev ? { ...prev, symbol: e.target.value } : null)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nom complet</Label>
                  <Input
                    id="edit-name"
                    value={editingCurrency.name}
                    onChange={(e) => setEditingCurrency(prev => prev ? { ...prev, name: e.target.value } : null)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-decimal-places">Nombre de décimales</Label>
                  <Input
                    id="edit-decimal-places"
                    type="number"
                    value={editingCurrency.decimal_places}
                    onChange={(e) => setEditingCurrency(prev => prev ? { ...prev, decimal_places: parseInt(e.target.value) || 0 } : null)}
                    min="0"
                    max="4"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Modifier</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
