import { useTransactionsStore } from "@/stores/useTransactionStore";

type Suggestion = {
  id: string;
  label: string;
};

export const useTransactionSearch = ({
  type = "client", // "client" or "invoice"
  pageSize = 10, // default page size
  onPageChange, // function to move to new page
}) => {
  const { transactions } = useTransactionsStore();

  const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
    const lowerQuery = query.toLowerCase();

    const matched = (transactions ?? []).filter((t) => {
      if (type === "client") {
        const name = t.clientId?.name || t.walkInClient?.name || "";
        return name.toLowerCase().includes(lowerQuery);
      } else if (type === "invoice") {
        return (t.invoiceNumber ?? "").toLowerCase().includes(lowerQuery);
      }
      return false;
    });

    return matched.map((t) => ({
      id: t._id,
      label:
        type === "client"
          ? t.clientId?.name || t.walkInClient?.name || ""
          : t.invoiceNumber ?? "",
    }));
  };

  const onSelect = (selected) => {
    const match = (transactions ?? []).find((t) => {
      const value =
        type === "client"
          ? t.clientId?.name || t.walkInClient?.name || ""
          : t.invoiceNumber;
      return (value ?? "").toLowerCase() === selected.label.toLowerCase();
    });

    if (!match) return;

    // get index for pagination
    const index = (transactions ?? []).findIndex((t) => t._id === match._id);
    const targetPage = Math.floor(index / pageSize) + 1;

    // Move to page if onPageChange is provided
    if (onPageChange) {
      onPageChange(targetPage);
    }

    // Wait for DOM to update
    setTimeout(() => {
      const target = document.getElementById(`invoice-${match.invoiceNumber}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("ring-2", "ring-blue-400", "rounded-md");
        setTimeout(() => {
          target.classList.remove("ring-2", "ring-blue-400", "rounded-md");
        }, 3000);
      }
    }, 200); // wait for page switch
  };

  return { fetchSuggestions, onSelect };
};
