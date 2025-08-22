import React from "react";
import type { Client } from "@/types/types";

interface ClientStatusBadgeProps {
  client: Client;
}

const ClientStatusBadge: React.FC<ClientStatusBadgeProps> = ({ client }) => {
  const isBlocked = client?.isActive === false;

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium text-gray-600">Status:</span>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          isBlocked
            ? "bg-red-100 text-red-800 border border-red-200"
            : "bg-green-100 text-green-800 border border-green-200"
        }`}
      >
        {isBlocked ? "Suspended" : "Active"}
      </span>
    </div>
  );
};

export default ClientStatusBadge;
