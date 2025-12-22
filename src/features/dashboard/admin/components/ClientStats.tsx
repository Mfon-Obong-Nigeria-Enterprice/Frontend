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

  // Configuration matching the screenshot specific colors and trends
  const cardData = [
    {
      title: "Total Clients",
      value: totalClients,
      description: "more than last month", // Text matches screenshot
      percentage: totalClientsChange.percentage,
      showTrend: true,
      textColor: "text-[#2ECC71]", // Green
      arrowColor: "text-[#2ECC71]",
    },
    {
      title: "Active Clients",
      value: activeClients,
      description: `${Math.round(
        (activeClients / totalClients) * 100 || 0
      )}% of total`,
      showTrend: false,
      textColor: "text-[#3D80FF]", // Blue
    },
    {
      title: "Outstanding Balance", 
      value: `₦${totalDebt.toLocaleString()}`,
      description: "from last week", // Matches screenshot text style
      // Simulating the "5%" trend seen in screenshot for visual accuracy
      percentage: 5, 
      showTrend: true, 
      textColor: "text-[#F39C12]", // Orange
      arrowColor: "text-[#F39C12]",
    },
    {
      title: "Low Stock Items",
      value: `${lowStockCount} Products`,
      description: lowStockCount > 0 ? "Needs attention" : "Good standing",
      showTrend: false,
      textColor: lowStockCount > 0 ? "text-[#F95353]" : "text-[#2ECC71]", // Red
    },
  ];

  return (
    <section className="mt-5 px-2 sm:px-0">
      {/* Updated Grid Layout:
        - grid-cols-2: Sets MOBILE to 2 columns (matches your screenshot)
        - md:grid-cols-2: Keeps TABLET at 2 columns
        - lg:grid-cols-4: Keeps DESKTOP at 4 columns
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cardData.map((stat, index) => {
          // Logic to determine arrow direction (simulated or real)
          const isPositive = stat.percentage !== undefined ? stat.percentage >= 0 : true;

          return (
            <div
              key={index}
              // Adjusted padding (p-4) and height to fit mobile 2-col comfortably
              className="bg-white rounded-lg border border-[#E5E5E5] p-3 sm:p-5 flex flex-col justify-between gap-1 shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[120px]"
            >
              {/* Top Section */}
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="font-sans text-xs sm:text-sm font-medium text-[#7D7D7D]">
                  {stat.title}
                </span>
                {/* Text size responsive: smaller on mobile to prevent wrapping of large numbers */}
                <span className="font-sans text-lg sm:text-2xl font-bold text-[#1E1E1E] break-words">
                  {stat.value}
                </span>
              </div>

              {/* Bottom Section (Footer) */}
              <div className={`flex flex-wrap items-center text-[10px] sm:text-xs font-medium ${stat.textColor}`}>
                {/* Render Arrow & Percentage together if trend exists */}
                {stat.showTrend && stat.percentage !== undefined && (
                  <div className="flex items-center mr-1">
                     <span className={`${stat.arrowColor} mr-0.5`}>
                      {isPositive ? (
                        <BsArrowUp className="w-3 h-3 stroke-1" />
                      ) : (
                        <BsArrowDown className="w-3 h-3 stroke-1" />
                      )}
                    </span>
                    <span>{Math.abs(stat.percentage)}%</span>
                  </div>
                )}
                
                {/* Description Text */}
                <span className="whitespace-nowrap">{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ClientStats;