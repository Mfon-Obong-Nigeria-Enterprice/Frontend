// import { useEffect, type ReactNode } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getAllProducts,
//   getAllProductsByBranch,
// } from "@/services/productService";
// import { getAllCategories } from "@/services/categoryService";
// import { getAllClients } from "@/services/clientService";
// import {
//   getAllTransactions,
//   getTransactionByUserId,
//   getTransactionsByBranch,
// } from "@/services/transactionService";
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

//   const categoriesQuery = useQuery({
//     queryKey: ["categories"],
//     queryFn: getAllCategories,
//   });

//   // Use appropriate endpoint based on user role
//   const productsQuery = useQuery({
//     queryKey: ["products", user?.role, user?.branchId],
//     queryFn: () => {
//       if (user?.role === "ADMIN" || user?.role === "STAFF") {
//         // Use branch endpoint - interceptors will add branchId automatically
//         return getAllProductsByBranch();
//       }
//       // Use all products endpoint for super admin
//       return getAllProducts();
//     },
//     enabled: !!user?.role, // Only need user role, interceptor handles branchId
//   });

//   const transactionsQuery = useQuery({
//     queryKey: ["transactions", user?.role, user?.branchId, user?.id],
//     queryFn: () => {
//       if (user?.role === "STAFF") {
//         return getTransactionByUserId();
//       }

//       if (user?.role === "ADMIN") {
//         return getTransactionsByBranch();
//       }
//       return getAllTransactions();
//     },
//   });

//   const clientsQuery = useQuery({
//     queryKey: ["clients"],
//     queryFn: getAllClients,
//   });

//   // Only fetch branches for super admin roles
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
//     if (categoriesQuery.data) {
//       setCategories(categoriesQuery.data);
//     }
//   }, [categoriesQuery.dataUpdatedAt, setCategories]);

//   useEffect(() => {
//     if (productsQuery.isSuccess && productsQuery.data) {
//       setProducts(productsQuery.data);
//     }
//   }, [productsQuery.isSuccess, productsQuery.data, setProducts]);

//   useEffect(() => {
//     if (transactionsQuery.isSuccess && transactionsQuery.data?.length > 0) {
//       setTransactions(transactionsQuery.data);
//     }
//   }, [transactionsQuery.dataUpdatedAt, setTransactions]);

//   useEffect(() => {
//     if (clientsQuery.data) {
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
//     console.log("users query data:", usersQuery.data);
//     if (
//       usersQuery.data &&
//       usersQuery.data.length > 0 &&
//       user?.role !== "STAFF" &&
//       user?.role !== "ADMIN"
//     ) {
//       setUsers(usersQuery.data);
//       console.log("Setting users in store:", usersQuery.data);
//     }
//   }, [usersQuery.dataUpdatedAt, setUsers, user?.role]);

//   return <>{children}</>;
// };

// // Export the recommended version
// export { AppProviderOptimized as AppProvider };
// // import { useEffect, type ReactNode } from "react";
// // import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
// // import {
// //   getAllProducts,
// //   getAllProductsByBranch,
// // } from "@/services/productService";
// // import { getAllCategories } from "@/services/categoryService";
// // import { getAllClients } from "@/services/clientService";
// // import { getAllTransactions } from "@/services/transactionService";
// // import { getAllBranches } from "@/services/branchService";
// // import { getAllUsers } from "@/services/userService";
// // import { useInventoryStore } from "@/stores/useInventoryStore";
// // import { useTransactionsStore } from "@/stores/useTransactionStore";
// // import { useClientStore } from "@/stores/useClientStore";
// // import { useBranchStore } from "@/stores/useBranchStore";
// // import { useUserStore } from "@/stores/useUserStore";
// // import { useAuthStore } from "@/stores/useAuthStore";

// // export const AppProviderOptimized = ({ children }: { children: ReactNode }) => {
// //   const { user } = useAuthStore();

