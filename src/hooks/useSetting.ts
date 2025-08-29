import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchSettings, 
  updateSettings,
  fetchProducts,
  updateProductPrice
} from '@/lib/api';
import type { 
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
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });
};

export const useSystemSettings = () => {
  return useQuery<Settings, Error>({
    queryKey: ['system-settings'],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Settings, Error, UpdateSettingsPayload, { previousSettings?: Settings }>({
    mutationFn: updateSettings,
    onMutate: async (newSettings) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['system-settings'] });
      
      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData<Settings>(['system-settings']);
      
      // Optimistically update to the new value
      queryClient.setQueryData<Settings>(['system-settings'], (old) => {
        if (!old) return newSettings as Settings;
        return { ...old, ...newSettings };
      });

      return { previousSettings };
    },
    onError: (error, _, context) => {
      if (!import.meta.env.PROD) {
        console.error('Error updating settings:', error);
      }
      // Rollback to the previous value on error
      if (context?.previousSettings) {
        queryClient.setQueryData(['system-settings'], context.previousSettings);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    }
  });
};

// Alias for backward compatibility
export const useSettings = useSystemSettings;
export const useUpdateSettings = useUpdateSystemSettings;