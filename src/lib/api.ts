// src/lib/api.ts
import axios, { type AxiosResponse } from 'axios';
import type {
  Settings,
  Product,
  ApiResponse,
  ProductUpdatePricePayload,
  UpdateSettingsPayload} from '@/types/types';
import { toast } from 'sonner';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mfon-obong-enterprise.onrender.com/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API errors
api.interceptors.response.use(
  response => response,
  error => {
    if (!import.meta.env.PROD) {
      console.error('API Error:', error);
    }
    
    // Show user-friendly error messages
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Helper to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'API request failed');
  }
  return response.data.data;
};

// Since you don't have a settings API, we'll use localStorage as fallback
// Convert API settings to frontend format

// Convert frontend settings to API format

// Settings API - FALLBACK to localStorage since you don't have settings API
export const fetchSettings = async (): Promise<Settings> => {
  try {
    // Try to get from localStorage first
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    // Return default settings if nothing in localStorage
    const defaultSettings: Settings = {
      alerts: {
        lowStockAlerts: false,
        newProductNotifications: false,
        expirationReminders: false,
        clientsDebtsAlert: false,
        CustomThresholdAlerts: false,
        LargeBalanceAlertThreshold: false,
        PriceChangeNotification: false,
        dashboardNotification: false,
        emailNotification: false,
        inactivityAlerts: false,
        systemHealthAlerts: false,
        userLoginNotifications: false
      },
      system: {
        lowStockAlertThreshold: 15,
        maximumDiscount: 10,
        bulkDiscountThreshold: 10000,
        minimumPurchaseForBulkDiscount: 500,
        allowNegativeBalances: false,
        largeBalanceThreshold: 50000,
      },
      clientAccount: {
        defaultCreditLimit: 800000,
        inactivePeriodDays: 30,
      }
    };

    return defaultSettings;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('Error fetching settings:', error);
    }
    throw error;
  }
};

export const updateSettings = async (payload: UpdateSettingsPayload): Promise<Settings> => {
  try {
    // Get current settings
    const currentSettings = await fetchSettings();
    
    // Merge with new settings
    const updatedSettings: Settings = {
      ...currentSettings,
      ...payload,
      alerts: {
        ...currentSettings.alerts,
        ...payload.alerts,
      },
      system: {
        ...currentSettings.system,
        ...payload.system,
      },
      clientAccount: {
        ...currentSettings.clientAccount,
        ...payload.clientAccount,
      }
    };

    // Save to localStorage
    localStorage.setItem('app-settings', JSON.stringify(updatedSettings));
    
    toast.success('Settings updated successfully');
    return updatedSettings;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('Error updating settings:', error);
    }
    throw error;
  }
};

// Products API - Use your actual endpoints
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    const data = handleApiResponse(response);
    
    if (!Array.isArray(data)) {
      if (!import.meta.env.PROD) {
        console.error('Expected array of products but got:', data);
      }
      return [];
    }
    
    return data;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('Error fetching products:', error);
    }
    return [];
  }
};

export const updateProductPrice = async (payload: ProductUpdatePricePayload): Promise<Product> => {
  try {
    const response = await api.patch<ApiResponse<Product>>(
      `/products/${payload.productId}/update-price`,
      { price: payload.newPrice }
    );
    
    const data = handleApiResponse(response);
    toast.success('Product price updated successfully');
    return data;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error(`Error updating product price:`, error);
    }
    throw error;
  }
};

export default api;