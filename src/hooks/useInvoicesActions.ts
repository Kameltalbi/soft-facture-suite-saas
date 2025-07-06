import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useInvoicesActions() {
  const { organization } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSaveInvoice = async (invoiceData: any, editingInvoice?: any) => {
    try {
      if (!organization?.id) {
        toast({
          title: "Erreur",
          description: "Organisation non trouvée",
          variant: "destructive"
        });
        return;
      }

      if (editingInvoice) {
        // Mise à jour d'une facture existante
        const { error: updateError } = await supabase
          .from('invoices')
          .update({
            invoice_number: invoiceData.number,
            date: invoiceData.date,
            due_date: invoiceData.dueDate,
            client_id: invoiceData.client?.id,
            subtotal: invoiceData.totals.subtotalHT,
            tax_amount: invoiceData.totals.totalVAT,
            total_amount: invoiceData.totals.totalTTC,
            notes: invoiceData.notes,
            use_vat: invoiceData.invoiceSettings?.useVat,
            custom_taxes_used: invoiceData.invoiceSettings?.customTaxesUsed || [],
            has_advance: invoiceData.invoiceSettings?.hasAdvance,
            advance_amount: invoiceData.invoiceSettings?.advanceAmount || 0,
            currency_id: invoiceData.currencyId || null,
            sales_channel: invoiceData.invoiceSettings?.salesChannel || 'local',
            updated_at: new Date().toISOString()
          })
          .eq('id', editingInvoice.id);

        if (updateError) throw updateError;

        // Supprimer les anciens éléments et en créer de nouveaux
        await supabase.from('invoice_items').delete().eq('invoice_id', editingInvoice.id);
        
        if (invoiceData.items && invoiceData.items.length > 0) {
          const newItems = invoiceData.items.map((item: any) => ({
            invoice_id: editingInvoice.id,
            organization_id: organization.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            tax_rate: item.vatRate,
            total_price: item.total
          }));

          const { error: itemsError } = await supabase.from('invoice_items').insert(newItems);
          if (itemsError) throw itemsError;
        }

        toast({
          title: "Succès",
          description: "La facture a été mise à jour avec succès",
        });
      } else {
        // Création d'une nouvelle facture
        const { data: newInvoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            invoice_number: invoiceData.number,
            date: invoiceData.date,
            due_date: invoiceData.dueDate,
            client_id: invoiceData.client?.id,
            organization_id: organization.id,
            status: 'draft',
            subtotal: invoiceData.totals.subtotalHT,
            tax_amount: invoiceData.totals.totalVAT,
            total_amount: invoiceData.totals.totalTTC,
            notes: invoiceData.notes,
            use_vat: invoiceData.invoiceSettings?.useVat,
            custom_taxes_used: invoiceData.invoiceSettings?.customTaxesUsed || [],
            has_advance: invoiceData.invoiceSettings?.hasAdvance,
            advance_amount: invoiceData.invoiceSettings?.advanceAmount || 0,
            currency_id: invoiceData.currencyId || null,
            sales_channel: invoiceData.invoiceSettings?.salesChannel || 'local'
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;

        // Créer les éléments de facture
        if (invoiceData.items && invoiceData.items.length > 0) {
          const newItems = invoiceData.items.map((item: any) => ({
            invoice_id: newInvoice.id,
            organization_id: organization.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            tax_rate: item.vatRate,
            total_price: item.total
          }));

          const { error: itemsError } = await supabase.from('invoice_items').insert(newItems);
          if (itemsError) throw itemsError;
        }

        toast({
          title: "Succès",
          description: "La facture a été créée avec succès",
        });
      }

      // Rafraîchir la liste des factures
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la facture",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateInvoice = async (invoice: any) => {
    try {
      // Générer un nouveau numéro de facture
      const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
      
      // Créer la nouvelle facture
      const { data: newInvoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          client_id: invoice.client_id,
          organization_id: organization.id,
          date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'draft',
          subtotal: invoice.subtotal,
          tax_amount: invoice.tax_amount,
          total_amount: invoice.total_amount,
          notes: invoice.notes,
          sales_channel: invoice.sales_channel || 'local'
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Dupliquer les éléments de facture
      if (invoice.invoice_items && invoice.invoice_items.length > 0) {
        const newItems = invoice.invoice_items.map((item: any) => ({
          invoice_id: newInvoice.id,
          organization_id: organization.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          total_price: item.total_price,
          product_id: item.product_id
        }));

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(newItems);

        if (itemsError) throw itemsError;
      }

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Succès",
        description: `La facture ${invoice.invoice_number} a été dupliquée en ${invoiceNumber}`,
      });
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la duplication de la facture",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInvoice = async (invoice: any) => {
    try {
      // Supprimer d'abord les éléments de facture
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', invoice.id);

      if (itemsError) throw itemsError;

      // Supprimer la facture
      const { error: invoiceError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id);

      if (invoiceError) throw invoiceError;

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Succès",
        description: `La facture ${invoice.invoice_number} a été supprimée`,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la facture",
        variant: "destructive"
      });
    }
  };

  const handleValidateInvoice = async (invoice: any) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'validated',
          updated_at: new Date().toISOString()
        })
        .eq('id', invoice.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Succès",
        description: `La facture ${invoice.invoice_number} a été validée`,
      });
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la validation de la facture",
        variant: "destructive"
      });
    }
  };

  const handleSignInvoice = async (invoice: any) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          is_signed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', invoice.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Succès",
        description: `La facture ${invoice.invoice_number} a été signée`,
      });
    } catch (error) {
      console.error('Erreur lors de la signature:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la signature de la facture",
        variant: "destructive"
      });
    }
  };

  const handlePaymentRecorded = async (paymentData: any) => {
    try {
      // Récupérer la facture actuelle pour connaître son montant total
      const { data: currentInvoice, error: fetchError } = await supabase
        .from('invoices')
        .select('total_amount, amount_paid')
        .eq('id', paymentData.invoiceId)
        .single();

      if (fetchError) throw fetchError;

      // Calculer le nouveau montant payé
      const newAmountPaid = (currentInvoice.amount_paid || 0) + paymentData.amount;
      
      // Déterminer le nouveau statut
      let newStatus = 'partially_paid';
      if (newAmountPaid >= currentInvoice.total_amount) {
        newStatus = 'paid';
      }

      const { error } = await supabase
        .from('invoices')
        .update({ 
          amount_paid: newAmountPaid,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentData.invoiceId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Succès",
        description: newStatus === 'paid' ? "Le paiement a été enregistré - Facture marquée comme payée" : "Le paiement partiel a été enregistré",
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement du paiement",
        variant: "destructive"
      });
    }
  };

  const handleEmailSent = (emailData: any) => {
    toast({
      title: "Email envoyé",
      description: `La facture a été envoyée à ${emailData.to}`,
    });
  };

  return {
    handleSaveInvoice,
    handleDuplicateInvoice,
    handleDeleteInvoice,
    handleValidateInvoice,
    handleSignInvoice,
    handlePaymentRecorded,
    handleEmailSent
  };
}