// //   // Get store setters only
// //   const setProducts = useInventoryStore((state) => state.setProducts);
// //   const setCategories = useInventoryStore((state) => state.setCategories);
// //   const setTransactions = useTransactionsStore(
// //     (state) => state.setTransactions
// //   );
// //   const setUsers = useUserStore((state) => state.setUsers);
// //   const setClients = useClientStore((state) => state.setClients);
// //   const setBranches = useBranchStore((state) => state.setBranches);

// //   const categoriesQuery = useSuspenseQuery({
// //     queryKey: ["categories"],
// //     queryFn: getAllCategories,
// //   });

// //   // fetch products based on role
// //   const productsQuery = useQuery({
// //     queryKey: ["products"],
// //     // queryKey: ["products", user?.role, user?.branchId],
// //     queryFn: () => {
// //       if (user?.role === "ADMIN" || user?.role === "STAFF") {
// //         return getAllProductsByBranch(user.branchId);
// //       }
// //       return getAllProducts();
// //     },
// //     enabled: !!user?.role && !!user?.branchId, // only run when user exists
// //   });
// //   // const productsQuery = useQuery({
// //   //   queryKey: ["products"],
// //   //   // queryKey: ["products", user?.role, user?.branchId],
// //   //   queryFn: () => {
// //   //     if (user?.role === "ADMIN" || user?.role === "STAFF") {
// //   //       return getAllProductsByBranch(user.branchId);
// //   //     }
// //   //     return getAllProducts();
// //   //   },
// //   //   // enabled: !!user?.role && !!user?.branchId, // only run when user exists
// //   // });

// //   // const { data } = useQuery({
// //   //   queryKey: ["products", user?.role, user?.branchId],
// //   //   queryFn: () => getAllProducts(user!.role, user!.branchId),
// //   //   enabled: !!user?.role && !!user?.branchId, // only run when defined
// //   // });

// //   const transactionsQuery = useSuspenseQuery({
// //     queryKey: ["transactions"],
// //     queryFn: getAllTransactions,
// //   });

// //   const clientsQuery = useSuspenseQuery({
// //     queryKey: ["clients"],
// //     queryFn: getAllClients,
// //   });

// //   const branchesQuery = useQuery({
// //     queryKey: ["branches"],
// //     queryFn: getAllBranches,
// //     enabled: user?.role !== "STAFF" && user?.role !== "ADMIN",
// //   });

// //   const usersQuery = useQuery({
// //     queryKey: ["users"],
// //     queryFn: getAllUsers,
// //     enabled: user?.role !== "STAFF" && user?.role !== "ADMIN",
// //   });

// //   // Sync immediately when data is successfully fetched
// //   useEffect(() => {
// //     if (categoriesQuery.data?.length > 0) {
// //       setCategories(categoriesQuery.data);
// //     }
// //   }, [categoriesQuery.dataUpdatedAt, setCategories]);

// //   useEffect(() => {
// //     if (productsQuery.data?.length > 0) {
// //       setProducts(productsQuery.data);
// //     }
// //   }, [productsQuery.dataUpdatedAt, setProducts]);

// //   useEffect(() => {
// //     if (transactionsQuery.data?.length > 0) {
// //       setTransactions(transactionsQuery.data);
// //     }
// //   }, [transactionsQuery.dataUpdatedAt, setTransactions]);

// //   useEffect(() => {
// //     if (clientsQuery.data ?? []) {
// //       setClients(clientsQuery.data);
// //     }
// //   }, [clientsQuery.dataUpdatedAt, setClients]);

// //   useEffect(() => {
// //     if (
// //       branchesQuery.data &&
// //       branchesQuery?.data?.length > 0 &&
// //       user?.role !== "STAFF" &&
// //       user?.role !== "ADMIN"
// //     ) {
// //       setBranches(branchesQuery.data);
// //     }
// //   }, [branchesQuery.dataUpdatedAt, setBranches, user?.role]);

