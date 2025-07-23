import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { getAllTransactions } from "@/services/transactionService";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const { setProducts, setCategories } = useInventoryStore();
  const { setTransactions } = useTransactionsStore();

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

  // save to zustand store
  useEffect(() => {
    setProducts(products);
    setCategories(categories);
    setTransactions(transactions);
  }, [
    products,
    categories,
    setProducts,
    setCategories,
    transactions,
    setTransactions,
  ]);

  return <>{children}</>;
};
