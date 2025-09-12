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

  const getColor = (color?: string) => {
    switch (color) {
      case "green":
        return "#1AD410";
      case "orange":
        return "#F39C12";
      case "red":
        return "#F95353";
      case "blue":
        return "#3D80FF";
      default:
        return "#7d7d7d";
    }
  };

  const cardData = [
    {
      title: "Total Clients",
      value: totalClients,
      description: "more than last month",
      percentage: totalClientsChange.percentage,
      showTrend: true,
      color:
        totalClientsChange.direction === "increase"
          ? "green"
          : totalClientsChange.direction === "decrease"
          ? "red"
          : "blue",
    },
    {
      title: "Active Clients",
      value: activeClients,
      description: `${Math.round(
        (activeClients / totalClients) * 100 || 0
      )}% of total clients`,
      showTrend: false,
      color: "blue",
    },
    {
      title: "Outstanding balances",
      value: `₦${totalDebt.toLocaleString()}`,
      description: `${clientsWithDebt} Clients with overdue balances`,
      showTrend: false,
      color: "orange",
    },
    {
      title: "Low stock items",
      value: `${lowStockCount} Products`,
      description:
        lowStockCount > 0 ? "Needs attention" : "All items well stocked",
      showTrend: false,
      color: lowStockCount > 0 ? "red" : "green",
    },
  ];

  return (
    <section
      className="gap-4 mt-5 px-2 sm:px-0"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        maxWidth: "100%",
      }}
    >
      {cardData.map((stat, index) => {
        const isPositive =
          stat.percentage !== undefined ? stat.percentage >= 0 : true;

        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#D9D9D9] p-4 sm:p-6 flex flex-col justify-evenly items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow duration-200 relative"
          >
            <div className="font-Inter text-xs sm:text-sm text-[#7D7D7D]">
              {stat.title}
            </div>

            <div className="font-Arial font-bold text-base sm:text-xl text-text-dark">
              {stat.value}
            </div>

            <div
              className="flex items-center text-[0.625rem] sm:text-xs gap-1"
              style={{
                color:
                  stat.showTrend && stat.percentage !== undefined
                    ? isPositive
                      ? getColor("green")
                      : getColor("red")
                    : getColor(stat.color),
              }}
            >
              {stat.showTrend && stat.percentage !== undefined && (
                <>
                  {isPositive ? (
                    <BsArrowUp className="mr-1 w-3 h-3" />
                  ) : (
                    <BsArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(stat.percentage)}%{" "}
                </>
              )}
              <span className="font-Arial leading-tight">
                {stat.description}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ClientStats;
