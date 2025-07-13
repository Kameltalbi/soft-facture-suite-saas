
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useInvoiceNumber() {
  const { organization } = useAuth();
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const generateNextInvoiceNumber = async () => {
    if (!organization?.id) return '';

    setIsLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const yearPrefix = `FAC-${currentYear}-`;

      // Récupérer la dernière facture de l'année courante pour cette organisation
      const { data: lastInvoice, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .eq('organization_id', organization.id)
        .like('invoice_number', `${yearPrefix}%`)
        .order('invoice_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la recherche de la dernière facture:', error);
        return `${yearPrefix}0001`;
      }

      let nextNumber = 1;
      
      if (lastInvoice?.invoice_number) {
        // Extraire le numéro de la dernière facture de l'année courante (format FAC-YYYY-XXXX)
        const match = lastInvoice.invoice_number.match(/FAC-\d{4}-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const paddedNumber = nextNumber.toString().padStart(4, '0');
      return `${yearPrefix}${paddedNumber}`;
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de facture:', error);
      const currentYear = new Date().getFullYear();
      return `FAC-${currentYear}-0001`;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchNextNumber = async () => {
      const number = await generateNextInvoiceNumber();
      setNextInvoiceNumber(number);
    };

    if (organization?.id) {
      fetchNextNumber();
    }
  }, [organization?.id]);

  return { nextInvoiceNumber, generateNextInvoiceNumber, isLoading };
}
