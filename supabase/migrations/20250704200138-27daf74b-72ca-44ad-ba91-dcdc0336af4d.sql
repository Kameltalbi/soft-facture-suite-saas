-- Créer une table pour les paiements des factures
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  invoice_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their organization's payments" 
ON public.payments 
FOR SELECT 
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert payments in their organization" 
ON public.payments 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update their organization's payments" 
ON public.payments 
FOR UPDATE 
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete their organization's payments" 
ON public.payments 
FOR DELETE 
USING (organization_id = get_user_organization_id());

-- Add foreign key constraints
ALTER TABLE public.payments 
ADD CONSTRAINT payments_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE public.payments 
ADD CONSTRAINT payments_invoice_id_fkey 
FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);

-- Create function to update invoice amounts after payment
CREATE OR REPLACE FUNCTION public.update_invoice_amounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the invoice amount_paid
  UPDATE public.invoices 
  SET amount_paid = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.payments 
    WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
  ),
  status = CASE 
    WHEN (
      SELECT COALESCE(SUM(amount), 0) 
      FROM public.payments 
      WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
    ) >= total_amount THEN 'paid'
    WHEN (
      SELECT COALESCE(SUM(amount), 0) 
      FROM public.payments 
      WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
    ) > 0 THEN 'partially_paid'
    ELSE 'sent'
  END,
  updated_at = now()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_invoice_amounts_after_payment_insert
  AFTER INSERT ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoice_amounts();

CREATE TRIGGER update_invoice_amounts_after_payment_update
  AFTER UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoice_amounts();

CREATE TRIGGER update_invoice_amounts_after_payment_delete
  AFTER DELETE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoice_amounts();