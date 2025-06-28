
-- Vérifier et créer les politiques RLS manquantes

-- Politiques RLS pour les devis (si elles n'existent pas déjà)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' AND policyname = 'Users can view their organization''s quotes'
    ) THEN
        CREATE POLICY "Users can view their organization's quotes"
          ON public.quotes FOR SELECT
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' AND policyname = 'Users can insert quotes in their organization'
    ) THEN
        CREATE POLICY "Users can insert quotes in their organization"
          ON public.quotes FOR INSERT
          WITH CHECK (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' AND policyname = 'Users can update their organization''s quotes'
    ) THEN
        CREATE POLICY "Users can update their organization's quotes"
          ON public.quotes FOR UPDATE
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' AND policyname = 'Users can delete their organization''s quotes'
    ) THEN
        CREATE POLICY "Users can delete their organization's quotes"
          ON public.quotes FOR DELETE
          USING (organization_id = public.get_user_organization_id());
    END IF;
END $$;

-- Politiques RLS pour les lignes de devis
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quote_items' AND policyname = 'Users can view their organization''s quote items'
    ) THEN
        CREATE POLICY "Users can view their organization's quote items"
          ON public.quote_items FOR SELECT
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quote_items' AND policyname = 'Users can insert quote items in their organization'
    ) THEN
        CREATE POLICY "Users can insert quote items in their organization"
          ON public.quote_items FOR INSERT
          WITH CHECK (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quote_items' AND policyname = 'Users can update their organization''s quote items'
    ) THEN
        CREATE POLICY "Users can update their organization's quote items"
          ON public.quote_items FOR UPDATE
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quote_items' AND policyname = 'Users can delete their organization''s quote items'
    ) THEN
        CREATE POLICY "Users can delete their organization's quote items"
          ON public.quote_items FOR DELETE
          USING (organization_id = public.get_user_organization_id());
    END IF;
END $$;

-- Politiques RLS pour les bons de livraison
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'delivery_notes' AND policyname = 'Users can view their organization''s delivery notes'
    ) THEN
        CREATE POLICY "Users can view their organization's delivery notes"
          ON public.delivery_notes FOR SELECT
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'delivery_notes' AND policyname = 'Users can insert delivery notes in their organization'
    ) THEN
        CREATE POLICY "Users can insert delivery notes in their organization"
          ON public.delivery_notes FOR INSERT
          WITH CHECK (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'delivery_notes' AND policyname = 'Users can update their organization''s delivery notes'
    ) THEN
        CREATE POLICY "Users can update their organization's delivery notes"
          ON public.delivery_notes FOR UPDATE
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'delivery_notes' AND policyname = 'Users can delete their organization''s delivery notes'
    ) THEN
        CREATE POLICY "Users can delete their organization's delivery notes"
          ON public.delivery_notes FOR DELETE
          USING (organization_id = public.get_user_organization_id());
    END IF;
END $$;

-- Politiques RLS pour les lignes de bon de livraison
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'delivery_note_items' AND policyname = 'Users can view their organization''s delivery note items'
    ) THEN
        CREATE POLICY "Users can view their organization's delivery note items"
          ON public.delivery_note_items FOR SELECT
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'delivery_note_items' AND policyname = 'Users can insert delivery note items in their organization'
    ) THEN
        CREATE POLICY "Users can insert delivery note items in their organization"
          ON public.delivery_note_items FOR INSERT
          WITH CHECK (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'delivery_note_items' AND policyname = 'Users can update their organization''s delivery note items'
    ) THEN
        CREATE POLICY "Users can update their organization's delivery note items"
          ON public.delivery_note_items FOR UPDATE
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'delivery_note_items' AND policyname = 'Users can delete their organization''s delivery note items'
    ) THEN
        CREATE POLICY "Users can delete their organization's delivery note items"
          ON public.delivery_note_items FOR DELETE
          USING (organization_id = public.get_user_organization_id());
    END IF;
END $$;

-- Politiques RLS pour les avoirs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'credit_notes' AND policyname = 'Users can view their organization''s credit notes'
    ) THEN
        CREATE POLICY "Users can view their organization's credit notes"
          ON public.credit_notes FOR SELECT
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'credit_notes' AND policyname = 'Users can insert credit notes in their organization'
    ) THEN
        CREATE POLICY "Users can insert credit notes in their organization"
          ON public.credit_notes FOR INSERT
          WITH CHECK (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'credit_notes' AND policyname = 'Users can update their organization''s credit notes'
    ) THEN
        CREATE POLICY "Users can update their organization's credit notes"
          ON public.credit_notes FOR UPDATE
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'credit_notes' AND policyname = 'Users can delete their organization''s credit notes'
    ) THEN
        CREATE POLICY "Users can delete their organization's credit notes"
          ON public.credit_notes FOR DELETE
          USING (organization_id = public.get_user_organization_id());
    END IF;
END $$;

-- Politiques RLS pour les lignes d'avoirs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'credit_note_items' AND policyname = 'Users can view their organization''s credit note items'
    ) THEN
        CREATE POLICY "Users can view their organization's credit note items"
          ON public.credit_note_items FOR SELECT
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'credit_note_items' AND policyname = 'Users can insert credit note items in their organization'
    ) THEN
        CREATE POLICY "Users can insert credit note items in their organization"
          ON public.credit_note_items FOR INSERT
          WITH CHECK (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'credit_note_items' AND policyname = 'Users can update their organization''s credit note items'
    ) THEN
        CREATE POLICY "Users can update their organization's credit note items"
          ON public.credit_note_items FOR UPDATE
          USING (organization_id = public.get_user_organization_id());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'credit_note_items' AND policyname = 'Users can delete their organization''s credit note items'
    ) THEN
        CREATE POLICY "Users can delete their organization's credit note items"
          ON public.credit_note_items FOR DELETE
          USING (organization_id = public.get_user_organization_id());
    END IF;
END $$;
