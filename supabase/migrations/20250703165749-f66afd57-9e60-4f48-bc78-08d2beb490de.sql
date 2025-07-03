-- Add decimal_places column to currencies table
ALTER TABLE public.currencies 
ADD COLUMN decimal_places INTEGER NOT NULL DEFAULT 2;