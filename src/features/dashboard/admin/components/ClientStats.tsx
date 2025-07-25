import { useClientStore } from "@/stores/useClientStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useClientStats } from "@/hooks/useClientStats";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

const ClientStats = () => {
  const { totalClients, activeClients, activePercentage, growthPercent } =
    useClientStats();
  const {
    // clients,
    // getActiveClients,
    // getNewClients,
    // getClientGrowthPercentage,
    // getActiveClientsPercentage,
    getOutStandingBalanceData,
  } = useClientStore();
  const products = useInventoryStore((state) => state.products);

  const lowStockCount = products?.filter(
    (prod) => prod.stock <= prod.minStockLevel
  ).length;

  // const totalClients = clients?.length;
  // const activeClients = getActiveClients();
  // const newClients = getNewClients();
  // const clientGrowthPercentage = getClientGrowthPercentage();
  // const activeClientsPercentage = getActiveClientsPercentage();
  const outstandingBalance = getOutStandingBalanceData();

  const ClientsCard = ({
    title,
    value,
    percentageLabel,
    percentage,
    showTrend = false,
  }: {
    title: string;
    value: number | string;
    percentageLabel: string;
    percentage?: number;
    showTrend?: boolean;
  }) => {
    const isPositive = percentage !== undefined ? percentage >= 0 : true;

    return (
      <section>
        <div className="bg-white rounded-lg border border-[#D9D9D9] py-5 px-7 flex flex-col gap-2.5 mx-3 md:mx-1">
          <p className="font-Inter text-sm text-[#7D7D7D]">{title}</p>

          <p className="font-Arial font-bold text-xl text-text-dark">{value}</p>
          {percentage !== undefined && (
            <p
              className={`flex items-center text-xs ${
                showTrend
                  ? isPositive
                    ? "text-[#1AD410]"
                    : "text-[#F30C12]"
                  : "text-[#F95353]"
              }`}
            >
              {showTrend && (
                <>
                  {isPositive ? (
                    <BsArrowUp className="mr-1 w-3 h-3" />
                  ) : (
                    <BsArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(percentage)}%
                </>
              )}
              {percentageLabel && (
                <span className={`text-xs pl-1 `}>{percentageLabel}</span>
              )}
            </p>
          )}
        </div>
      </section>
    );
  };

  //

  return (
    <div className="mt-5 grid md:grid-cols-4 gap-4">
      <ClientsCard
        title="Total Clients"
        value={totalClients}
        percentageLabel="more than last month"
        percentage={growthPercent}
        showTrend={true}
      />
      {/*  */}
      <ClientsCard
        title="Active Clients"
        value={activeClients}
        percentageLabel="of total"
        percentage={activePercentage}
        showTrend={true}
      />
      {/*  */}
      <ClientsCard
        title="Outsanding balances"
        value={outstandingBalance.clientsWithDebt}
        percentageLabel="from last week"
        percentage={growthPercent}
        showTrend={true}
      />
      {/*  */}
      <ClientsCard
        title="Low stock items"
        value={`${lowStockCount} Products`}
        percentageLabel="Needs attention"
        percentage={growthPercent}
        showTrend={false}
      />
    </div>
  );
};

export default ClientStats;
