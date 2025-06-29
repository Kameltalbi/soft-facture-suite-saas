
-- Enable RLS on delivery_notes table
ALTER TABLE public.delivery_notes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view delivery notes from their organization
CREATE POLICY "Users can view delivery notes from their organization" 
ON public.delivery_notes 
FOR SELECT 
USING (organization_id = get_user_organization_id());

-- Create policy to allow users to insert delivery notes for their organization
CREATE POLICY "Users can create delivery notes for their organization" 
ON public.delivery_notes 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id());

-- Create policy to allow users to update delivery notes from their organization
CREATE POLICY "Users can update delivery notes from their organization" 
ON public.delivery_notes 
FOR UPDATE 
USING (organization_id = get_user_organization_id());

-- Create policy to allow users to delete delivery notes from their organization
CREATE POLICY "Users can delete delivery notes from their organization" 
ON public.delivery_notes 
FOR DELETE 
USING (organization_id = get_user_organization_id());

-- Enable RLS on delivery_note_items table
ALTER TABLE public.delivery_note_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view delivery note items from their organization
CREATE POLICY "Users can view delivery note items from their organization" 
ON public.delivery_note_items 
FOR SELECT 
USING (organization_id = get_user_organization_id());

-- Create policy to allow users to insert delivery note items for their organization
CREATE POLICY "Users can create delivery note items for their organization" 
ON public.delivery_note_items 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id());

-- Create policy to allow users to update delivery note items from their organization
CREATE POLICY "Users can update delivery note items from their organization" 
ON public.delivery_note_items 
FOR UPDATE 
USING (organization_id = get_user_organization_id());

-- Create policy to allow users to delete delivery note items from their organization
CREATE POLICY "Users can delete delivery note items from their organization" 
ON public.delivery_note_items 
FOR DELETE 
USING (organization_id = get_user_organization_id());
