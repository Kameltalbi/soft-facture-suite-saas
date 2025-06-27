
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SavedReport {
  id: string;
  name: string;
  report_type: string;
  parameters: any;
  created_by: string | null;
  is_public: boolean | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export function useSavedReports() {
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  const fetchSavedReports = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_reports')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedReports(data || []);
    } catch (err) {
      console.error('Error fetching saved reports:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des rapports sauvegardés');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedReports();
  }, [organization?.id]);

  const createSavedReport = async (reportData: Omit<SavedReport, 'id' | 'organization_id' | 'created_at' | 'updated_at' | 'profiles'>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('saved_reports')
        .insert({
          ...reportData,
          organization_id: organization.id
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchSavedReports();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error creating saved report:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la sauvegarde du rapport' 
      };
    }
  };

  return {
    savedReports,
    loading,
    error,
    fetchSavedReports,
    createSavedReport
  };
}
