/**
 * Tab-specific session management utilities
 * Prevents session bleeding between different users in different browser tabs
 */

// Generate a unique tab ID for session isolation
export const generateTabId = (): string => {
  return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create a tab-specific ID
export const getTabId = (): string => {
  let tabId = sessionStorage.getItem('tabId');
  if (!tabId) {
    tabId = generateTabId();
    sessionStorage.setItem('tabId', tabId);
  }
  return tabId;
};

// Create session storage adapter for Zustand persist middleware
export const createTabSessionStorage = () => ({
  getItem: (name: string) => {
    const str = sessionStorage.getItem(name);
    return str ? JSON.parse(str) : null;
  },
  setItem: (name: string, value: unknown) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => sessionStorage.removeItem(name),
});

// Clear all tab-specific session data (useful for logout)
export const clearTabSessionData = (): void => {
  const currentTabId = getTabId();
  
  // List of all store keys that use tab-specific storage
  const storeKeys = [
    `auth-storage-${currentTabId}`,
    `client-store-${currentTabId}`,
    `settings-storage-${currentTabId}`,
    `notification-storage-${currentTabId}`,
    `health-storage-${currentTabId}`,
    `column-settings-fallback-${currentTabId}`,
  ];
  
  // Clear all tab-specific store data
  storeKeys.forEach(key => {
    sessionStorage.removeItem(key);
  });
  
  // Also clear the tab ID itself to force regeneration on next login
  sessionStorage.removeItem('tabId');
  
  console.log('🧹 Tab session data cleared for tab:', currentTabId);
};