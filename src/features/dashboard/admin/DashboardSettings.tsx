// import DashboardTitle from "../../../components/dashboard/DashboardTitle";

// const DashboardSettings = () => {
//   return (
//     <div>
//       <DashboardTitle
//         heading="Admin Settings"
//         description="Manage your basic system preferences"
//       />
//     </div>
//   );
// };

// export default DashboardSettings;

import { useEffect, useState } from "react";
import localforage from "localforage";
import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import api from "@/services/baseApi";

const DashboardSettings = () => {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const getClients = async () => {
      try {
        const token = await localforage.getItem<string>("access_token");
        if (!token) {
          console.error("No token found");
          return;
        }

        // const response = await api.get("/clients", {
        //   headers: { Authorization: Bearer ${token} },
        // });
        const response = await api.get("/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClients(response.data); // Make sure this matches your API response
        console.log("Fetched clients:", response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    getClients();
  }, []);

  return (
    <div>
      <DashboardTitle
        heading="Admin Settings"
        description="Manage your basic system preferences"
      />
      <pre>{JSON.stringify(clients, null, 2)}</pre>{" "}
      {/* For temporary debug display */}
      <ul className="border rounded p-4">
        <h2 className="font-bold capitalize underline">Client List</h2>
        {clients.map((client, i) => (
          <li key={i} className="border-b mb-3 bg-gray-300 rounded p-4">
            <h3>Name: {client.name}</h3>
            <p>Phone number: {client.phone}</p>
            <p>Email: {client.email}</p>
            <p>Address: {client.address}</p>
            <p>Balance: {`${client.balance.toLocaleString()}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardSettings;
