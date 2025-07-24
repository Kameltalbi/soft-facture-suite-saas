-- Mettre à jour toutes les factures de 2024 comme payées
UPDATE public.invoices 
SET 
  status = 'paid',
  amount_paid = total_amount,
  updated_at = now()
WHERE 
  EXTRACT(year FROM date) = 2024
  AND status != 'paid';