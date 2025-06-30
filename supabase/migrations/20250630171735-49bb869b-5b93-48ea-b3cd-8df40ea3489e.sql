
-- Ajouter le nouveau statut 'partially_paid' pour les factures avec paiements partiels
-- Mettre à jour les factures existantes qui ont un montant payé mais pas complètement payées
UPDATE public.invoices 
SET status = 'partially_paid' 
WHERE status = 'sent' 
AND amount_paid > 0 
AND amount_paid < total_amount;
