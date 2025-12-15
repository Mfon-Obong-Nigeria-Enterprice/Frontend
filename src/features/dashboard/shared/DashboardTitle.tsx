import { RefreshCw } from "lucide-react";

type DashboardTitleProps = {
  heading: string;
  description: string;
  onRefresh?: () => void;
};

const DashboardTitle = ({ heading, description, onRefresh }: DashboardTitleProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 px-2 md:px-0 mb-4">
      <div className="flex flex-col gap-2">
        <h2 className="font-Arial font-bold text-xl xl:text-[1.75rem] text-[#333333]">
          {heading}
        </h2>
        <p className="font-Inter text-sm xl:text-lg text-black/50">
          {description}
        </p>
      </div>
      
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="md:w-[213px] w-[115px] justify-center flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:cursor-pointer transition-colors whitespace-nowrap"
        >
          <RefreshCw size={20} className="text-gray-700" />
          <span className="font-medium text-gray-700">Refresh</span>
        </button>
      )}
    </div>
  );
};

export default DashboardTitle;