
-- Add subscription and status fields to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'standard', 'premium')),
ADD COLUMN IF NOT EXISTS subscription_start DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS subscription_end DATE,
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Create organization_history table for tracking changes
CREATE TABLE IF NOT EXISTS public.organization_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on organization_history
ALTER TABLE public.organization_history ENABLE ROW LEVEL SECURITY;

-- Create policy for superadmins to view all organization history
CREATE POLICY "Superadmins can view all organization history" 
  ON public.organization_history 
  FOR SELECT 
  USING (true); -- We'll handle superadmin check in the application layer

-- Create policy for superadmins to insert organization history
CREATE POLICY "Superadmins can create organization history" 
  ON public.organization_history 
  FOR INSERT 
  WITH CHECK (true); -- We'll handle superadmin check in the application layer

-- Update organizations RLS to allow superadmin access
CREATE POLICY "Superadmins can view all organizations" 
  ON public.organizations 
  FOR SELECT 
  USING (true); -- We'll handle superadmin check in the application layer

CREATE POLICY "Superadmins can update all organizations" 
  ON public.organizations 
  FOR UPDATE 
  USING (true); -- We'll handle superadmin check in the application layer
