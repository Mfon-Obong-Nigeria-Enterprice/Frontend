// @/providers/AppProvider.tsx
import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

import {
  getAllProducts,
  getAllProductsByBranch,
} from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { getAllClients } from "@/services/clientService";
import {
  getAllTransactions,
  getTransactionByUserId,
  getTransactionsByBranch,
} from "@/services/transactionService";
import { getAllBranches } from "@/services/branchService";
import { getAllUsers } from "@/services/userService";
import { getSystemActivityLogs } from "@/services/activityLogService";

import { useInventoryStore } from "@/stores/useInventoryStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useClientStore } from "@/stores/useClientStore";
import { useBranchStore } from "@/stores/useBranchStore";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useActivityLogsStore } from "@/stores/useActivityLogsStore";

const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: isAuthLoading } = useAuthStore();

  // Get store setters only
  const setProducts = useInventoryStore((state) => state.setProducts);
  const setCategories = useInventoryStore((state) => state.setCategories);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const setUsers = useUserStore((state) => state.setUsers);
  const setClients = useClientStore((state) => state.setClients);
  const setBranches = useBranchStore((state) => state.setBranches);
  const setActivities = useActivityLogsStore((state) => state.setActivities);

  // Helper function to check if user should have access to admin features
  // FIXED: Super admin and other high-level roles should have access
  const isSuperAdminOrHigher =
    user?.role && !["STAFF", "ADMIN"].includes(user.role);

  // Branch-level users (STAFF and ADMIN)
  const isBranchUser = user?.role === "STAFF" || user?.role === "ADMIN";

  // Categories query - always enabled
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Products query - branch-aware
  const productsQuery = useQuery({
    queryKey: ["products", user?.role, user?.branchId],
    queryFn: () => {
      if (isBranchUser && user?.branchId) {
        // Branch users see only their branch products
        return getAllProductsByBranch();
      }
      // Super admin sees all products
      return getAllProducts();
    },
    enabled: !isAuthLoading && !!user?.role,
  });

  // Transactions query - role and branch aware
  const transactionsQuery = useQuery({
    queryKey: ["transactions", user?.role, user?.branchId, user?.id],
    queryFn: () => {
      if (user?.role === "STAFF") {
        // Staff sees only their own transactions
        return getTransactionByUserId();
      }

      if (user?.role === "ADMIN" && user?.branchId) {
        // Admin sees all transactions in their branch
        return getTransactionsByBranch();
      }

      // Super admin sees all transactions
      return getAllTransactions();
    },
    enabled: !isAuthLoading && !!user?.role,
  });

  // Clients query - always enabled once auth loads
  const clientsQuery = useQuery({
    queryKey: ["clients", user?.role, user?.branchId],
    queryFn: getAllClients,
    enabled: !isAuthLoading,
  });

  // Branches query - only for super admin and higher roles
  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: getAllBranches,
    enabled: !isAuthLoading && !!user && isSuperAdminOrHigher,
  });

  // Users query - only for super admin and higher roles
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled: !isAuthLoading && !!user && isSuperAdminOrHigher,
  });

  // Activities query - adjust based on role
  const activitiesQuery = useQuery({
    queryKey: ["activities", user?.role],
    queryFn: getSystemActivityLogs,
    enabled: !isAuthLoading && !!user && user.role !== "STAFF", // All except STAFF can see activities
  });

  // Sync data to stores when available
  useEffect(() => {
    if (categoriesQuery.data && categoriesQuery.isSuccess) {
      setCategories(categoriesQuery.data);
    }
  }, [
    categoriesQuery.data,
    categoriesQuery.dataUpdatedAt,
    categoriesQuery.isSuccess,
    setCategories,
  ]);

  useEffect(() => {
    if (productsQuery.data && productsQuery.isSuccess) {
      setProducts(productsQuery.data);
    }
  }, [
    productsQuery.data,
    productsQuery.dataUpdatedAt,
    productsQuery.isSuccess,
    setProducts,
  ]);

  useEffect(() => {
    if (transactionsQuery.data && transactionsQuery.isSuccess) {
      console.log(
        "Setting transactions:",
        transactionsQuery.data.length,
        "items"
      );
      setTransactions(transactionsQuery.data);
    }
  }, [
    transactionsQuery.data,
    transactionsQuery.dataUpdatedAt,
    transactionsQuery.isSuccess,
    setTransactions,
  ]);

  useEffect(() => {
    if (clientsQuery.data && clientsQuery.isSuccess) {
      setClients(clientsQuery.data);
    }
  }, [
    clientsQuery.data,
    clientsQuery.dataUpdatedAt,
    clientsQuery.isSuccess,
    setClients,
  ]);

  useEffect(() => {
    if (branchesQuery.data && branchesQuery.isSuccess && isSuperAdminOrHigher) {
      setBranches(branchesQuery.data);
    }
  }, [
    branchesQuery.data,
    branchesQuery.dataUpdatedAt,
    branchesQuery.isSuccess,
    isSuperAdminOrHigher,
    setBranches,
  ]);

  useEffect(() => {
    if (usersQuery.data && usersQuery.isSuccess && isSuperAdminOrHigher) {
      setUsers(usersQuery.data);
    }
  }, [
    usersQuery.data,
    usersQuery.dataUpdatedAt,
    usersQuery.isSuccess,
    setUsers,
    isSuperAdminOrHigher,
  ]);

  useEffect(() => {
    if (activitiesQuery.data && activitiesQuery.isSuccess) {
      setActivities(activitiesQuery.data);
    }
  }, [
    activitiesQuery.data,
    activitiesQuery.dataUpdatedAt,
    activitiesQuery.isSuccess,
    setActivities,
  ]);

  return <>{children}</>;
};

// Main App Provider that wraps everything
export const AppProviderOptimized = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppDataProvider>{children}</AppDataProvider>
    </QueryClientProvider>
  );
};

// Keep the old export for backward compatibility
export { AppProviderOptimized as AppProvider };
