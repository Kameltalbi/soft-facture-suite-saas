
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
      console.log('🔍 Début génération numéro facture pour organisation:', organization.id);
      
      // Récupérer les paramètres de numérotation pour les factures
      const { data: numberingConfig, error: numberingError } = await supabase
        .from('document_numberings')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('document_type', 'invoice')
        .single();

      console.log('📋 Paramètres de numérotation récupérés:', numberingConfig);
      console.log('❌ Erreur de récupération:', numberingError);

      if (numberingError) {
        console.error('Erreur lors de la récupération des paramètres de numérotation:', numberingError);
        // Fallback au format par défaut
        const currentYear = new Date().getFullYear();
        return `FAC-${currentYear}-0001`;
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      let searchPattern = '';
      let nextNumber = numberingConfig.next_number;

      console.log('📊 Données initiales:', {
        currentYear,
        currentMonth,
        nextNumber,
        resetFrequency: numberingConfig.reset_frequency,
        format: numberingConfig.format,
        prefix: numberingConfig.prefix
      });

      // Construire le pattern de recherche selon la fréquence de réinitialisation
      switch (numberingConfig.reset_frequency) {
        case 'yearly':
          searchPattern = `${numberingConfig.prefix}${currentYear}-%`;
          break;
        case 'monthly':
          const monthStr = currentMonth.toString().padStart(2, '0');
          searchPattern = `${numberingConfig.prefix}${currentYear}${monthStr}-%`;
          break;
        case 'never':
        default:
          searchPattern = `${numberingConfig.prefix}%`;
          break;
      }

      console.log('🔍 Pattern de recherche:', searchPattern);

      // Rechercher la dernière facture selon le pattern
      const { data: lastInvoice, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .eq('organization_id', organization.id)
        .like('invoice_number', searchPattern)
        .order('invoice_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('📄 Dernière facture trouvée:', lastInvoice);
      console.log('❌ Erreur de recherche:', error);

      if (error) {
        console.error('Erreur lors de la recherche de la dernière facture:', error);
      }

      if (lastInvoice?.invoice_number) {
        console.log('🔢 Extraction du numéro depuis:', lastInvoice.invoice_number);
        // Extraire le numéro de la dernière facture
        const parts = lastInvoice.invoice_number.split('-');
        console.log('📝 Parties du numéro:', parts);
        if (parts.length > 0) {
          const lastNumberStr = parts[parts.length - 1];
          const lastNumber = parseInt(lastNumberStr);
          console.log('🧮 Dernier numéro extrait:', lastNumber);
          if (!isNaN(lastNumber)) {
            nextNumber = Math.max(nextNumber, lastNumber + 1);
            console.log('✅ Nouveau nextNumber calculé:', nextNumber);
          }
        }
      }

      // Générer le numéro selon le format configuré
      let invoiceNumber = '';
      switch (numberingConfig.format) {
        case 'yearly':
          if (numberingConfig.reset_frequency === 'yearly') {
            // Vérifier s'il y a des factures cette année
            const yearSearchPattern = `${numberingConfig.prefix}${currentYear}-%`;
            const { data: yearInvoices } = await supabase
              .from('invoices')
              .select('invoice_number')
              .eq('organization_id', organization.id)
              .like('invoice_number', yearSearchPattern)
              .limit(1);
            
            console.log('📅 Factures de cette année:', yearInvoices);
            if (!yearInvoices || yearInvoices.length === 0) {
              nextNumber = 1;
              console.log('🔄 Réinitialisation à 1 pour nouvelle année');
            }
          }
          invoiceNumber = `${numberingConfig.prefix}${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
          break;
        case 'monthly':
          if (numberingConfig.reset_frequency === 'monthly') {
            // Vérifier s'il y a des factures ce mois
            const monthStr = currentMonth.toString().padStart(2, '0');
            const monthSearchPattern = `${numberingConfig.prefix}${currentYear}${monthStr}-%`;
            const { data: monthInvoices } = await supabase
              .from('invoices')
              .select('invoice_number')
              .eq('organization_id', organization.id)
              .like('invoice_number', monthSearchPattern)
              .limit(1);
            
            console.log('📅 Factures de ce mois:', monthInvoices);
            if (!monthInvoices || monthInvoices.length === 0) {
              nextNumber = 1;
              console.log('🔄 Réinitialisation à 1 pour nouveau mois');
            }
          }
          const monthStr = currentMonth.toString().padStart(2, '0');
          invoiceNumber = `${numberingConfig.prefix}${currentYear}${monthStr}-${nextNumber.toString().padStart(3, '0')}`;
          break;
        case 'incremental':
        default:
          invoiceNumber = `${numberingConfig.prefix}${nextNumber.toString().padStart(4, '0')}`;
          break;
      }

      console.log('🎯 Numéro de facture généré:', invoiceNumber);

      // Mettre à jour le next_number dans la base de données
      const { error: updateError } = await supabase
        .from('document_numberings')
        .update({ next_number: nextNumber + 1 })
        .eq('id', numberingConfig.id);

      console.log('💾 Mise à jour next_number:', nextNumber + 1);
      console.log('❌ Erreur de mise à jour:', updateError);

      return invoiceNumber;
    } catch (error) {
      console.error('💥 Erreur générale lors de la génération du numéro de facture:', error);
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
