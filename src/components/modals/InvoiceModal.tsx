import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Plus, Trash2, Save, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/pdf/InvoicePDF';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  document?: any;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount: number;
  total: number;
}

export function InvoiceModal({ open, onClose, document }: InvoiceModalProps) {
  const { generateInvoicePDF } = usePDFGeneration();

  const [invoiceData, setInvoiceData] = useState({
    number: document?.number || 'FAC-2024-002',
    date: document?.date || new Date().toISOString().split('T')[0],
    dueDate: '',
    clientId: '',
    subject: '',
    notes: '',
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
      discount: 0,
      total: 0
    }
  ]);

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    showVat: true,
    showDiscount: true,
    showAdvance: false,
    currency: 'EUR',
    amountInWords: true
  });

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
      discount: 0,
      total: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculate total
        const subtotal = updated.quantity * updated.unitPrice;
        const discountAmount = subtotal * (updated.discount / 100);
        updated.total = subtotal - discountAmount;
        return updated;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotalHT = lineItems.reduce((sum, item) => sum + item.total, 0);
    const totalVAT = lineItems.reduce((sum, item) => {
      return sum + (item.total * item.vatRate / 100);
    }, 0);
    const totalTTC = subtotalHT + totalVAT;

    return { subtotalHT, totalVAT, totalTTC };
  };

  const { subtotalHT, totalVAT, totalTTC } = calculateTotals();

  const pdfData = generateInvoicePDF(invoiceData, lineItems, settings);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            {document ? 'Modifier la facture' : 'Nouvelle facture'}
          </DialogTitle>
          <div className="flex items-center space-x-2">
            <PDFDownloadLink
              document={<InvoicePDF {...pdfData} />}
              fileName={`facture-${invoiceData.number}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                  {loading ? 'Génération...' : 'Aperçu PDF'}
                </Button>
              )}
            </PDFDownloadLink>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={16} />
            </Button>
          </div>
        </DialogHeader>

        {showSettings && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">Paramètres du document</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showVat"
                  checked={settings.showVat}
                  onChange={(e) => setSettings({...settings, showVat: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="showVat" className="text-sm">Afficher TVA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showDiscount"
                  checked={settings.showDiscount}
                  onChange={(e) => setSettings({...settings, showDiscount: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="showDiscount" className="text-sm">Afficher remise</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showAdvance"
                  checked={settings.showAdvance}
                  onChange={(e) => setSettings({...settings, showAdvance: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="showAdvance" className="text-sm">Afficher avance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="amountInWords"
                  checked={settings.amountInWords}
                  onChange={(e) => setSettings({...settings, amountInWords: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="amountInWords" className="text-sm">Montant en lettres</Label>
              </div>
              <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number">Numéro</Label>
                    <Input
                      id="number"
                      value={invoiceData.number}
                      onChange={(e) => setInvoiceData({...invoiceData, number: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Select value={invoiceData.clientId} onValueChange={(value) => setInvoiceData({...invoiceData, clientId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Entreprise ABC</SelectItem>
                      <SelectItem value="2">Société XYZ</SelectItem>
                      <SelectItem value="3">Client Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Objet</Label>
                  <Input
                    id="subject"
                    value={invoiceData.subject}
                    onChange={(e) => setInvoiceData({...invoiceData, subject: e.target.value})}
                    placeholder="Objet de la facture"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                  placeholder="Notes et conditions..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Lignes de facturation</CardTitle>
                <Button size="sm" onClick={addLineItem}>
                  <Plus size={16} className="mr-1" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-3 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium">Ligne {index + 1}</span>
                      {lineItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        placeholder="Description du produit/service"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Quantité</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Prix unitaire</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    {settings.showVat && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">TVA (%)</Label>
                          <Select
                            value={item.vatRate.toString()}
                            onValueChange={(value) => updateLineItem(item.id, 'vatRate', parseFloat(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5.5">5.5%</SelectItem>
                              <SelectItem value="10">10%</SelectItem>
                              <SelectItem value="20">20%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {settings.showDiscount && (
                          <div>
                            <Label className="text-xs">Remise (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={item.discount}
                              onChange={(e) => updateLineItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-right">
                      <span className="text-sm font-semibold">
                        Total: {item.total.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Totaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total HT:</span>
                  <span className="font-semibold">{subtotalHT.toFixed(2)} €</span>
                </div>
                {settings.showVat && (
                  <div className="flex justify-between">
                    <span>TVA:</span>
                    <span className="font-semibold">{totalVAT.toFixed(2)} €</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total TTC:</span>
                  <span>{totalTTC.toFixed(2)} €</span>
                </div>
                {settings.amountInWords && (
                  <div className="text-sm text-neutral-600 mt-2">
                    <strong>Montant en lettres:</strong><br />
                    {(() => {
                      if (totalTTC === 0) return 'zéro';
                      return `${Math.floor(totalTTC)} euros et ${Math.round((totalTTC % 1) * 100)} centimes`;
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="outline">
            <Save size={16} className="mr-2" />
            Enregistrer en brouillon
          </Button>
          <PDFDownloadLink
            document={<InvoicePDF {...pdfData} />}
            fileName={`facture-${invoiceData.number}.pdf`}
          >
            {({ loading }) => (
              <Button className="bg-primary hover:bg-primary/90" disabled={loading}>
                <Send size={16} className="mr-2" />
                {loading ? 'Génération...' : 'Télécharger PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}
