import { useCallback, useState } from "react";

const usePagination = (totalItems: number, itemsPerPage: number = 4) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );
  //
  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [goToPage, currentPage]);
  //
  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [goToPage, currentPage]);
  //
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    resetPage,
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
};

export default usePagination;
