-- Add is_fiscal_stamp column to custom_taxes table
ALTER TABLE public.custom_taxes 
ADD COLUMN is_fiscal_stamp boolean NOT NULL DEFAULT false;