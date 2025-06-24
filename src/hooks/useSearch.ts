import { useMemo, useState } from "react";

const useSearch = <T>(
  sales: T[],
  searchFields: (keyof T)[],
  initialQuery: string = ""
) => {
  //
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearchSale = useMemo(() => {
    if (!searchQuery.trim()) return sales;

    const query = searchQuery.toLowerCase();
    return sales.filter((sale) =>
      searchFields.some((field) =>
        String(sale[field]).toLowerCase().includes(query)
      )
    );
  }, [sales, searchQuery, searchFields]);

  //

  return {
    setSearchQuery,
    handleSearchSale,
    searchQuery,
  };
};

export default useSearch;
