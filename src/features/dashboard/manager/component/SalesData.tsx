import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import useSearch from "@/hooks/useSearch";
import usePagination from "@/hooks/usePagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SalesTransaction {
  id: string;
  client: string;
  amount: number;
  time: string;
  items: string;
  staff: string;
  availableItems: string[];
}

const recentSales: SalesTransaction[] = [
  {
    id: "1",
    client: "Walk-in client",
    amount: -12750,
    time: "11:40 AM",
    items: "5x Nails,",
    staff: "John Doe",
    availableItems: [
      "Portland Cement (50), Steel Rod (30)",
      "Red Bricks (500), Portland Cement (25)",
      "Steel Rod (100), Common Nails (10)",
    ],
  },
  {
    id: "2",
    client: "Akpan construction",
    amount: +150000,
    time: "11:25 AM",
    items: "10x Cement,",
    staff: "Jane Smith",
    availableItems: [
      "Portland Cement (50), Steel Rod (30)",
      "Red Bricks (500), Portland Cement (25)",
      "Steel Rod (100), Common Nails (10)",
    ],
  },
  {
    id: "3",
    client: "Ade properties",
    amount: +225000,
    time: "9:15 AM",
    items: "25x steel Rods",
    staff: "Sarah Wilson",
    availableItems: [
      "Portland Cement (50), Steel Rod (30)",
      "Red Bricks (500), Portland Cement (25)",
      "Steel Rod (100), Common Nails (10)",
    ],
  },
  {
    id: "4",
    client: "Ade Enterprises",
    amount: -7500,
    time: "8:10 AM",
    items: "3x Nails",
    staff: "Mike Johnson",
    availableItems: [
      "Portland Cement (50), Steel Rod (30)",
      "Red Bricks (500), Portland Cement (25)",
      "Steel Rod (100), Common Nails (10)",
    ],
  },
  {
    id: "5",
    client: "Mfong properties",
    amount: +117500,
    time: "10:10 AM",
    items: "10x Paints",
    staff: "Aniekan",
    availableItems: [
      "Portland Cement (50), Steel Rod (30)",
      "Red Bricks (500), Portland Cement (25)",
      "Steel Rod (100), Common Nails (10)",
    ],
  },
];

const SalesData: React.FC = () => {
  const [selectedState, setSelectedState] = useState<SalesTransaction | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<{ [key: string]: string }>(
    {}
  );
  
  const {
    searchQuery,
    setSearchQuery,
    handleSearchSale: filteredSales,
  } = useSearch(recentSales, ["client", "items"]);

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    resetPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(filteredSales.length, 4);

  

  const currentSales = useMemo(() => {
    const startIndex = (currentPage - 1) * 4;
    const endIndex = startIndex + 4;
    return filteredSales.slice(startIndex, endIndex);
  }, [filteredSales, currentPage]);

 

  const handleSearchSale = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      resetPage();
    },
    [setSearchQuery, resetPage]
  );

  const handleViewSale = useCallback((sale: SalesTransaction) => {
    setSelectedState(sale);
  }, []);

  const handleSaleChange = useCallback((saleId: string, newItems: string) => {
    setSelectedItem((prev) => ({ ...prev, [saleId]: newItems }));
  }, []);

  const getDisplayItems = (sale: SalesTransaction) => {
    return selectedItem[sale.id] || sale.items;
  };

  
  const getAmountColor = useCallback((amount: number) => {
    return amount > 0 ? "text-green-400" : "text-[#F95353]";
  }, []);

  return (
    <div className="bg-white px-8 py-6 rounded-lg font-Inter">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <CardTitle>Recent Sales</CardTitle>
            </div>
            <div className=" w-full sm:w-1/2 relative rounded-md">
              <IoIosSearch
                size={18}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={searchQuery}
                onChange={handleSearchSale}
                placeholder="Search sales..."
                className=" pl-10 outline-none focus:outline-none"
                aria-label="Search sales by client or items"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#D9D9D9]">
                <TableHead className=" text-[#333333] text-base ">
                  Time
                </TableHead>
                <TableHead className=" text-[#333333] text-base ">
                  Client
                </TableHead>
                <TableHead className=" text-[#333333] text-base ">
                  Items
                </TableHead>
                <TableHead className=" text-[#333333] text-base ">
                  Amount
                </TableHead>
                <TableHead className=" text-[#333333] text-base ">
                  Staff
                 </TableHead>
                <TableHead className=" text-[#333333] text-base ">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSales.map((sale) => (
                <TableRow key={sale.client} className="text-start">
                  <TableCell className="text-sm text-gray-400 ">
                    {sale.time}
                  </TableCell>
                  <TableCell>{sale.client}</TableCell>
                  <TableCell>
                    <Select
                      value={getDisplayItems(sale)}
                      onValueChange={(value) =>
                        handleSaleChange(sale.id, value)
                      }
                    >
                      <SelectTrigger className="w-32 min-w-0 border-none bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 p-0">
                        <SelectValue className="truncate">
                          <span className="truncate block max-w-full">
                            {getDisplayItems(sale)}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {sale.availableItems.map((items, index) => (
                          <SelectItem key={index} value={items}>
                            <span className="truncate max-w-[200px] block">
                              {items}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className={getAmountColor(sale.amount)}>
                    ₦{sale.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="">{sale.staff}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => handleViewSale(sale)}
                          className="text-[#3D80FF] text-sm underline-offset-2 hover:underline hover:text-red-600 active:text-brown-700 active:underline cursor-pointer border-none "
                        >
                          View
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Sale Details</DialogTitle>
                        </DialogHeader>
                        {selectedState && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  {" "}
                                  Client Name
                                </p>
                                <p className="text-sm">
                                  {selectedState.client}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Items Purchased
                                </p>
                                <p className="text-sm">
                                  {getDisplayItems(selectedState)}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Time
                                </p>
                                <p className="text-sm">{selectedState.time}</p>
                              </div>
                              
                              <div className="border-t pt-4">
                                <p className="text-sm font-medium text-gray-600">
                                  Total Amount
                                </p>
                                <p
                                  className={`text-xl font-bold ${getAmountColor(
                                    selectedState.amount
                                  )}`}
                                >
                                  ₦{selectedState.amount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSales.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              <p>No sales found matching your search criteria</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          
          {filteredSales.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={canGoPrevious ? goToPreviousPage : undefined}
                      className={
                        !canGoPrevious
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    >
                      <button
                        aria-label="previous page"
                        disabled={!canGoPrevious}
                      >
                        <FaArrowLeft className="w-5 h-5 mr-2" />
                      </button>
                    </PaginationPrevious>
                  </PaginationItem>

                  <PaginationItem>
                    <span className="px-4 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      onClick={canGoNext ? goToNextPage : undefined}
                      className={
                        !canGoNext
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      aria-label="Go to next page"
                    >
                      <FaArrowRight className="w-5 h-5" />
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesData;

