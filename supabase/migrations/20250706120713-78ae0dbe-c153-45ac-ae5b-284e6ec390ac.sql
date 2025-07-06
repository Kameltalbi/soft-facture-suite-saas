-- Ajouter le champ is_signed aux tables de documents pour gérer l'état de signature
ALTER TABLE public.invoices ADD COLUMN is_signed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.quotes ADD COLUMN is_signed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.delivery_notes ADD COLUMN is_signed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.credit_notes ADD COLUMN is_signed BOOLEAN DEFAULT FALSE;