import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type DocumentType = 'invoice' | 'quote' | 'delivery_note' | 'credit_note' | 'purchase_order';

export function useDocumentNumber() {
  const { organization } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const generateDocumentNumber = async (documentType: DocumentType) => {
    if (!organization?.id) return '';

    setIsLoading(true);
    try {
      console.log('🔍 Génération numéro pour type:', documentType, 'organisation:', organization.id);
      
      // Récupérer les paramètres de numérotation pour le type de document
      const { data: numberingConfig, error: numberingError } = await supabase
        .from('document_numberings')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('document_type', documentType)
        .single();

      console.log('📋 Paramètres de numérotation récupérés:', numberingConfig);
      console.log('❌ Erreur de récupération:', numberingError);

      if (numberingError) {
        console.error('Erreur lors de la récupération des paramètres de numérotation:', numberingError);
        // Fallback au format par défaut selon le type
        const currentYear = new Date().getFullYear();
        const prefixMap: Record<DocumentType, string> = {
          invoice: 'FAC',
          quote: 'DEVIS',
          delivery_note: 'BL',
          credit_note: 'AVOIR',
          purchase_order: 'CMD'
        };
        return `${prefixMap[documentType]}-${currentYear}-0001`;
      }

      // Utiliser la fonction Supabase pour générer le numéro
      const { data: result, error: generateError } = await supabase.rpc(
        'get_next_document_number',
        {
          p_organization_id: organization.id,
          p_document_type: documentType,
          p_reset_frequency: numberingConfig.reset_frequency,
          p_prefix: numberingConfig.prefix,
          p_format: numberingConfig.format
        }
      );

      console.log('🎯 Numéro généré par la fonction:', result);
      console.log('❌ Erreur de génération:', generateError);

      if (generateError) {
        throw generateError;
      }

      return result || '';
    } catch (error) {
      console.error('💥 Erreur lors de la génération du numéro:', error);
      const currentYear = new Date().getFullYear();
      const prefixMap: Record<DocumentType, string> = {
        invoice: 'FAC',
        quote: 'DEVIS',
        delivery_note: 'BL',
        credit_note: 'AVOIR',
        purchase_order: 'CMD'
      };
      return `${prefixMap[documentType]}-${currentYear}-0001`;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateDocumentNumber, isLoading };
}