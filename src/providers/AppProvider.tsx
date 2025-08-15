import { useEffect, type ReactNode } from "react";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { getAllClients } from "@/services/clientService";
import { getAllTransactions } from "@/services/transactionService";
import { getAllBranches } from "@/services/branchService";
// import { getAllUsers } from "@/services/userService";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useClientStore } from "@/stores/useClientStore";
import { useBranchStore } from "@/stores/useBranchStore";
// import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";

export const AppProviderOptimized = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthStore();

  // Get store setters only
  const setProducts = useInventoryStore((state) => state.setProducts);
  const setCategories = useInventoryStore((state) => state.setCategories);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const setClients = useClientStore((state) => state.setClients);
  const setBranches = useBranchStore((state) => state.setBranches);

  const categoriesQuery = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const productsQuery = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const transactionsQuery = useSuspenseQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
  });

  const clientsQuery = useSuspenseQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
  });

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: getAllBranches,
    enabled: user?.role !== "STAFF",
  });

  // Sync immediately when data is successfully fetched
  useEffect(() => {
    if (categoriesQuery.data?.length > 0) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.dataUpdatedAt, setCategories]);

  useEffect(() => {
    if (productsQuery.data?.length > 0) {
      setProducts(productsQuery.data);
    }
  }, [productsQuery.dataUpdatedAt, setProducts]);

  useEffect(() => {
    if (transactionsQuery.data?.length > 0) {
      setTransactions(transactionsQuery.data);
    }
  }, [transactionsQuery.dataUpdatedAt, setTransactions]);

  useEffect(() => {
    if (clientsQuery.data ?? []) {
      setClients(clientsQuery.data);
    }
  }, [clientsQuery.dataUpdatedAt, setClients]);

  useEffect(() => {
    if (
      branchesQuery.data &&
      branchesQuery?.data?.length > 0 &&
      user?.role !== "STAFF"
    ) {
      setBranches(branchesQuery.data);
    }
  }, [branchesQuery.dataUpdatedAt, setBranches, user?.role]);

  return <>{children}</>;
};

// Export the recommended version
export { AppProviderOptimized as AppProvider };
// export const AppProvider = ({ children }: { children: ReactNode }) => {
//   const { setProducts, setCategories } = useInventoryStore();
//   const { setTransactions } = useTransactionsStore();
//   const { setClients } = useClientStore();
//   // const { setUsers } = useUserStore();
//   const { setBranches } = useBranchStore();
//   const { user } = useAuthStore();
//   const inventoryStore = useInventoryStore();
//   const transactionStore = useTransactionsStore();
//   const clientStore = useClientStore();
//   const branchStore = useBranchStore();

//   const { data: categories = [] } = useSuspenseQuery({
//     queryKey: ["categories"],
//     queryFn: getAllCategories,
//   });

//   const { data: products = [] } = useSuspenseQuery({
//     queryKey: ["products"],
//     queryFn: getAllProducts,
//   });

//   const { data: transactions = [] } = useSuspenseQuery({
//     queryKey: ["transactions"],
//     queryFn: getAllTransactions,
//   });

//   const { data: clients = [] } = useSuspenseQuery({
//     queryKey: ["clients"],
//     queryFn: getAllClients,
//   });
//   const { data: branches = [] } = useQuery({
//     queryKey: ["branches"],
//     queryFn: getAllBranches,
//     enabled: user?.role !== "STAFF",
//   });

//   // const { data: users } = useQuery({
//   //   queryKey: ["users"],
//   //   queryFn: getAllUsers,
//   // });

//   // save to zustand store
//   useEffect(() => {
//     // if (products) setProducts(products);
//     // if (categories) setCategories(categories);
//     // if (transactions) setTransactions(transactions);
//     // if (clients) setClients(clients);
//     // if (branches && user?.role !== "STAFF") setBranches(branches);
//     if (products && products !== inventoryStore.products) {
//       inventoryStore.setProducts(products);
//     }
//     if (categories && categories !== inventoryStore.categories) {
//       inventoryStore.setCategories(categories);
//     }
//     if (transactions && transactions !== transactionStore.transactions) {
//       transactionStore.setTransactions(transactions);
//     }
//     if (clients && clients !== clientStore.clients) {
//       clientStore.setClients(clients);
//     }
//     if (branches && branchStore.branches !== branches) {
//       branchStore.setBranches(branches);
//     }
//   }, [products, categories, transactions, clients, branches]);

//   return <>{children}</>;
// };
