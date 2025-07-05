-- Create exchange_rates table for managing fixed exchange rates
CREATE TABLE public.exchange_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  from_currency_id UUID NOT NULL,
  to_currency_id UUID NOT NULL,
  rate NUMERIC(10, 6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(organization_id, from_currency_id, to_currency_id)
);

-- Enable RLS
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their organization's exchange rates"
ON public.exchange_rates
FOR SELECT
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create exchange rates in their organization"
ON public.exchange_rates
FOR INSERT
WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update their organization's exchange rates"
ON public.exchange_rates
FOR UPDATE
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete their organization's exchange rates"
ON public.exchange_rates
FOR DELETE
USING (organization_id = get_user_organization_id());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_exchange_rates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_exchange_rates_updated_at
BEFORE UPDATE ON public.exchange_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_exchange_rates_updated_at();