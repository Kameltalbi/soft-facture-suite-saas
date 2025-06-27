
-- Table des clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'France',
  vat_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des produits/services
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT DEFAULT 'pièce',
  stock_quantity INTEGER DEFAULT 0,
  category TEXT,
  sku TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des factures
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  invoice_number TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, invoice_number)
);

-- Table des lignes de facture
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des devis
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  quote_number TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, quote_number)
);

-- Table des lignes de devis
CREATE TABLE public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des bons de livraison
CREATE TABLE public.delivery_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  delivery_number TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  delivery_address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'partial')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, delivery_number)
);

-- Table des lignes de bon de livraison
CREATE TABLE public.delivery_note_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  delivery_note_id UUID REFERENCES public.delivery_notes(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  delivered_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'partial')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_note_items ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les clients
CREATE POLICY "Users can view their organization's clients"
  ON public.clients FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert clients in their organization"
  ON public.clients FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's clients"
  ON public.clients FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's clients"
  ON public.clients FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les produits
CREATE POLICY "Users can view their organization's products"
  ON public.products FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert products in their organization"
  ON public.products FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's products"
  ON public.products FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's products"
  ON public.products FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les factures
CREATE POLICY "Users can view their organization's invoices"
  ON public.invoices FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert invoices in their organization"
  ON public.invoices FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's invoices"
  ON public.invoices FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's invoices"
  ON public.invoices FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les lignes de facture
CREATE POLICY "Users can view their organization's invoice items"
  ON public.invoice_items FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert invoice items in their organization"
  ON public.invoice_items FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's invoice items"
  ON public.invoice_items FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's invoice items"
  ON public.invoice_items FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les devis
CREATE POLICY "Users can view their organization's quotes"
  ON public.quotes FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert quotes in their organization"
  ON public.quotes FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's quotes"
  ON public.quotes FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's quotes"
  ON public.quotes FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les lignes de devis
CREATE POLICY "Users can view their organization's quote items"
  ON public.quote_items FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert quote items in their organization"
  ON public.quote_items FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's quote items"
  ON public.quote_items FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's quote items"
  ON public.quote_items FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les bons de livraison
CREATE POLICY "Users can view their organization's delivery notes"
  ON public.delivery_notes FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert delivery notes in their organization"
  ON public.delivery_notes FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's delivery notes"
  ON public.delivery_notes FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's delivery notes"
  ON public.delivery_notes FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques RLS pour les lignes de bon de livraison
CREATE POLICY "Users can view their organization's delivery note items"
  ON public.delivery_note_items FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert delivery note items in their organization"
  ON public.delivery_note_items FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's delivery note items"
  ON public.delivery_note_items FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's delivery note items"
  ON public.delivery_note_items FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Index pour améliorer les performances
CREATE INDEX idx_clients_organization_id ON public.clients(organization_id);
CREATE INDEX idx_products_organization_id ON public.products(organization_id);
CREATE INDEX idx_invoices_organization_id ON public.invoices(organization_id);
CREATE INDEX idx_invoice_items_organization_id ON public.invoice_items(organization_id);
CREATE INDEX idx_quotes_organization_id ON public.quotes(organization_id);
CREATE INDEX idx_quote_items_organization_id ON public.quote_items(organization_id);
CREATE INDEX idx_delivery_notes_organization_id ON public.delivery_notes(organization_id);
CREATE INDEX idx_delivery_note_items_organization_id ON public.delivery_note_items(organization_id);
