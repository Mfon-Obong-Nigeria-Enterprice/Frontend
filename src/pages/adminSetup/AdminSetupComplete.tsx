import SetupHeader from "../../features/admin/setup/SetupHeader";
import SetupComplete from "../../features/admin/setup/SetupComplete.tsx";

const AdminSetupComplete = () => {
  return (
    <div className="bg-[#F5F5F5] md:py-10">
      <SetupHeader />
      <SetupComplete />
    </div>
  );
};

export default AdminSetupComplete;
