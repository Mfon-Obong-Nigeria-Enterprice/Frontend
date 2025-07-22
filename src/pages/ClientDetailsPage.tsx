import { useParams } from "react-router-dom";
import { useClientStore } from "@/stores/useClientStore";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/DatePicker";
import { useState, useMemo } from "react";

export const ClientDetailsPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  // use clientId to fetch details
  const clients = useClientStore((state) => state.clients);
  const client = clients.find((c) => c.id?.toString() === clientId);

  const [filters, setFilters] = useState({
    type: "all",
    staff: "all",
  });

  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const filteredTransactions = useMemo(() => {
    if (!client?.transactions) return [];

    return client.transactions
      .filter((tx) => {
        if (
          filters.type !== "all" &&
          tx.type.toLowerCase() !== filters.type.toLowerCase()
        )
          return false;
        if (
          filters.staff !== "all" &&
          tx.staff.toLowerCase() !== filters.staff.toLowerCase()
        )
          return false;
        if (dateRange.from && new Date(tx.date) < new Date(dateRange.from))
          return false;
        if (dateRange.to && new Date(tx.date) > new Date(dateRange.to))
          return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [client, filters, dateRange]);

  const staffList = useMemo(() => {
    const names = client?.transactions?.map((tx) => tx.staff) || [];
    return Array.from(new Set(names));
  }, [client]);

  if (!client) return <p className="text-center">Client not found</p>;

  return (
    <section className="p-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <p className="text-muted-foreground">{client.phone}</p>
      </div>

      <Separator className="my-6" />

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Filter by Type
          </label>
          <Select
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="debt">Debt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Filter by Staff
          </label>
          <Select
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, staff: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffList.map((staff) => (
                <SelectItem key={staff} value={staff}>
                  {staff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <div className="flex space-x-2">
            {/* <DatePicker
              placeholder="From"
              date={dateRange.from}
              onChange={(date) =>
                setDateRange((prev) => ({ ...prev, from: date }))
              }
            /> */}
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
            {/* <DatePicker
              placeholder="To"
              date={dateRange.to}
              onChange={(date) =>
                setDateRange((prev) => ({ ...prev, to: date }))
              }
            /> */}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center">
            No transactions found
          </p>
        ) : (
          filteredTransactions.map((tx, i) => (
            <Card key={i} className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">{tx.description}</p>
                <Badge variant="outline" className="capitalize">
                  {tx.type}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <p>₦{Number(tx.amount).toLocaleString()}</p>
                <p>{format(new Date(tx.date), "PPP")}</p>
                <p>{tx.staff}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};

// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useClients } from "@/hooks/useClients";
// import { ChevronLeft, ChevronUp } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import DatePicker from "@/components/DatePicker";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ChevronDown, MoveRight, MoveLeft } from "lucide-react";

// type Transaction = {
//   method: string;
//   items: string[];
//   type: "Debit" | "Credit" | "Partial";
//   amount: string;
//   balance: string;
//   staff: string;
//   date: string;
//   time: string;
// };

// const transactionData: Transaction[] = [
//   {
//     method: "Bank transfer",
//     items: ["10x cement", "4x Nails"],
//     type: "Debit",
//     amount: "-₦ 250,000",
//     balance: "-₦ 450,000",
//     staff: "John Doe",
//     date: "5/25/2025",
//     time: "10:45 AM",
//   },
//   {
//     method: "Check payment",
//     items: [
//       "10 bags of cement",
//       "10x 8MM long rod",
//       "15x nails",
//       "20x 4mm rod",
//       "10x 6mm rod",
//     ],
//     type: "Partial",
//     amount: "₦ 100,000",
//     balance: "-₦ 200,000",
//     staff: "Jane Smith",
//     date: "5/21/2025",
//     time: "09:45 PM",
//   },
//   {
//     method: "Cash",
//     items: ["10x cement"],
//     type: "Credit",
//     amount: "₦ 75,000",
//     balance: "-₦750,000",
//     staff: "Mike Johnson",
//     date: "5/25/2025",
//     time: "04:15 PM",
//   },
//   {
//     method: "Cheque",
//     items: ["58x steel rods"],
//     type: "Debit",
//     amount: "-₦ 255,000",
//     balance: "₦0.00",
//     staff: "Sara Wilson",
//     date: "5/04/2025",
//     time: "08:10 AM",
//   },
// ];

// const ClientDetailsPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { clientId } = useParams();
//   const { data: clients = [] } = useClients();
//   const client = clients.find((client) => client.id === clientId);

//   if (!client) {
//     return (
//       <div className="p-8 text-center text-gray-600">Client not found.</div>
//     );
//   }
//   //   const [expandedDesc, setExpandedDesc] = useState<boolean>(false);
//   //   const toggleExpanded = () => setExpandedDesc(!expandedDesc);
//   const [expandedRow, setExpandedRow] = useState<number | null>(null);

//   const toggleRow = (index: number) => {
//     setExpandedRow((prev) => (prev === index ? null : index));
//   };

//   return (
//     <>
//       <header className="flex justify-between items-center py-3 px-10">
//         <div className="flex gap-10">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex gap-1 items-center text-[#7D7D7D]"
//           >
//             <ChevronLeft />
//             <span>Back</span>
//           </button>
//           <p className="text-lg text-[#333333]">Client Account Management</p>
//         </div>
//         <div className="flex justify-end gap-4 my-4 mx-7">
//           <Button className="bg-white hover:bg-gray-100 text-text-dark border border-[#7D7D7D]">
//             <ChevronUp />
//             <span>Export data</span>
//           </Button>

//           <Button className="bg-[#FFC761] hover:bg-[#FFA500] text-text-dark">
//             Send Payment Reminder
//           </Button>

//           <Button
//             onClick={() => navigate("/client-details")}
//             className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] text-white"
//           >
//             Edit Client
//           </Button>
//           <Button
//             onClick={() => navigate("/client-details")}
//             className="bg-[#F95353] hover:bg-[#f95353e1] text-white"
//           >
//             Suspend account
//           </Button>
//         </div>
//       </header>
//       <main className="flex gap-3 bg-[#F5F5F5] py-5 px-12">
//         <section className="w-[40%] bg-white py-8 px-5 rounded">
//           <p className="text-lg text-[#333333] mb-6">{client.name}</p>
//           <div
//             className={`flex flex-col justify-center gap-1 min-h-18 border-l-4 text-xs py-1.5 px-3 rounded-[8px] border-[#F95353] bg-[#FFE9E9]
//             }`}
//           >
//             <p className="text-[#444444] text-xs">Current balance</p>
//             <p className="text-lg text-[#F95353]">
//               ₦{client.balance.toLocaleString()}
//             </p>
//           </div>

//           {/* info */}
//           <article className="my-7">
//             <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
//               <p>Phone</p>
//               <p>{client.phone}</p>
//             </div>
//             <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
//               <p>Address</p>
//               <address>{client.address}</address>
//             </div>
//             <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
//               <p>Registered</p>
//               <p>5/4/2025</p>
//             </div>
//             <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
//               <p>Last activity</p>
//               <p>5/25/2025</p>
//             </div>
//             <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
//               <p>Account status</p>
//               <p className="text-[#F95353] capitalize">Overdue</p>
//             </div>
//           </article>

//           {/* description */}
//           <div className="bg-[#F5F5F5] p-4 rounded-md border border-[#d9d9d9] mt-5">
//             <p className="text-[0.625rem] text-[#7D7D7D] mb-1">
//               Client Description
//             </p>
//             <p className="text-[0.625rem] text-[#444444]">
//               Major construction company specializing in residential and
//               commercial buildings. Long-term client with multiple ongoing
//               projects. Prefers bulk material orders and has established credit
//               terms. Primary contact: Mr. Okoro (Site Manager).
//             </p>
//           </div>

//           {/* data */}
//           <ul className="grid grid-cols-2 gap-5 mt-5">
//             <li className="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center items-center rounded-[8px] p-5">
//               <span className="text-sm text-[#333333] font-semibold">
//                 {client.transactions.length}
//               </span>
//               <span className="text-xs text-[#444444] font-normal">
//                 Total order
//               </span>
//             </li>

//             <li className="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center items-center rounded-[8px] p-5">
//               <span className="text-sm text-[#333333] font-semibold">
//                 {client.balance}
//               </span>
//               <span className="text-xs text-[#444444] font-normal">
//                 Lifetime value
//               </span>
//             </li>

//             <li className="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center items-center rounded-[8px] p-5">
//               <span className="text-sm text-[#333333] font-semibold">30</span>
//               <span className="text-xs text-[#444444] font-normal">
//                 Days overdue
//               </span>
//             </li>

//             <li className="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center items-center rounded-[8px] p-5">
//               <span className="text-sm text-[#333333] font-semibold">2</span>
//               <span className="text-xs text-[#444444] font-normal">
//                 Pending invoices
//               </span>
//             </li>
//           </ul>
//         </section>

//         {/* data */}
//         <section className="w-full bg-white py-8 px-5 rounded">
//           <div className="flex justify-between items-end gap-5 mb-10">
//             <div>
//               <p className="text-[#7D7D7D] text-[0.625rem] mb-1 ml-1.5">
//                 Date from
//               </p>
//               <DatePicker />
//             </div>
//             <div>
//               <p className="text-[#7D7D7D] text-[0.625rem] mb-1 ml-1.5">
//                 Date to
//               </p>
//               <DatePicker />
//             </div>
//             <div>
//               <label
//                 htmlFor="transaction"
//                 className="text-[#7D7D7D] text-[0.625rem] mb-1 ml-1.5"
//               >
//                 Transaction type
//               </label>
//               <Select>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="All Transactions" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Select transaction type</SelectLabel>
//                     <SelectItem value="all">All transactions</SelectItem>
//                     <SelectItem value="PURCHASE">debit</SelectItem>
//                     <SelectItem value="DEPOSIT">credit</SelectItem>
//                     <SelectItem value="grapes">Grapes</SelectItem>
//                     {/* <SelectItem value="pineapple">Pineapple</SelectItem> */}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <label
//                 htmlFor="transaction"
//                 className="text-[#7D7D7D] text-[0.625rem] mb-1 ml-1.5"
//               >
//                 Staff member
//               </label>
//               <Select>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="All Staff" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Select staff</SelectLabel>
//                     <SelectItem value="all-staff">All Staff</SelectItem>
//                     {/* <SelectItem value="banana">Banana</SelectItem>
//                     <SelectItem value="blueberry">Blueberry</SelectItem>
//                     <SelectItem value="grapes">Grapes</SelectItem>
//                     <SelectItem value="pineapple">Pineapple</SelectItem> */}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//             <Button className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] text-white">
//               Apply filters
//             </Button>
//           </div>
//           {/* data table */}
//           <table className="w-full">
//             <thead className="bg-[#F5F5F5]">
//               <tr>
//                 <th className="py-1.5 text-xs text-[#333333] font-normal text-center">
//                   Date/Time
//                 </th>
//                 <th className="py-3 text-xs text-[#333333] font-normal text-center">
//                   Type
//                 </th>
//                 <th className="py-3 text-xs text-[#333333] font-normal text-center">
//                   Description
//                 </th>
//                 <th className="py-3 text-xs text-[#333333] font-normal text-center">
//                   Payment Method
//                 </th>
//                 <th className="py-3 text-xs text-[#333333] font-normal text-center">
//                   Amount
//                 </th>
//                 <th className="py-3 text-xs text-[#333333] font-normal text-center">
//                   Balance
//                 </th>
//                 <th className="py-3 text-xs text-[#333333] font-normal text-center">
//                   Staff
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactionData.map((transaction, i) => {
//                 return (
//                   <tr key={i} className="border-b border-[#d9d9d9]">
//                     <td className="flex flex-col text-center text-[#7D7D7D] text-sm font-normal py-3">
//                       <span>{transaction.date}</span>
//                       <span>{transaction.time}</span>
//                     </td>
//                     <td className="text-center">
//                       <span
//                         className={`border text-xs py-1.5 px-3 rounded-[6.25rem] ${
//                           transaction.type === "Debit"
//                             ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
//                             : transaction.type === "Credit"
//                             ? "border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]"
//                             : "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
//                         }`}
//                       >
//                         {transaction.type}
//                       </span>
//                     </td>

//                     <td
//                       onClick={() => toggleRow(i)}
//                       className="cursor-pointer text-center text-xs text-[#333] max-w-[120px]"
//                     >
//                       <div className="flex items-center justify-center gap-1">
//                         <span>
//                           {expandedRow === i
//                             ? transaction.items.join(", ")
//                             : transaction.items[0]}
//                         </span>
//                         {transaction.items.length > 1 && (
//                           <ChevronDown
//                             className={`w-4 h-4 transition-transform ${
//                               expandedRow === i ? "rotate-180 w-10" : ""
//                             }`}
//                           />
//                         )}
//                       </div>
//                     </td>

//                     <td className="text-[#333333] text-center text-xs">
//                       {transaction.method}
//                     </td>
//                     <td
//                       className={`text-sm text-center ${
//                         transaction.amount.includes("-")
//                           ? "text-[#F95353]"
//                           : "text-[#2ECC71]"
//                       }`}
//                     >
//                       {transaction.amount}
//                     </td>
//                     <td
//                       className={`text-sm text-center ${
//                         transaction.balance.includes("-")
//                           ? "text-[#F95353]"
//                           : transaction.balance.startsWith("₦0")
//                           ? "text-[#444444]"
//                           : "text-[#2ECC71]"
//                       }`}
//                     >
//                       {transaction.balance}
//                     </td>
//                     <td className="text-[#333333] text-center text-xs">
//                       {transaction.staff}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           <div className="flex justify-center items-center gap-2 mt-20">
//             <MoveLeft />
//             <p>Page 1 of 1</p>
//             <MoveRight />
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };

// export default ClientDetailsPage;
