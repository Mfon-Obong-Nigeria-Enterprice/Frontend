import { useGoBack } from "@/hooks/useGoBack";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
const ColumnSettings = () => {
  const goback = useGoBack();

  return (
    <div>
      <div className="flex justify-between">
        <h5>Settings</h5>
      </div>
      <Button variant="outline" onClick={() => goback}>
        <ChevronLeft />
        Back to User List
      </Button>
    </div>
  );
};

export default ColumnSettings;
