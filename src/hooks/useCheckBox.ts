
import { useState, useCallback } from 'react';

export const useCheckboxState = (initialState: Record<string, boolean> = {}) => {
  const [checkboxStates, setCheckboxStates] = useState(initialState);

  const updateCheckboxState = useCallback((key: string, value: boolean) => {
    setCheckboxStates(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetCheckboxStates = useCallback((newState: Record<string, boolean>) => {
    setCheckboxStates(newState);
  }, []);

  return {
    checkboxStates,
    updateCheckboxState,
    resetCheckboxStates
  };
};