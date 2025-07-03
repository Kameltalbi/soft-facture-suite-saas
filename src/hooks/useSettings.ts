import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Currency, GlobalSettings, DocumentNumbering, Role } from '@/types/settings';

export function useSettings() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
  const [numberings, setNumberings] = useState<DocumentNumbering[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const { organization } = useAuth();
  const { toast } = useToast();

  // Fetch currencies
  const fetchCurrencies = async () => {
    if (!organization?.id) return;

    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('organization_id', organization.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      
      const formattedCurrencies: Currency[] = (data || []).map(currency => ({
        id: currency.id,
        code: currency.code,
        symbol: currency.symbol,
        name: currency.name,
        is_primary: currency.is_primary,
        decimal_places: currency.decimal_places || 2,
        tenant_id: currency.organization_id
      }));
      
      setCurrencies(formattedCurrencies);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  // Fetch global settings
  const fetchGlobalSettings = async () => {
    if (!organization?.id) return;

    try {
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .eq('organization_id', organization.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const formattedSettings: GlobalSettings = {
          id: data.id,
          footer_content: data.footer_content || '',
          footer_display: data.footer_display as 'all' | 'invoices_only' | 'none' || 'all',
          primary_currency: data.primary_currency || '',
          invoice_template: data.invoice_template || 'classic',
          quote_template: data.quote_template || 'classic',
          delivery_note_template: data.delivery_note_template || 'classic',
          credit_template: data.credit_template || 'classic',
          tenant_id: data.organization_id
        };
        setGlobalSettings(formattedSettings);
      }
    } catch (error) {
      console.error('Error fetching global settings:', error);
    }
  };

  // Fetch numberings
  const fetchNumberings = async () => {
    if (!organization?.id) return;

    try {
      const { data, error } = await supabase
        .from('document_numberings')
        .select('*')
        .eq('organization_id', organization.id)
        .order('document_type');

      if (error) throw error;
      
      const formattedNumberings: DocumentNumbering[] = (data || []).map(numbering => ({
        id: numbering.id,
        document_type: numbering.document_type as 'invoice' | 'quote' | 'delivery_note' | 'credit',
        prefix: numbering.prefix,
        format: numbering.format as 'incremental' | 'yearly' | 'monthly',
        next_number: numbering.next_number,
        reset_frequency: numbering.reset_frequency as 'never' | 'monthly' | 'yearly',
        tenant_id: numbering.organization_id
      }));
      
      setNumberings(formattedNumberings);
    } catch (error) {
      console.error('Error fetching numberings:', error);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    if (!organization?.id) return;

    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      
      const formattedRoles: Role[] = (data || []).map(role => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions as Record<string, { read: boolean; write: boolean; delete: boolean }>,
        tenant_id: role.organization_id
      }));
      
      setRoles(formattedRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Add currency
  const addCurrency = async (currency: Omit<Currency, 'id' | 'tenant_id'>) => {
    if (!organization?.id) return;

    try {
      const { data, error } = await supabase
        .from('currencies')
        .insert({
          code: currency.code,
          symbol: currency.symbol,
          name: currency.name,
          is_primary: currency.is_primary,
          decimal_places: currency.decimal_places,
          organization_id: organization.id
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchCurrencies();
      
      toast({
        title: 'Succès',
        description: 'Devise ajoutée avec succès.',
      });
    } catch (error) {
      console.error('Error adding currency:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'ajout de la devise.',
        variant: 'destructive',
      });
    }
  };

  // Set primary currency
  const setPrimaryCurrency = async (currencyId: string) => {
    if (!organization?.id) return;

    try {
      // First, set all currencies as non-primary
      await supabase
        .from('currencies')
        .update({ is_primary: false })
        .eq('organization_id', organization.id);

      // Then set the selected currency as primary
      const { error } = await supabase
        .from('currencies')
        .update({ is_primary: true })
        .eq('id', currencyId)
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      await fetchCurrencies();
      
      toast({
        title: 'Succès',
        description: 'Devise principale mise à jour.',
      });
    } catch (error) {
      console.error('Error setting primary currency:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour de la devise principale.',
        variant: 'destructive',
      });
    }
  };

  // Update currency
  const updateCurrency = async (currencyId: string, data: Partial<Currency>) => {
    if (!organization?.id) return;

    try {
      const { error } = await supabase
        .from('currencies')
        .update({
          code: data.code,
          symbol: data.symbol,
          name: data.name,
          decimal_places: data.decimal_places,
        })
        .eq('id', currencyId)
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      await fetchCurrencies();
      
      toast({
        title: 'Succès',
        description: 'Devise mise à jour avec succès.',
      });
    } catch (error) {
      console.error('Error updating currency:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour de la devise.',
        variant: 'destructive',
      });
    }
  };

  // Delete currency
  const deleteCurrency = async (currencyId: string) => {
    if (!organization?.id) return;

    try {
      const { error } = await supabase
        .from('currencies')
        .delete()
        .eq('id', currencyId)
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      await fetchCurrencies();
      
      toast({
        title: 'Succès',
        description: 'Devise supprimée avec succès.',
      });
    } catch (error) {
      console.error('Error deleting currency:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression de la devise.',
        variant: 'destructive',
      });
    }
  };

  // Save global settings
  const saveGlobalSettings = async (settings: Partial<GlobalSettings>) => {
    if (!organization?.id) return;

    try {
      console.log('🔧 Sauvegarde des paramètres globaux:', settings);
      
      // First, try to get existing settings
      const { data: existingSettings, error: fetchError } = await supabase
        .from('global_settings')
        .select('id')
        .eq('organization_id', organization.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Erreur lors de la récupération des paramètres existants:', fetchError);
      }

      let result;

      if (existingSettings) {
        // Update existing settings
        console.log('📝 Mise à jour des paramètres existants');
        result = await supabase
          .from('global_settings')
          .update({
            footer_content: settings.footer_content,
            footer_display: settings.footer_display,
            primary_currency: settings.primary_currency,
            invoice_template: settings.invoice_template,
            quote_template: settings.quote_template,
            delivery_note_template: settings.delivery_note_template,
            credit_template: settings.credit_template,
            updated_at: new Date().toISOString()
          })
          .eq('organization_id', organization.id)
          .eq('id', existingSettings.id);
      } else {
        // Insert new settings
        console.log('➕ Création de nouveaux paramètres');
        result = await supabase
          .from('global_settings')
          .insert({
            footer_content: settings.footer_content,
            footer_display: settings.footer_display,
            primary_currency: settings.primary_currency,
            invoice_template: settings.invoice_template,
            quote_template: settings.quote_template,
            delivery_note_template: settings.delivery_note_template,
            credit_template: settings.credit_template,
            organization_id: organization.id
          });
      }

      if (result.error) {
        console.error('❌ Erreur lors de la sauvegarde:', result.error);
        throw result.error;
      }

      console.log('✅ Paramètres sauvegardés avec succès');
      
      await fetchGlobalSettings();
      
      toast({
        title: 'Succès',
        description: 'Paramètres mis à jour avec succès.',
      });
    } catch (error) {
      console.error('Error saving global settings:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la sauvegarde des paramètres. Vérifiez vos permissions.',
        variant: 'destructive',
      });
    }
  };

  // Update numbering
  const updateNumbering = async (id: string, data: Partial<DocumentNumbering>) => {
    if (!organization?.id) return;

    try {
      const { error } = await supabase
        .from('document_numberings')
        .update({
          prefix: data.prefix,
          format: data.format,
          next_number: data.next_number,
          reset_frequency: data.reset_frequency
        })
        .eq('id', id)
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      await fetchNumberings();
      
      toast({
        title: 'Succès',
        description: 'Numérotation mise à jour avec succès.',
      });
    } catch (error) {
      console.error('Error updating numbering:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour de la numérotation.',
        variant: 'destructive',
      });
    }
  };

  // Create role
  const createRole = async (name: string, permissions: Record<string, { read: boolean; write: boolean; delete: boolean }>) => {
    if (!organization?.id) return;

    try {
      const { error } = await supabase
        .from('roles')
        .insert({
          name,
          permissions,
          organization_id: organization.id
        });

      if (error) throw error;
      
      await fetchRoles();
      
      toast({
        title: 'Succès',
        description: 'Rôle créé avec succès.',
      });
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création du rôle.',
        variant: 'destructive',
      });
    }
  };

  // Update role
  const updateRole = async (roleId: string, permissions: Record<string, { read: boolean; write: boolean; delete: boolean }>) => {
    if (!organization?.id) return;

    try {
      const { error } = await supabase
        .from('roles')
        .update({ permissions })
        .eq('id', roleId)
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      await fetchRoles();
      
      toast({
        title: 'Succès',
        description: 'Permissions mises à jour.',
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour des permissions.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (organization?.id) {
        setLoading(true);
        await Promise.all([
          fetchCurrencies(),
          fetchGlobalSettings(),
          fetchNumberings(),
          fetchRoles()
        ]);
        setLoading(false);
      }
    };

    loadData();
  }, [organization?.id]);

  return {
    currencies,
    globalSettings,
    numberings,
    roles,
    loading,
    addCurrency,
    setPrimaryCurrency,
    updateCurrency,
    deleteCurrency,
    saveGlobalSettings,
    updateNumbering,
    createRole,
    updateRole,
    refetch: () => {
      fetchCurrencies();
      fetchGlobalSettings();
      fetchNumberings();
      fetchRoles();
    }
  };
}
