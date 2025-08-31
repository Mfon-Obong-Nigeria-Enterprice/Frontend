// hooks/useSetting.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchProducts,
  updateProductPrice
} from '@/lib/api';
import type { 
  Product,  
  ProductUpdatePricePayload
} from '@/types/types';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000 // 5 minutes
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

// Remove non-existent settings hooks since you don't have settings API
// export const useSystemSettings = () => { ... } - REMOVE THIS
// export const useUpdateSystemSettings = () => { ... } - REMOVE THIS

// Remove aliases too
// export const useSettings = useSystemSettings; - REMOVE
// export const useUpdateSettings = useUpdateSystemSettings; - REMOVE