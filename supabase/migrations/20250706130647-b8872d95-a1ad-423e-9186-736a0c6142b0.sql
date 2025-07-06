-- Ajouter le champ sales_channel à la table invoices
ALTER TABLE public.invoices 
ADD COLUMN sales_channel text DEFAULT 'local' CHECK (sales_channel IN ('local', 'export'));