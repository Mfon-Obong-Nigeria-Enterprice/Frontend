// src/hooks/useProducts.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getAllProducts,
  getAllProductsByBranch,
  createProduct,
  updateProduct,
  updateProductPrice
} from '@/services/productService';
import type { 
  Product,  
  NewProduct,
  ProductUpdatePricePayload
} from '@/types/types';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export const useProductsByBranch = (branchId?: string) => {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'branch', branchId],
    queryFn: () => getAllProductsByBranch(branchId),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, NewProduct>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: string; data: Partial<NewProduct> }>({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProductPrice = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, ProductUpdatePricePayload>({
    mutationFn: updateProductPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });
};