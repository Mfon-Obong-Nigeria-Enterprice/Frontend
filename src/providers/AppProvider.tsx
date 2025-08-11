import { useEffect, type ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
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

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { setProducts, setCategories } = useInventoryStore();
  const { setTransactions } = useTransactionsStore();
  const { setClients } = useClientStore();
  // const { setUsers } = useUserStore();
  const { setBranches } = useBranchStore();
  const { data: categories = [] } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { data: products = [] } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { data: transactions = [] } = useSuspenseQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
  });

  const { data: clients = [] } = useSuspenseQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
  });
  const { data: branches = [] } = useSuspenseQuery({
    queryKey: ["branches"],
    queryFn: getAllBranches,
  });

  // const { data: users } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: getAllUsers,
  // });

  // save to zustand store
  useEffect(() => {
    if (products) setProducts(products);
    if (categories) setCategories(categories);
    if (transactions) setTransactions(transactions);
    if (clients) setClients(clients);
    if (branches) setBranches(branches);
  }, [
    products,
    categories,
    transactions,
    clients,
    branches,
    setProducts,
    setCategories,
    setTransactions,
    setClients,
    setBranches,
  ]);

  return <>{children}</>;
};