// //   useEffect(() => {
// //     if (
// //       usersQuery.data &&
// //       usersQuery.data.length > 0 &&
// //       user?.role !== "STAFF" &&
// //       user?.role !== "ADMIN"
// //     ) {
// //       setUsers(usersQuery.data);
// //     }
// //   }, [usersQuery.dataUpdatedAt, setUsers]);
// //   return <>{children}</>;
// // };

// // // Export the recommended version
// // export { AppProviderOptimized as AppProvider };

// // // export const AppProvider = ({ children }: { children: ReactNode }) => {
// // //   const { setProducts, setCategories } = useInventoryStore();
// // //   const { setTransactions } = useTransactionsStore();
// // //   const { setClients } = useClientStore();
// // //   // const { setUsers } = useUserStore();
// // //   const { setBranches } = useBranchStore();
// // //   const { user } = useAuthStore();
// // //   const inventoryStore = useInventoryStore();
// // //   const transactionStore = useTransactionsStore();
// // //   const clientStore = useClientStore();
// // //   const branchStore = useBranchStore();

// // //   const { data: categories = [] } = useSuspenseQuery({
// // //     queryKey: ["categories"],
// // //     queryFn: getAllCategories,
// // //   });

// // //   const { data: products = [] } = useSuspenseQuery({
// // //     queryKey: ["products"],
// // //     queryFn: getAllProducts,
// // //   });

// // //   const { data: transactions = [] } = useSuspenseQuery({
// // //     queryKey: ["transactions"],
// // //     queryFn: getAllTransactions,
// // //   });

// // //   const { data: clients = [] } = useSuspenseQuery({
// // //     queryKey: ["clients"],
// // //     queryFn: getAllClients,
// // //   });
// // //   const { data: branches = [] } = useQuery({
// // //     queryKey: ["branches"],
// // //     queryFn: getAllBranches,
// // //     enabled: user?.role !== "STAFF",
// // //   });

// // //   // const { data: users } = useQuery({
// // //   //   queryKey: ["users"],
// // //   //   queryFn: getAllUsers,
// // //   // });

// // //   // save to zustand store
// // //   useEffect(() => {
// // //     // if (products) setProducts(products);
// // //     // if (categories) setCategories(categories);
// // //     // if (transactions) setTransactions(transactions);
// // //     // if (clients) setClients(clients);
// // //     // if (branches && user?.role !== "STAFF") setBranches(branches);
// // //     if (products && products !== inventoryStore.products) {
// // //       inventoryStore.setProducts(products);
// // //     }
// // //     if (categories && categories !== inventoryStore.categories) {
// // //       inventoryStore.setCategories(categories);
// // //     }
// // //     if (transactions && transactions !== transactionStore.transactions) {
// // //       transactionStore.setTransactions(transactions);
// // //     }
// // //     if (clients && clients !== clientStore.clients) {
// // //       clientStore.setClients(clients);
// // //     }
// // //     if (branches && branchStore.branches !== branches) {
// // //       branchStore.setBranches(branches);
// // //     }
// // //   }, [products, categories, transactions, clients, branches]);

// // //   return <>{children}</>;
// // // };

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

  // Sync immediately when data is successfully fetched
  // useEffect(() => {
  //   console.log("Auth state:", {
  //     user: user?.role,
  //     isAuthLoading,
  //     shouldFetchUsers: !isAuthLoading && !!user && isAdminOrSuperAdmin,
  //     usersQueryEnabled: usersQuery.fetchStatus,
  //     usersQueryData: usersQuery.data,
  //   });
  // }, [user, isAuthLoading, usersQuery.data, usersQuery.fetchStatus]);

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
    // console.log("Users query effect:", {
    //   data: usersQuery.data,
    //   isSuccess: usersQuery.isSuccess,
    //   shouldSetUsers: isAdminOrSuperAdmin,
    //   userRole: user?.role,
    // });

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
