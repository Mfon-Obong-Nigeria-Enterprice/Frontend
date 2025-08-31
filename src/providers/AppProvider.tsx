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
  }, [categoriesQuery.dataUpdatedAt, setCategories]);

  useEffect(() => {
    if (productsQuery.isSuccess && productsQuery.data) {
      setProducts(productsQuery.data);
    }
  }, [productsQuery.isSuccess, productsQuery.data, setProducts]);

  useEffect(() => {
    if (transactionsQuery.isSuccess && transactionsQuery.data?.length > 0) {
      setTransactions(transactionsQuery.data);
    }
  }, [transactionsQuery.dataUpdatedAt, setTransactions]);

  useEffect(() => {
    if (clientsQuery.data) {
      setClients(clientsQuery.data);
    }
  }, [clientsQuery.dataUpdatedAt, setClients]);

  useEffect(() => {
    if (
      branchesQuery.data &&
      branchesQuery?.data?.length > 0 &&
      user?.role !== "STAFF" &&
      user?.role !== "ADMIN"
    ) {
      setBranches(branchesQuery.data);
    }
  }, [branchesQuery.dataUpdatedAt, setBranches, user?.role]);

  useEffect(() => {
    if (
      usersQuery.data &&
      usersQuery.data.length > 0 &&
      user?.role !== "STAFF" &&
      user?.role !== "ADMIN"
    ) {
      setUsers(usersQuery.data);
    }
  }, [usersQuery.dataUpdatedAt, setUsers, user?.role]);

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
  }, [activitiesQuery.dataUpdatedAt, setActivities, user?.role]);

  return <>{children}</>;
};

// Export the recommended version
export { AppProviderOptimized as AppProvider };

// import { useEffect, type ReactNode } from "react";
// import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
// import {
//   getAllProducts,
//   getAllProductsByBranch,
// } from "@/services/productService";
// import { getAllCategories } from "@/services/categoryService";
// import { getAllClients } from "@/services/clientService";
// import { getAllTransactions } from "@/services/transactionService";
// import { getAllBranches } from "@/services/branchService";
// import { getAllUsers } from "@/services/userService";
// import { useInventoryStore } from "@/stores/useInventoryStore";
// import { useTransactionsStore } from "@/stores/useTransactionStore";
// import { useClientStore } from "@/stores/useClientStore";
// import { useBranchStore } from "@/stores/useBranchStore";
// import { useUserStore } from "@/stores/useUserStore";
// import { useAuthStore } from "@/stores/useAuthStore";

// export const AppProviderOptimized = ({ children }: { children: ReactNode }) => {
//   const { user } = useAuthStore();

//   // Get store setters only
//   const setProducts = useInventoryStore((state) => state.setProducts);
//   const setCategories = useInventoryStore((state) => state.setCategories);
//   const setTransactions = useTransactionsStore(
//     (state) => state.setTransactions
//   );
//   const setUsers = useUserStore((state) => state.setUsers);
//   const setClients = useClientStore((state) => state.setClients);
//   const setBranches = useBranchStore((state) => state.setBranches);

//   const categoriesQuery = useSuspenseQuery({
//     queryKey: ["categories"],
//     queryFn: getAllCategories,
//   });

//   // fetch products based on role
//   const productsQuery = useQuery({
//     queryKey: ["products"],
//     // queryKey: ["products", user?.role, user?.branchId],
//     queryFn: () => {
//       if (user?.role === "ADMIN" || user?.role === "STAFF") {
//         return getAllProductsByBranch(user.branchId);
//       }
//       return getAllProducts();
//     },
//     enabled: !!user?.role && !!user?.branchId, // only run when user exists
//   });
//   // const productsQuery = useQuery({
//   //   queryKey: ["products"],
//   //   // queryKey: ["products", user?.role, user?.branchId],
//   //   queryFn: () => {
//   //     if (user?.role === "ADMIN" || user?.role === "STAFF") {
//   //       return getAllProductsByBranch(user.branchId);
//   //     }
//   //     return getAllProducts();
//   //   },
//   //   // enabled: !!user?.role && !!user?.branchId, // only run when user exists
//   // });

//   // const { data } = useQuery({
//   //   queryKey: ["products", user?.role, user?.branchId],
//   //   queryFn: () => getAllProducts(user!.role, user!.branchId),
//   //   enabled: !!user?.role && !!user?.branchId, // only run when defined
//   // });

//   const transactionsQuery = useSuspenseQuery({
//     queryKey: ["transactions"],
//     queryFn: getAllTransactions,
//   });

//   const clientsQuery = useSuspenseQuery({
//     queryKey: ["clients"],
//     queryFn: getAllClients,
//   });

