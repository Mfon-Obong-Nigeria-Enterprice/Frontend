import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { getAllClients } from "@/services/clientService";
import { getAllTransactions } from "@/services/transactionService";
import { getAllUsers } from "@/services/userService";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useClientStore } from "@/stores/useClientStore";
import { useUserStore } from "@/stores/useUserStore";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { setProducts, setCategories } = useInventoryStore();
  const { setTransactions } = useTransactionsStore();
  const { setClients } = useClientStore();
  const { setUsers } = useUserStore();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
  });

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // save to zustand store
  useEffect(() => {
    setProducts(products ?? []);
    setCategories(categories ?? []);
    setTransactions(transactions ?? []);
    setClients(clients ?? []);
    setUsers(users ?? []);
  }, [
    products,
    categories,
    transactions,
    clients,
    users,
    setProducts,
    setCategories,
    setTransactions,
    setClients,
    setUsers,
  ]);

  return <>{children}</>;
};
