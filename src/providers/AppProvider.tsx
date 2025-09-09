import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
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

export const AppProviderOptimized = ({ children }: { children: ReactNode }) => {
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
  const isAdminOrSuperAdmin =
    user?.role && !["STAFF", "ADMIN"].includes(user.role);

  // Categories query - always enabled
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Products query - wait for auth to load, then determine endpoint
  const productsQuery = useQuery({
    queryKey: ["products", user?.role, user?.branchId],
    queryFn: () => {
      if (user?.role === "ADMIN" || user?.role === "STAFF") {
        // Use branch endpoint - interceptors will add branchId automatically
        return getAllProductsByBranch();
      }
      // Use all products endpoint for super admin
      return getAllProducts();
    },
    enabled: !isAuthLoading && !!user?.role, // Wait for auth to load
  });

  // Transactions query - wait for auth to load, then determine endpoint
  const transactionsQuery = useQuery({
    queryKey: ["transactions", user?.role, user?.branchId, user?.id],
    queryFn: () => {
      if (user?.role === "STAFF") {
        return getTransactionByUserId();
      }

      if (user?.role === "ADMIN") {
        return getTransactionsByBranch();
      }
      return getAllTransactions();
    },
    enabled: !isAuthLoading && !!user?.role, // Wait for auth to load
  });

  // Clients query - always enabled once auth loads
  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
    enabled: !isAuthLoading, // Wait for auth to load
  });

  // Branches query - only for non-staff/admin users
  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: getAllBranches,
    enabled: !isAuthLoading && !!user && isAdminOrSuperAdmin,
  });

  // Users query - only for non-staff/admin users
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled: !isAuthLoading && !!user && isAdminOrSuperAdmin,
  });

  // Debug logging
  const activitiesQuery = useQuery({
    queryKey: ["activities"],
    queryFn: getSystemActivityLogs,
    // enabled: user?.role !== "STAFF" && user?.role === "ADMIN",
  });

  // Sync data to stores when available
  useEffect(() => {
    if (categoriesQuery.data && categoriesQuery.isSuccess) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.data, categoriesQuery.isSuccess, setCategories]);

  useEffect(() => {
    if (productsQuery.data && productsQuery.isSuccess) {
      setProducts(productsQuery.data);
    }
  }, [productsQuery.data, productsQuery.isSuccess, setProducts]);

  useEffect(() => {
    if (transactionsQuery.data && transactionsQuery.isSuccess) {
      setTransactions(transactionsQuery.data);
    }
  }, [transactionsQuery.data, transactionsQuery.isSuccess, setTransactions]);

  useEffect(() => {
    if (clientsQuery.data && clientsQuery.isSuccess) {
      setClients(clientsQuery.data);
    }
  }, [clientsQuery.data, clientsQuery.isSuccess, setClients]);

  useEffect(() => {
    if (branchesQuery.data && branchesQuery.isSuccess && isAdminOrSuperAdmin) {
      setBranches(branchesQuery.data);
    }
  }, [
    branchesQuery.data,
    branchesQuery.isSuccess,
    setBranches,
    isAdminOrSuperAdmin,
  ]);

  useEffect(() => {


    if (usersQuery.data && usersQuery.isSuccess && isAdminOrSuperAdmin) {
      if (
        usersQuery.data &&
        usersQuery.data.length > 0 &&
        user?.role !== "STAFF" &&
        user?.role !== "ADMIN"
      ) {
        setUsers(usersQuery.data);
      }
    }
  }, [
    usersQuery.data,
    usersQuery.isSuccess,
    setUsers,
    isAdminOrSuperAdmin,
    user?.role,
  ]);

  useEffect(() => {
    if (
      activitiesQuery.data
      // &&
      // user?.role !== "STAFF" &&
      // user?.role !== "ADMIN"
    ) {
      setActivities(activitiesQuery.data);
    }
  }, [activitiesQuery.dataUpdatedAt, setActivities, user?.role]);

  return <>{children}</>;
};

export { AppProviderOptimized as AppProvider };
