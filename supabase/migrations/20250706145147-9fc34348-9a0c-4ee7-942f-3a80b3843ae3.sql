-- Add currency_id column to custom_taxes table
ALTER TABLE public.custom_taxes 
ADD COLUMN currency_id UUID;

-- Add foreign key constraint to currencies table
ALTER TABLE public.custom_taxes 
ADD CONSTRAINT custom_taxes_currency_id_fkey 
FOREIGN KEY (currency_id) REFERENCES public.currencies(id) ON DELETE SET NULL;