import { useClientStore } from "@/stores/useClientStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

const ClientStats = () => {
  const {
    clients,
    getActiveClients,
    getTotalClientsPercentageChange,
    getOutStandingBalanceData,
  } = useClientStore();
  const products = useInventoryStore((state) => state.products);

  // Get dynamic data from store with safe fallbacks
  const totalClients = clients?.length || 0;
  const totalClientsChange = getTotalClientsPercentageChange() || {
    percentage: 0,
    direction: "no-change",
  };
  const activeClients = getActiveClients() || 0;

  // Safe calculation for low stock count
  const lowStockCount =
    products?.filter((prod) => {
      const stock = Number(prod?.stock) || 0;
      const minStock = Number(prod?.minStockLevel) || 0;
      return stock <= minStock;
    }).length || 0;

  // Safe handling of outstanding balance
  const outstandingBalance = getOutStandingBalanceData() || {
    totalDebt: 0,
    clientsWithDebt: 0,
  };
  const totalDebt = Number(outstandingBalance.totalDebt) || 0;
  const clientsWithDebt = Number(outstandingBalance.clientsWithDebt) || 0;

  const ClientsCard = ({
    title,
    value,
    description,
    percentage,
    showTrend = false,
  }: {
    title: string;
    value: number | string;
    description: string;
    percentage?: number;
    showTrend?: boolean;
  }) => {
    const isPositive = percentage !== undefined ? percentage >= 0 : true;

    return (
      <section>
        <div className="bg-white rounded-lg border border-[#D9D9D9] py-5 px-7 flex flex-col gap-2.5 mx-3 md:mx-1">
          <p className="font-Inter text-sm text-[#7D7D7D]">{title}</p>
          <p className="font-Arial font-bold text-xl text-text-dark">{value}</p>

          <p
            className={`flex items-center text-xs ${
              showTrend && percentage !== undefined
                ? isPositive
                  ? "text-[#1AD410]"
                  : "text-[#F30C12]"
                : "text-[#7D7D7D]"
            }`}
          >
            {showTrend && percentage !== undefined && (
              <>
                {isPositive ? (
                  <BsArrowUp className="mr-1 w-3 h-3" />
                ) : (
                  <BsArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(percentage)}%{" "}
              </>
            )}
            {description}
          </p>
        </div>
      </section>
    );
  };

  return (
    <div className="mt-5 grid md:grid-cols-4 gap-4">
      <ClientsCard
        title="Total Clients"
        value={totalClients}
        description="more than last month"
        percentage={totalClientsChange.percentage}
        showTrend={true}
      />

      <ClientsCard
        title="Active Clients"
        value={activeClients}
        description={`${Math.round(
          (activeClients / totalClients) * 100 || 0
        )}% of total clients`}
        showTrend={false}
      />

      <ClientsCard
        title="Outstanding balances"
        value={`₦${totalDebt.toLocaleString()}`}
        description={`${clientsWithDebt} Clients with overdue balances`}
        showTrend={false}
      />

      <ClientsCard
        title="Low stock items"
        value={`${lowStockCount} Products`}
        description={
          lowStockCount > 0 ? "Needs attention" : "All items well stocked"
        }
        showTrend={false}
      />
    </div>
  );
};

export default ClientStats;
