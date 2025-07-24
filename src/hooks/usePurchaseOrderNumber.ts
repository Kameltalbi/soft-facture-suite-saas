import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function usePurchaseOrderNumber() {
  const { organization } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const generatePurchaseOrderNumber = async () => {
    if (!organization?.id) return '';

    setIsLoading(true);
    try {
      console.log('🔍 Génération numéro de bon de commande pour organisation:', organization.id);
      
      // Récupérer les paramètres de numérotation pour les bons de commande
      const { data: numberingConfig, error: numberingError } = await supabase
        .from('document_numberings')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('document_type', 'purchase_order')
        .single();

      console.log('📋 Paramètres de numérotation BC récupérés:', numberingConfig);

      if (numberingError) {
        console.error('Erreur lors de la récupération des paramètres de numérotation:', numberingError);
        const currentYear = new Date().getFullYear();
        return `CMD-${currentYear}-0001`;
      }

      // Utiliser la fonction Supabase pour générer le numéro
      const { data: result, error: generateError } = await supabase.rpc(
        'get_next_document_number',
        {
          p_organization_id: organization.id,
          p_document_type: 'purchase_order',
          p_reset_frequency: numberingConfig.reset_frequency,
          p_prefix: numberingConfig.prefix,
          p_format: numberingConfig.format
        }
      );

      console.log('🎯 Numéro de BC généré:', result);

      if (generateError) {
        throw generateError;
      }

      return result || '';
    } catch (error) {
      console.error('💥 Erreur lors de la génération du numéro de BC:', error);
      const currentYear = new Date().getFullYear();
      return `CMD-${currentYear}-0001`;
    } finally {
      setIsLoading(false);
    }
  };

  return { generatePurchaseOrderNumber, isLoading };
}