-- Supprimer les éléments des factures spécifiques
DELETE FROM public.invoice_items 
WHERE invoice_id IN (
  SELECT id FROM public.invoices 
  WHERE invoice_number IN ('FAC-2025-00095', 'FAC-2025-00096')
);

-- Supprimer les paiements associés à ces factures
DELETE FROM public.payments 
WHERE invoice_id IN (
  SELECT id FROM public.invoices 
  WHERE invoice_number IN ('FAC-2025-00095', 'FAC-2025-00096')
);

-- Supprimer les factures elles-mêmes
DELETE FROM public.invoices 
WHERE invoice_number IN ('FAC-2025-00095', 'FAC-2025-00096');