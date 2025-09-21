import { useEffect } from 'react';
import { useTransactionsStore } from '@/stores/useTransactionStore';
import { useClientStore } from '@/stores/useClientStore';

export const useRefreshData = () => {
  const { refreshTransactions } = useTransactionsStore();
  const { refreshClients } = useClientStore();

  useEffect(() => {
    const refreshData = async () => {
      try {
        await Promise.allSettled([
          refreshTransactions(),
          refreshClients()
        ]);
        
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    };

    refreshData();
  }, [refreshTransactions, refreshClients]);

  return { refreshTransactions, refreshClients };
};