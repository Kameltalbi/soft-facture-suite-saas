// 📁 src/pages/RecouvrementPage.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import dayjs from 'dayjs';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

export default function RecouvrementPage() {
  const [factures, setFactures] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    const { data, error } = await supabase
      .from('factures')
      .select('*')
      .neq('status', 'payée');

    if (error) toast.error('Erreur lors du chargement des factures');
    else setFactures(data);
  };

  const markAsPaid = async (id: string) => {
    const { error } = await supabase
      .from('factures')
      .update({ status: 'payée' })
      .eq('id', id);

    if (error) toast.error("Échec de la mise à jour");
    else {
      toast.success('Facture marquée comme payée');
      fetchFactures();
    }
  };

  const filtered = factures.filter((f) =>
    f.client_nom.toLowerCase().includes(search.toLowerCase()) ||
    f.numero.toLowerCase().includes(search.toLowerCase())
  );

  const getEcheanceColor = (date_echeance: string) => {
    const today = dayjs();
    const due = dayjs(date_echeance);
    const diff = today.diff(due, 'day');
    if (diff <= 0) return 'text-green-600';
    if (diff <= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recouvrement</h1>
      <div className="mb-4">
        <Input placeholder="Recherche client ou facture" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant TTC</TableHead>
            <TableHead>Payé</TableHead>
            <TableHead>Reste</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead>Relance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((facture) => (
            <TableRow key={facture.id}>
              <TableCell>{facture.numero}</TableCell>
              <TableCell>{facture.client_nom}</TableCell>
              <TableCell>{facture.total_ttc} DT</TableCell>
              <TableCell>{facture.montant_paye || 0} DT</TableCell>
              <TableCell>{(facture.total_ttc - (facture.montant_paye || 0)).toFixed(2)} DT</TableCell>
              <TableCell className={getEcheanceColor(facture.date_echeance)}>{facture.date_echeance}</TableCell>
              <TableCell>{facture.statut_relance || 'Non relancée'}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => markAsPaid(facture.id)}>Marquer payée</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="ml-2">Relancer</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <p>Ici, vous pouvez rédiger et envoyer une relance par email ou SMS.</p>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
