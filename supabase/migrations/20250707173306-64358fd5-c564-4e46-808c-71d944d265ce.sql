-- Add subject field to invoices table
ALTER TABLE public.invoices 
ADD COLUMN subject TEXT;