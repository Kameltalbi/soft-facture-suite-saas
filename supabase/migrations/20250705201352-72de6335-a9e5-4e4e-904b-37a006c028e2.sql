-- Add foreign key constraints to exchange_rates table
ALTER TABLE public.exchange_rates 
ADD CONSTRAINT exchange_rates_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.exchange_rates 
ADD CONSTRAINT exchange_rates_from_currency_id_fkey 
FOREIGN KEY (from_currency_id) REFERENCES public.currencies(id) ON DELETE CASCADE;

ALTER TABLE public.exchange_rates 
ADD CONSTRAINT exchange_rates_to_currency_id_fkey 
FOREIGN KEY (to_currency_id) REFERENCES public.currencies(id) ON DELETE CASCADE;