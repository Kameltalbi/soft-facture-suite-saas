
-- Activer RLS sur toutes les tables métier (certaines l'ont peut-être déjà)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes pour éviter les conflits
-- Categories
DROP POLICY IF EXISTS "Users can view their organization's categories" ON public.categories;
DROP POLICY IF EXISTS "Users can insert categories in their organization" ON public.categories;
DROP POLICY IF EXISTS "Users can update their organization's categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their organization's categories" ON public.categories;

-- Clients
DROP POLICY IF EXISTS "Users can view their organization's clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert clients in their organization" ON public.clients;
DROP POLICY IF EXISTS "Users can update their organization's clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their organization's clients" ON public.clients;

-- Credit note items
DROP POLICY IF EXISTS "Users can view their organization's credit note items" ON public.credit_note_items;
DROP POLICY IF EXISTS "Users can insert credit note items in their organization" ON public.credit_note_items;
DROP POLICY IF EXISTS "Users can update their organization's credit note items" ON public.credit_note_items;
DROP POLICY IF EXISTS "Users can delete their organization's credit note items" ON public.credit_note_items;

-- Credit notes
DROP POLICY IF EXISTS "Users can view their organization's credit notes" ON public.credit_notes;
DROP POLICY IF EXISTS "Users can insert credit notes in their organization" ON public.credit_notes;
DROP POLICY IF EXISTS "Users can update their organization's credit notes" ON public.credit_notes;
DROP POLICY IF EXISTS "Users can delete their organization's credit notes" ON public.credit_notes;

-- Delivery note items
DROP POLICY IF EXISTS "Users can view their organization's delivery note items" ON public.delivery_note_items;
DROP POLICY IF EXISTS "Users can insert delivery note items in their organization" ON public.delivery_note_items;
DROP POLICY IF EXISTS "Users can update their organization's delivery note items" ON public.delivery_note_items;
DROP POLICY IF EXISTS "Users can delete their organization's delivery note items" ON public.delivery_note_items;

-- Delivery notes
DROP POLICY IF EXISTS "Users can view their organization's delivery notes" ON public.delivery_notes;
DROP POLICY IF EXISTS "Users can insert delivery notes in their organization" ON public.delivery_notes;
DROP POLICY IF EXISTS "Users can update their organization's delivery notes" ON public.delivery_notes;
DROP POLICY IF EXISTS "Users can delete their organization's delivery notes" ON public.delivery_notes;

-- Invoice items
DROP POLICY IF EXISTS "Users can view their organization's invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can insert invoice items in their organization" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can update their organization's invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can delete their organization's invoice items" ON public.invoice_items;

-- Invoices
DROP POLICY IF EXISTS "Users can view their organization's invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can insert invoices in their organization" ON public.invoices;
DROP POLICY IF EXISTS "Users can update their organization's invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete their organization's invoices" ON public.invoices;

-- Organizations
DROP POLICY IF EXISTS "Users can view their organization" ON public.organizations;
DROP POLICY IF EXISTS "Admins can update their organization" ON public.organizations;

-- Products
DROP POLICY IF EXISTS "Users can view their organization's products" ON public.products;
DROP POLICY IF EXISTS "Users can insert products in their organization" ON public.products;
DROP POLICY IF EXISTS "Users can update their organization's products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their organization's products" ON public.products;

-- Profiles
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles in their organization" ON public.profiles;

-- Purchase order items
DROP POLICY IF EXISTS "Users can view their organization's purchase order items" ON public.purchase_order_items;
DROP POLICY IF EXISTS "Users can insert purchase order items in their organization" ON public.purchase_order_items;
DROP POLICY IF EXISTS "Users can update their organization's purchase order items" ON public.purchase_order_items;
DROP POLICY IF EXISTS "Users can delete their organization's purchase order items" ON public.purchase_order_items;

-- Purchase orders
DROP POLICY IF EXISTS "Users can view their organization's purchase orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can insert purchase orders in their organization" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can update their organization's purchase orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can delete their organization's purchase orders" ON public.purchase_orders;

-- Quote items
DROP POLICY IF EXISTS "Users can view their organization's quote items" ON public.quote_items;
DROP POLICY IF EXISTS "Users can insert quote items in their organization" ON public.quote_items;
DROP POLICY IF EXISTS "Users can update their organization's quote items" ON public.quote_items;
DROP POLICY IF EXISTS "Users can delete their organization's quote items" ON public.quote_items;

-- Quotes
DROP POLICY IF EXISTS "Users can view their organization's quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can insert quotes in their organization" ON public.quotes;
DROP POLICY IF EXISTS "Users can update their organization's quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can delete their organization's quotes" ON public.quotes;

-- Saved reports
DROP POLICY IF EXISTS "Users can view their organization's saved reports" ON public.saved_reports;
DROP POLICY IF EXISTS "Users can insert saved reports in their organization" ON public.saved_reports;
DROP POLICY IF EXISTS "Users can update their organization's saved reports" ON public.saved_reports;
DROP POLICY IF EXISTS "Users can delete their organization's saved reports" ON public.saved_reports;

-- Stock movements
DROP POLICY IF EXISTS "Users can view their organization's stock movements" ON public.stock_movements;
DROP POLICY IF EXISTS "Users can insert stock movements in their organization" ON public.stock_movements;
DROP POLICY IF EXISTS "Users can update their organization's stock movements" ON public.stock_movements;
DROP POLICY IF EXISTS "Users can delete their organization's stock movements" ON public.stock_movements;

-- Suppliers
DROP POLICY IF EXISTS "Users can view their organization's suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can insert suppliers in their organization" ON public.suppliers;
DROP POLICY IF EXISTS "Users can update their organization's suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can delete their organization's suppliers" ON public.suppliers;

-- Maintenant créer toutes les politiques
-- Politiques pour la table categories
CREATE POLICY "Users can view their organization's categories"
  ON public.categories FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert categories in their organization"
  ON public.categories FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's categories"
  ON public.categories FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's categories"
  ON public.categories FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Politiques pour la table clients
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

-- Politiques pour la table credit_note_items
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

-- Politiques pour la table credit_notes
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

-- Politiques pour la table delivery_note_items
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

-- Politiques pour la table delivery_notes
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

-- Politiques pour la table invoice_items
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

-- Politiques pour la table invoices
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

-- Politiques pour la table organizations (politiques spéciales)
CREATE POLICY "Users can view their organization"
  ON public.organizations FOR SELECT
  USING (id = public.get_user_organization_id());

CREATE POLICY "Admins can update their organization"
  ON public.organizations FOR UPDATE
  USING (
    id = public.get_user_organization_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND organization_id = public.get_user_organization_id()
      AND role = 'admin'
    )
  );

-- Politiques pour la table products
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

-- Politiques pour la table profiles (politiques spéciales)
CREATE POLICY "Users can view profiles in their organization"
  ON public.profiles FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update profiles in their organization"
  ON public.profiles FOR UPDATE
  USING (
    organization_id = public.get_user_organization_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND organization_id = public.get_user_organization_id()
      AND role = 'admin'
    )
  );

-- Politiques pour la table purchase_order_items
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

-- Politiques pour la table purchase_orders
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

-- Politiques pour la table quote_items
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

-- Politiques pour la table quotes
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

-- Politiques pour la table saved_reports
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

-- Politiques pour la table stock_movements
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

-- Politiques pour la table suppliers
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
