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
  const { user } = useAuthStore();

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

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Use appropriate endpoint based on user role
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
    enabled: !!user?.role, // Only need user role, interceptor handles branchId
  });

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
  });

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
  });

  // Only fetch branches for super admin roles
  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: getAllBranches,
    enabled: user?.role !== "STAFF" && user?.role !== "ADMIN",
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled: user?.role !== "STAFF" && user?.role !== "ADMIN",
  });

  const activitiesQuery = useQuery({
    queryKey: ["activities"],
    queryFn: getSystemActivityLogs,
    // enabled: user?.role !== "STAFF" && user?.role === "ADMIN",
  });

  // Sync immediately when data is successfully fetched
  useEffect(() => {
    if (categoriesQuery.data) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.data, categoriesQuery.dataUpdatedAt, setCategories]);

  useEffect(() => {
    if (productsQuery.isSuccess && productsQuery.data) {
      setProducts(productsQuery.data);
    }
  }, [productsQuery.isSuccess, productsQuery.data, setProducts]);

  useEffect(() => {
    if (transactionsQuery.isSuccess && transactionsQuery.data?.length > 0) {
      setTransactions(transactionsQuery.data);
    }
  }, [transactionsQuery.dataUpdatedAt, setTransactions, transactionsQuery.isSuccess, transactionsQuery.data]);

  useEffect(() => {
    if (clientsQuery.data) {
      setClients(clientsQuery.data);
    }
  }, [clientsQuery.data, clientsQuery.dataUpdatedAt, setClients]);

  useEffect(() => {
    if (
      branchesQuery.data &&
      branchesQuery?.data?.length > 0 &&
      user?.role !== "STAFF" &&
      user?.role !== "ADMIN"
    ) {
      setBranches(branchesQuery.data);
    }
  }, [branchesQuery.data, branchesQuery.dataUpdatedAt, setBranches, user?.role]);

  useEffect(() => {
    if (
      usersQuery.data &&
      usersQuery.data.length > 0 &&
      user?.role !== "STAFF" &&
      user?.role !== "ADMIN"
    ) {
      setUsers(usersQuery.data);
    }
  }, [usersQuery.dataUpdatedAt, setUsers, user?.role, usersQuery.data]);

  useEffect(() => {
    console.log("activity query data:", activitiesQuery.data);
    if (
      activitiesQuery.data
      // &&
      // user?.role !== "STAFF" &&
      // user?.role !== "ADMIN"
    ) {
      setActivities(activitiesQuery.data);
      console.log("setting activities in store", activitiesQuery);
    }
  }, [activitiesQuery, activitiesQuery.dataUpdatedAt, setActivities, user?.role]);

  return <>{children}</>;
};

// Export the recommended version
export { AppProviderOptimized as AppProvider };