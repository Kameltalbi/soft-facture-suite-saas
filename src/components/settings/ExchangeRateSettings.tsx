import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { useCurrencies } from '@/hooks/useCurrencies';
import { useCurrency } from '@/contexts/CurrencyContext';

export function ExchangeRateSettings() {
  const { exchangeRates, isLoading, createExchangeRate, updateExchangeRate, deleteExchangeRate } = useExchangeRates();
  const { currencies } = useCurrencies();
  const { currency: defaultCurrency } = useCurrency();
  
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState<any>(null);
  const [formData, setFormData] = useState({
    from_currency_id: '',
    rate: ''
  });

  // Filtrer les devises pour exclure la devise par défaut des devises "from"
  const nonDefaultCurrencies = currencies.filter(c => c.code !== defaultCurrency.code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.from_currency_id || !formData.rate) return;

    const rate = parseFloat(formData.rate);
    if (isNaN(rate) || rate <= 0) return;

    // Trouver l'ID de la devise par défaut
    const defaultCurrencyId = currencies.find(c => c.code === defaultCurrency.code)?.id;
    if (!defaultCurrencyId) return;

    try {
      if (editingRate) {
        await updateExchangeRate.mutateAsync({
          id: editingRate.id,
          rate
        });
      } else {
        await createExchangeRate.mutateAsync({
          from_currency_id: formData.from_currency_id,
          to_currency_id: defaultCurrencyId,
          rate
        });
      }
      
      setShowForm(false);
      setEditingRate(null);
      setFormData({ from_currency_id: '', rate: '' });
    } catch (error) {
      console.error('Error saving exchange rate:', error);
    }
  };

  const handleEdit = (rate: any) => {
    setEditingRate(rate);
    setFormData({
      from_currency_id: rate.from_currency_id,
      rate: rate.rate.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExchangeRate.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting exchange rate:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRate(null);
    setFormData({ from_currency_id: '', rate: '' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Taux de Change</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Taux de Change</CardTitle>
              <CardDescription>
                Gérez les taux de change fixes par rapport à votre devise par défaut ({defaultCurrency.name})
              </CardDescription>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus size={16} className="mr-2" />
                Nouveau Taux
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from_currency">De la devise</Label>
                    <Select
                      value={formData.from_currency_id}
                      onValueChange={(value) => setFormData({ ...formData, from_currency_id: value })}
                      disabled={!!editingRate}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        {nonDefaultCurrencies.map((currency) => (
                          <SelectItem key={currency.id} value={currency.id}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rate">
                      Taux (1 {currencies.find(c => c.id === formData.from_currency_id)?.code || 'XXX'} = ? {defaultCurrency.code})
                    </Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.000001"
                      min="0"
                      placeholder="Ex: 3.2"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={createExchangeRate.isPending || updateExchangeRate.isPending}>
                    {editingRate ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>De</TableHead>
                  <TableHead>Vers</TableHead>
                  <TableHead>Taux</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchangeRates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Aucun taux de change configuré. Ajoutez votre premier taux de change.
                    </TableCell>
                  </TableRow>
                ) : (
                  exchangeRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell>
                        <div className="font-medium">
                          {rate.from_currency?.code}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rate.from_currency?.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {rate.to_currency?.code}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rate.to_currency?.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono">
                          1 {rate.from_currency?.code} = {rate.rate} {rate.to_currency?.code}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(rate.updated_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(rate)}
                          >
                            <Edit size={16} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer le taux de change</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer ce taux de change ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(rate.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}