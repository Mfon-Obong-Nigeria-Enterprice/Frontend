// src/lib/api.ts
import axios, { type AxiosResponse } from 'axios';
import type {
  Settings,
  Product,
  ApiResponse,
  ProductUpdatePricePayload,
  UpdateSettingsPayload,
} from '@/types/types';
import { toast } from 'sonner';

// Define AppSetupResponse type if not already imported
type AppSetupResponse = {
  settings: Settings;
  // add other properties if needed
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mfon-obong-enterprise.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'API request was not successful');
  }
  return response.data.data;
};

// Settings API
export const fetchSettings = async (): Promise<Settings> => {
  try {
    const response = await api.get<ApiResponse<AppSetupResponse>>('/app/setup');
    const data = handleApiResponse(response);
    return data.settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (payload: UpdateSettingsPayload): Promise<Settings> => {
  try {
    const response = await api.put<ApiResponse<Settings>>(
      '/app/setup/update', 
      payload
    );
    const data = handleApiResponse(response);
    toast.success('Settings updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// Products API
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateProductPrice = async (
  payload: ProductUpdatePricePayload
): Promise<Product> => {
  try {
    const response = await api.patch<ApiResponse<Product>>(
      `/products/${payload.productId}/price`,
      { price: payload.newPrice }
    );
    const data = handleApiResponse(response);
    toast.success('Product price updated successfully');
    return data;
  } catch (error) {
    console.error(`Error updating product ${payload.productId} price:`, error);
    throw error;
  }
};

export default api;