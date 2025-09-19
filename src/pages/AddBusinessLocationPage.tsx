import { useState } from "react";
import BusinessLocationModal from "@/components/BusinessLocationModal";

const AddBusinessLocationPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (data: {
    locationType: string;
    address: string;
    email: string;
    phone: string;
  }) => {
    console.log("Business location submitted:", data);
  };

  return (
    <BusinessLocationModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit}
    />
  );
};

export default AddBusinessLocationPage;
