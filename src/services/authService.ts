import api from "./baseApi";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
