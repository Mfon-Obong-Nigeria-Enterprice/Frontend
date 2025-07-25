import { useMemo } from "react";
import { useClientStore } from "@/stores/useClientStore";
import dayjs from "dayjs";

export const useClientStats = (durationInMonths = 3) => {
  const { clients = [] } = useClientStore();

  const now = dayjs();
  const pastDue = now.subtract(durationInMonths, "month");

  return useMemo(() => {
    const totalClients = (clients ?? []).length;

    const activeClients = (clients ?? []).filter((client) =>
      dayjs(client.lastTransactionDate).isAfter(pastDue)
    );

    const previousPeriodClients = (clients ?? []).filter((client) => {
      const lastActive = dayjs(client.lastTransactionDate);
      return (
        lastActive.isAfter(now.subtract(durationInMonths * 2, "month")) &&
        lastActive.isBefore(pastDue)
      );
    });

    const growthPercent = (previousPeriodClients ?? []).length
      ? ((activeClients.length - previousPeriodClients.length) /
          previousPeriodClients.length) *
        100
      : 100;

    const activePercentage = totalClients
      ? (activeClients.length / totalClients) * 100
      : 0;

    return {
      totalClients,
      activeClients: activeClients.length,
      growthPercent: Math.round(growthPercent),
      activePercentage: Math.round(activePercentage),
    };
  }, [clients, durationInMonths, now, pastDue]);
};
