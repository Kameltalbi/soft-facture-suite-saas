import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference?: string;
  notes?: string;
  created_at: string;
}

export interface InvoiceWithPayments {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  date: string;
  total_amount: number;
  amount_paid: number;
  status: string;
  remaining_balance: number;
  payment_progress: number;
  currency: {
    code: string;
    symbol: string;
    name: string;
    decimal_places: number;
  };
}

export const usePayments = () => {
  const [invoices, setInvoices] = useState<InvoiceWithPayments[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvoicesWithPayments = async (selectedMonth?: string, selectedYear?: number) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          client_id,
          date,
          total_amount,
          amount_paid,
          status,
          currency_id,
          clients!inner(name),
          currencies(code, symbol, name, decimal_places)
        `)
        .not('status', 'eq', 'paid');

      // Ajouter les filtres de date si spécifiés
      if (selectedMonth && selectedMonth !== 'all') {
        const year = selectedYear || new Date().getFullYear();
        const startDate = `${year}-${selectedMonth.padStart(2, '0')}-01`;
        const endDate = `${year}-${selectedMonth.padStart(2, '0')}-31`;
        query = query.gte('date', startDate).lte('date', endDate);
      } else if (selectedYear) {
        // Si seulement l'année est spécifiée
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${selectedYear}-12-31`;
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;

      const invoicesWithPayments = data?.map(invoice => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        client_id: invoice.client_id,
        client_name: (invoice.clients as any)?.name || 'Client inconnu',
        date: invoice.date,
        total_amount: invoice.total_amount,
        amount_paid: invoice.amount_paid || 0,
        status: invoice.status,
        remaining_balance: invoice.total_amount - (invoice.amount_paid || 0),
        payment_progress: ((invoice.amount_paid || 0) / invoice.total_amount) * 100,
        currency: (invoice.currencies as any) || { code: 'EUR', symbol: '€', name: 'Euro', decimal_places: 2 }
      })) || [];

      setInvoices(invoicesWithPayments);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (invoiceId?: string) => {
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (invoiceId) {
        query = query.eq('invoice_id', invoiceId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive"
      });
    }
  };

  const createPayment = async (paymentData: {
    invoice_id: string;
    amount: number;
    payment_date: string;
    payment_method: string;
    reference?: string;
    notes?: string;
  }) => {
    try {
      // Récupérer l'organization_id depuis le profil utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile?.organization_id) {
        throw new Error('Organization ID not found');
      }

      const { error } = await supabase
        .from('payments')
        .insert([{
          ...paymentData,
          organization_id: profile.organization_id
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Paiement enregistré avec succès"
      });

      // Refresh les données
      await fetchInvoicesWithPayments();
      await fetchPayments();

      return true;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchInvoicesWithPayments();
    fetchPayments();
  }, []);

  return {
    invoices,
    payments,
    loading,
    fetchInvoicesWithPayments,
    fetchPayments,
    createPayment,
    refetch: () => {
      fetchInvoicesWithPayments();
      fetchPayments();
    }
  };
};