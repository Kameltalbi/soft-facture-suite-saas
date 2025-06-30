
-- Insérer les paramètres de numérotation par défaut pour les organisations qui n'en ont pas
INSERT INTO public.document_numberings (document_type, prefix, format, next_number, reset_frequency, organization_id)
SELECT 
  unnest(ARRAY['invoice', 'quote', 'delivery_note', 'credit']) as document_type,
  unnest(ARRAY['FACT-', 'DEVIS-', 'BON-', 'AVOIR-']) as prefix,
  'incremental' as format,
  unnest(ARRAY[1001, 2001, 3001, 4001]) as next_number,
  'yearly' as reset_frequency,
  o.id as organization_id
FROM public.organizations o
WHERE o.id NOT IN (
  SELECT DISTINCT organization_id 
  FROM public.document_numberings
);
