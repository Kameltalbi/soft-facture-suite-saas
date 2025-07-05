-- Ajouter les nouveaux champs pour le paramétrage avancé des factures
ALTER TABLE public.invoices 
ADD COLUMN use_vat boolean DEFAULT true,
ADD COLUMN custom_taxes_used text[] DEFAULT '{}',
ADD COLUMN has_advance boolean DEFAULT false,
ADD COLUMN advance_amount numeric DEFAULT 0,
ADD COLUMN currency_id uuid REFERENCES public.currencies(id),
ADD COLUMN balance_due numeric DEFAULT 0;