import { useEffect, type ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { useInventoryStore } from "@/stores/useInventoryStore";

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const { setProducts, setCategories } = useInventoryStore();
  const { data: categories } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { data: products } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  useEffect(() => {
    setProducts(products);
    setCategories(categories);
  }, [products, categories, setProducts, setCategories]);

  return <>{children}</>;
};
