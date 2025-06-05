type reviewSummaryProps = {
  summaryHeading: string;
  summaryName: string;
  nameVal: string | number;
  phoneOrEstimate: string;
  phoneOrEstimateValue: number | string;
  address?: string;
  addressValue?: string;
};

const ReviewSummary = ({
  summaryHeading,
  summaryName,
  nameVal,
  phoneOrEstimate,
  phoneOrEstimateValue,
  address,
  addressValue,
}: reviewSummaryProps) => {
  return (
    <div className="bg-[#F5F5F5] rounded-[0.625rem] p-6">
      <h5 className="text-text-dark font-normal text-lg font-Inter">
        {summaryHeading}
        <span className="bg-gradient-to-t from-[#3D80FF] to-[#A7C5FF] p-[0.5rem] rounded-[100px] text-white ml-2 text-sm">
          Complete
        </span>
      </h5>
      <div className="flex flex-col gap-1 border-t border-[#D9D9D9] mt-3 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-secondary">{summaryName}</p>
          <p className="text-[#333333]">{nameVal}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-secondary">{phoneOrEstimate}</p>
          <p className="text-[#333333]">{phoneOrEstimateValue}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-secondary">{address}</p>
          <p className="text-[#333333]">{addressValue}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
