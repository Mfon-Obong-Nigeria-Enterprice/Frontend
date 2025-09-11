// src/services/locationService.ts
import api from "./baseApi"; 

export type CreateLocationPayload = {
  locationType?: string; 
  name?: string;         
  address: string;
  email?: string;
  phone?: string;
};

export type LocationResponse = {
  _id: string;
  name?: string;
  locationType?: string;
  address: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createLocation = async (
  payload: CreateLocationPayload
): Promise<LocationResponse> => {
  // console.log("🌐 Making API call to /branches with payload:", payload);
  // console.log("🌐 Full API URL:", `${import.meta.env.VITE_API_URL || 'https://mfon-obong-enterprise.onrender.com/api'}/branches`);
  
  // Map UI fields to API expected schema
  const apiPayload = {
    name: payload.name || payload.locationType, // API expects `name`
    address: payload.address,
    email: payload.email || undefined,
    phone: payload.phone || undefined,
  };

  // console.log("🌐 Final payload sent to API:", apiPayload);

  const res = await api.post("/branches", apiPayload); // endpoint from Postman
  
  // console.log("🌐 API Response:", res.data);
  // console.log("🌐 Response status:", res.status);
  
  return res.data;
};
