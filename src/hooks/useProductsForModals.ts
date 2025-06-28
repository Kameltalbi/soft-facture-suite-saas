
import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';

export interface ProductForModal {
  id: string;
  name: string;
  description: string | null;
  unit_price: number;
  tax_rate: number;
  unit: string | null;
}

export function useProductsForModals() {
  const { products, loading } = useProducts();
  const [productsForModal, setProductsForModal] = useState<ProductForModal[]>([]);

  useEffect(() => {
    if (products) {
      const convertedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        unit_price: product.price,
        tax_rate: product.tax_rate || 0,
        unit: product.unit
      }));
      setProductsForModal(convertedProducts);
    }
  }, [products]);

  return {
    products: productsForModal,
    loading
  };
}
