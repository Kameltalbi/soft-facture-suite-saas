
-- Table des fournisseurs
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'France',
  vat_number TEXT,
  business_sector TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des avoirs (credit notes)
CREATE TABLE public.credit_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  credit_note_number TEXT NOT NULL,
  original_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  reason TEXT,
  subtotal NUMERIC DEFAULT 0 NOT NULL,
  tax_amount NUMERIC DEFAULT 0 NOT NULL,
  total_amount NUMERIC DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'applied', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, credit_note_number)
);

-- Table des lignes d'avoirs
CREATE TABLE public.credit_note_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  credit_note_id UUID REFERENCES public.credit_notes(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1 NOT NULL,
  unit_price NUMERIC DEFAULT 0 NOT NULL,
  tax_rate NUMERIC DEFAULT 0 NOT NULL,
  total_price NUMERIC DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des mouvements de stock
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'inventory')),
  quantity NUMERIC NOT NULL,
  unit_cost NUMERIC DEFAULT 0,
  reference_type TEXT CHECK (reference_type IN ('invoice', 'delivery_note', 'purchase_order', 'adjustment', 'inventory')),
  reference_id UUID,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Table des bons de commande fournisseurs
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  purchase_order_number TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  expected_delivery_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'received', 'cancelled')),
  subtotal NUMERIC DEFAULT 0 NOT NULL,
  tax_amount NUMERIC DEFAULT 0 NOT NULL,
  total_amount NUMERIC DEFAULT 0 NOT NULL,
  discount NUMERIC DEFAULT 0,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, purchase_order_number)
);

-- Table des lignes de bons de commande
CREATE TABLE public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1 NOT NULL,
  unit_price NUMERIC DEFAULT 0 NOT NULL,
  tax_rate NUMERIC DEFAULT 0 NOT NULL,
  total_price NUMERIC DEFAULT 0 NOT NULL,
  received_quantity NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des rapports sauvegardés
CREATE TABLE public.saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('revenue', 'client_revenue', 'product_ranking', 'year_comparison', 'monthly_revenue', 'custom')),
  parameters JSONB,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les fournisseurs
CREATE POLICY "Users can view their organization's suppliers"
  ON public.suppliers FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert suppliers in their organization"
  ON public.suppliers FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's suppliers"
  ON public.suppliers FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's suppliers"
  ON public.suppliers FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les avoirs
CREATE POLICY "Users can view their organization's credit notes"
  ON public.credit_notes FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert credit notes in their organization"
  ON public.credit_notes FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's credit notes"
  ON public.credit_notes FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's credit notes"
  ON public.credit_notes FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les lignes d'avoirs
CREATE POLICY "Users can view their organization's credit note items"
  ON public.credit_note_items FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert credit note items in their organization"
  ON public.credit_note_items FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's credit note items"
  ON public.credit_note_items FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's credit note items"
  ON public.credit_note_items FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les mouvements de stock
CREATE POLICY "Users can view their organization's stock movements"
  ON public.stock_movements FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert stock movements in their organization"
  ON public.stock_movements FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's stock movements"
  ON public.stock_movements FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's stock movements"
  ON public.stock_movements FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les bons de commande
CREATE POLICY "Users can view their organization's purchase orders"
  ON public.purchase_orders FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert purchase orders in their organization"
  ON public.purchase_orders FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's purchase orders"
  ON public.purchase_orders FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's purchase orders"
  ON public.purchase_orders FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les lignes de bons de commande
CREATE POLICY "Users can view their organization's purchase order items"
  ON public.purchase_order_items FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert purchase order items in their organization"
  ON public.purchase_order_items FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's purchase order items"
  ON public.purchase_order_items FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's purchase order items"
  ON public.purchase_order_items FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les rapports sauvegardés
CREATE POLICY "Users can view their organization's saved reports"
  ON public.saved_reports FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert saved reports in their organization"
  ON public.saved_reports FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's saved reports"
  ON public.saved_reports FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's saved reports"
  ON public.saved_reports FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Index pour améliorer les performances
CREATE INDEX idx_suppliers_organization_id ON public.suppliers(organization_id);
CREATE INDEX idx_credit_notes_organization_id ON public.credit_notes(organization_id);
CREATE INDEX idx_credit_notes_client_id ON public.credit_notes(client_id);
CREATE INDEX idx_credit_note_items_organization_id ON public.credit_note_items(organization_id);
CREATE INDEX idx_credit_note_items_credit_note_id ON public.credit_note_items(credit_note_id);
CREATE INDEX idx_stock_movements_organization_id ON public.stock_movements(organization_id);
CREATE INDEX idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX idx_purchase_orders_organization_id ON public.purchase_orders(organization_id);
CREATE INDEX idx_purchase_orders_supplier_id ON public.purchase_orders(supplier_id);
CREATE INDEX idx_purchase_order_items_organization_id ON public.purchase_order_items(organization_id);
CREATE INDEX idx_purchase_order_items_purchase_order_id ON public.purchase_order_items(purchase_order_id);
CREATE INDEX idx_saved_reports_organization_id ON public.saved_reports(organization_id);

-- Insérer quelques fournisseurs par défaut pour chaque organisation existante
INSERT INTO public.suppliers (organization_id, name, contact_name, email, business_sector, status)
SELECT 
  o.id,
  supplier_name,
  supplier_contact,
  supplier_email,
  supplier_sector,
  'active'
FROM public.organizations o
CROSS JOIN (
  VALUES 
    ('TechSupply Pro', 'Jean Dupont', 'contact@techsupply.fr', 'Informatique'),
    ('Office Solutions', 'Marie Martin', 'info@officesolutions.fr', 'Bureau'),
    ('Formation Expert', 'Pierre Durand', 'contact@formationexpert.fr', 'Formation'),
    ('Design Studio', 'Sophie Blanc', 'hello@designstudio.fr', 'Design')
) AS default_suppliers(supplier_name, supplier_contact, supplier_email, supplier_sector);
