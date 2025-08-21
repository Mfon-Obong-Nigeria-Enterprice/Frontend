import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchSettings, 
  updateSettings,
  fetchProducts,
  updateProductPrice
} from '@/lib/api';
import type{ 
  Settings, 
  Product,  
  ProductUpdatePricePayload, 
  UpdateSettingsPayload 
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
    }
  });
};

export const useSettings = () => {
  return useQuery<Settings, Error>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: Infinity,
    // Move error handling to a separate useEffect if needed
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation<Settings, Error, UpdateSettingsPayload, { previousSettings?: Settings }>({
    mutationFn: updateSettings,
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ['settings'] });
      const previousSettings = queryClient.getQueryData<Settings>(['settings']);
      
      queryClient.setQueryData<Settings>(['settings'], (old) => 
        old ? { ...old, ...newSettings } : { ...newSettings } as Settings
      );

      return { previousSettings };
    },
    onError: (error, _, context) => {
      console.error('Error updating settings:', error);
      if (context?.previousSettings) {
        queryClient.setQueryData(['settings'], context.previousSettings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });
};