//   const branchesQuery = useQuery({
//     queryKey: ["branches"],
//     queryFn: getAllBranches,
//     enabled: user?.role !== "STAFF" && user?.role !== "ADMIN",
//   });

//   const usersQuery = useQuery({
//     queryKey: ["users"],
//     queryFn: getAllUsers,
//     enabled: user?.role !== "STAFF" && user?.role !== "ADMIN",
//   });

//   // Sync immediately when data is successfully fetched
//   useEffect(() => {
//     if (categoriesQuery.data?.length > 0) {
//       setCategories(categoriesQuery.data);
//     }
//   }, [categoriesQuery.dataUpdatedAt, setCategories]);

//   useEffect(() => {
//     if (productsQuery.data?.length > 0) {
//       setProducts(productsQuery.data);
//     }
//   }, [productsQuery.dataUpdatedAt, setProducts]);

//   useEffect(() => {
//     if (transactionsQuery.data?.length > 0) {
//       setTransactions(transactionsQuery.data);
//     }
//   }, [transactionsQuery.dataUpdatedAt, setTransactions]);

//   useEffect(() => {
//     if (clientsQuery.data ?? []) {
//       setClients(clientsQuery.data);
//     }
//   }, [clientsQuery.dataUpdatedAt, setClients]);

//   useEffect(() => {
//     if (
//       branchesQuery.data &&
//       branchesQuery?.data?.length > 0 &&
//       user?.role !== "STAFF" &&
//       user?.role !== "ADMIN"
//     ) {
//       setBranches(branchesQuery.data);
//     }
//   }, [branchesQuery.dataUpdatedAt, setBranches, user?.role]);

//   useEffect(() => {
//     if (
//       usersQuery.data &&
//       usersQuery.data.length > 0 &&
//       user?.role !== "STAFF" &&
//       user?.role !== "ADMIN"
//     ) {
//       setUsers(usersQuery.data);
//     }
//   }, [usersQuery.dataUpdatedAt, setUsers]);
//   return <>{children}</>;
// };

// // Export the recommended version
// export { AppProviderOptimized as AppProvider };

// // export const AppProvider = ({ children }: { children: ReactNode }) => {
// //   const { setProducts, setCategories } = useInventoryStore();
// //   const { setTransactions } = useTransactionsStore();
// //   const { setClients } = useClientStore();
// //   // const { setUsers } = useUserStore();
// //   const { setBranches } = useBranchStore();
// //   const { user } = useAuthStore();
// //   const inventoryStore = useInventoryStore();
// //   const transactionStore = useTransactionsStore();
// //   const clientStore = useClientStore();
// //   const branchStore = useBranchStore();

// //   const { data: categories = [] } = useSuspenseQuery({
// //     queryKey: ["categories"],
// //     queryFn: getAllCategories,
// //   });

// //   const { data: products = [] } = useSuspenseQuery({
// //     queryKey: ["products"],
// //     queryFn: getAllProducts,
// //   });

// //   const { data: transactions = [] } = useSuspenseQuery({
// //     queryKey: ["transactions"],
// //     queryFn: getAllTransactions,
// //   });

// //   const { data: clients = [] } = useSuspenseQuery({
// //     queryKey: ["clients"],
// //     queryFn: getAllClients,
// //   });
// //   const { data: branches = [] } = useQuery({
// //     queryKey: ["branches"],
// //     queryFn: getAllBranches,
// //     enabled: user?.role !== "STAFF",
// //   });

// //   // const { data: users } = useQuery({
// //   //   queryKey: ["users"],
// //   //   queryFn: getAllUsers,
// //   // });

// //   // save to zustand store
// //   useEffect(() => {
// //     // if (products) setProducts(products);
// //     // if (categories) setCategories(categories);
// //     // if (transactions) setTransactions(transactions);
// //     // if (clients) setClients(clients);
// //     // if (branches && user?.role !== "STAFF") setBranches(branches);
// //     if (products && products !== inventoryStore.products) {
// //       inventoryStore.setProducts(products);
// //     }
// //     if (categories && categories !== inventoryStore.categories) {
// //       inventoryStore.setCategories(categories);
// //     }
// //     if (transactions && transactions !== transactionStore.transactions) {
// //       transactionStore.setTransactions(transactions);
// //     }
// //     if (clients && clients !== clientStore.clients) {
// //       clientStore.setClients(clients);
// //     }
// //     if (branches && branchStore.branches !== branches) {
// //       branchStore.setBranches(branches);
// //     }
// //   }, [products, categories, transactions, clients, branches]);

// //   return <>{children}</>;
// // };
