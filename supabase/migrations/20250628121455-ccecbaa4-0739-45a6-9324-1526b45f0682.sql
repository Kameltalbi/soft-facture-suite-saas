
-- Ajouter une colonne amount_paid à la table invoices si elle n'existe pas
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS amount_paid numeric DEFAULT 0;

-- Créer la fonction RPC pour récupérer les données de recouvrement
CREATE OR REPLACE FUNCTION public.get_recouvrement_data(sel_year integer, sel_month integer)
RETURNS TABLE (
  id uuid,
  invoice_number text,
  client_id uuid,
  client_name text,
  date date,
  amount_total numeric,
  amount_paid numeric,
  status text,
  days_late integer
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.invoice_number,
    i.client_id,
    c.name as client_name,
    i.date,
    i.total_amount as amount_total,
    COALESCE(i.amount_paid, 0) as amount_paid,
    CASE
      WHEN COALESCE(i.amount_paid, 0) >= i.total_amount THEN 'payée'
      WHEN COALESCE(i.amount_paid, 0) > 0 THEN 'partiellement payée'
      ELSE 'non payée'
    END as status,
    CASE
      WHEN COALESCE(i.amount_paid, 0) >= i.total_amount THEN NULL
      ELSE EXTRACT(day FROM CURRENT_DATE - i.date)::integer
    END as days_late
  FROM public.invoices i
  JOIN public.clients c ON c.id = i.client_id
  WHERE i.organization_id = get_user_organization_id()
    AND EXTRACT(year FROM i.date) = sel_year
    AND (sel_month IS NULL OR EXTRACT(month FROM i.date) = sel_month);
END;
$$;
