import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useInventoryStore } from "@/stores/useInventoryStore";

export default function useTransactionWithCategories() {
  const transactions = useTransactionsStore((state) => state.transactions);
  const products = useInventoryStore((state) => state.products);

  if (!transactions) return [];

  return transactions.flatMap((txn) =>
    (txn.items || []).map((item) => {
      const productInfo = products?.find((p) => p._id === item.productId);
      return {
        ...item,
        category: productInfo?.categoryId || "Uncategorized",
        createdAt: txn.createdAt,
        transactionId: txn._id,
        transactionType: txn.type,
        clientName: txn.clientName || txn.walkInClientName,
      };
    })
  );
}
