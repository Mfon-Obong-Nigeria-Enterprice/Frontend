/* eslint-disable @typescript-eslint/no-unused-vars */
// src/utils/authHelpers.ts
export const getCurrentUserRole = (): string | null => {
  try {
    // Get from auth store
    const authStorage = localStorage.getItem('auth-storage') || 
                        sessionStorage.getItem('auth-storage');
    
    if (authStorage) {
      const authState = JSON.parse(authStorage);
      return authState.state?.user?.role || null;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

export const canToggleMaintenance = (): boolean => {
  const userRole = getCurrentUserRole();
  return userRole === 'STAFF' || userRole === 'ADMIN' || userRole === 'MAINTAINER';
};