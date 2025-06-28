
-- Enable RLS on quotes table
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view quotes from their organization
CREATE POLICY "Users can view quotes from their organization" 
ON public.quotes 
FOR SELECT 
USING (organization_id = get_user_organization_id());

-- Create policy to allow users to insert quotes for their organization
CREATE POLICY "Users can create quotes for their organization" 
ON public.quotes 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id());

-- Create policy to allow users to update quotes from their organization
CREATE POLICY "Users can update quotes from their organization" 
ON public.quotes 
FOR UPDATE 
USING (organization_id = get_user_organization_id());

-- Create policy to allow users to delete quotes from their organization
CREATE POLICY "Users can delete quotes from their organization" 
ON public.quotes 
FOR DELETE 
USING (organization_id = get_user_organization_id());

-- Enable RLS on quote_items table
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view quote items from their organization
CREATE POLICY "Users can view quote items from their organization" 
ON public.quote_items 
FOR SELECT 
USING (organization_id = get_user_organization_id());

-- Create policy to allow users to insert quote items for their organization
CREATE POLICY "Users can create quote items for their organization" 
ON public.quote_items 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id());

-- Create policy to allow users to update quote items from their organization
CREATE POLICY "Users can update quote items from their organization" 
ON public.quote_items 
FOR UPDATE 
USING (organization_id = get_user_organization_id());

-- Create policy to allow users to delete quote items from their organization
CREATE POLICY "Users can delete quote items from their organization" 
ON public.quote_items 
FOR DELETE 
USING (organization_id = get_user_organization_id());

-- Enable RLS on clients table (if not already enabled)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Users can view clients from their organization" 
ON public.clients 
FOR SELECT 
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create clients for their organization" 
ON public.clients 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update clients from their organization" 
ON public.clients 
FOR UPDATE 
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete clients from their organization" 
ON public.clients 
FOR DELETE 
USING (organization_id = get_user_organization_id());

-- Enable RLS on products table (if not already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Users can view products from their organization" 
ON public.products 
FOR SELECT 
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create products for their organization" 
ON public.products 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update products from their organization" 
ON public.products 
FOR UPDATE 
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete products from their organization" 
ON public.products 
FOR DELETE 
USING (organization_id = get_user_organization_id());
