
-- Créer uniquement les politiques qui n'existent pas encore
-- Vérifier d'abord lesquelles existent déjà
DO $$
BEGIN
    -- Politiques pour invoices
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoices' AND policyname = 'Users can view invoices from their organization') THEN
        CREATE POLICY "Users can view invoices from their organization" 
        ON public.invoices 
        FOR SELECT 
        USING (organization_id = get_user_organization_id());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoices' AND policyname = 'Users can create invoices for their organization') THEN
        CREATE POLICY "Users can create invoices for their organization" 
        ON public.invoices 
        FOR INSERT 
        WITH CHECK (organization_id = get_user_organization_id());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoices' AND policyname = 'Users can update invoices from their organization') THEN
        CREATE POLICY "Users can update invoices from their organization" 
        ON public.invoices 
        FOR UPDATE 
        USING (organization_id = get_user_organization_id());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoices' AND policyname = 'Users can delete invoices from their organization') THEN
        CREATE POLICY "Users can delete invoices from their organization" 
        ON public.invoices 
        FOR DELETE 
        USING (organization_id = get_user_organization_id());
    END IF;

    -- Politiques pour invoice_items
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoice_items' AND policyname = 'Users can view invoice items from their organization') THEN
        CREATE POLICY "Users can view invoice items from their organization" 
        ON public.invoice_items 
        FOR SELECT 
        USING (organization_id = get_user_organization_id());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoice_items' AND policyname = 'Users can create invoice items for their organization') THEN
        CREATE POLICY "Users can create invoice items for their organization" 
        ON public.invoice_items 
        FOR INSERT 
        WITH CHECK (organization_id = get_user_organization_id());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoice_items' AND policyname = 'Users can update invoice items from their organization') THEN
        CREATE POLICY "Users can update invoice items from their organization" 
        ON public.invoice_items 
        FOR UPDATE 
        USING (organization_id = get_user_organization_id());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoice_items' AND policyname = 'Users can delete invoice items from their organization') THEN
        CREATE POLICY "Users can delete invoice items from their organization" 
        ON public.invoice_items 
        FOR DELETE 
        USING (organization_id = get_user_organization_id());
    END IF;
END $$;

-- Activer RLS sur les tables si ce n'est pas déjà fait
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Ajouter les politiques manquantes pour les clients
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Users can view clients from their organization') THEN
        CREATE POLICY "Users can view clients from their organization" 
        ON public.clients 
        FOR SELECT 
        USING (organization_id = get_user_organization_id());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Users can create clients for their organization') THEN
        CREATE POLICY "Users can create clients for their organization" 
        ON public.clients 
        FOR INSERT 
        WITH CHECK (organization_id = get_user_organization_id());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Users can update clients from their organization') THEN
        CREATE POLICY "Users can update clients from their organization" 
        ON public.clients 
        FOR UPDATE 
        USING (organization_id = get_user_organization_id());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Users can delete clients from their organization') THEN
        CREATE POLICY "Users can delete clients from their organization" 
        ON public.clients 
        FOR DELETE 
        USING (organization_id = get_user_organization_id());
    END IF;
END $$;
