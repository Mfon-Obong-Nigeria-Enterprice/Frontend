import { useImportStore } from "@/stores/useImportStore";
import ImportUpload from "./ImportUpload";
import ImportView from "./ImportView";
import ImportConfigure from "./ImportConfigure";
import ImportLoading from "./ImportLoading";
import ImportError from "./ImportError";
import ImportComplete from "./ImportComplete";

export const StockStep = () => {
  const { step } = useImportStore();

  switch (step) {
    case "upload":
      return <ImportUpload />;
    case "preview":
      return <ImportView />;
    case "configure":
      return <ImportConfigure />;
    case "error":
      return <ImportError />;
    case "loading":
      return <ImportLoading />;
    case "complete":
      return <ImportComplete />;
    default:
      return null;
  }
};
