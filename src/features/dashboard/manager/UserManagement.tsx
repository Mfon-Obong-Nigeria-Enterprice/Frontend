
import { useState } from "react";
import UserOverview from "../shared/usermanagement/useroverview";
import AddBusinessLocationModal from "@/components/AddBusinessLocationModal";
import { Button } from "@/components/ui/button";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">User Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Business Location
        </Button>
      </div>

      <UserOverview />

      <AddBusinessLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default UserManagement;
