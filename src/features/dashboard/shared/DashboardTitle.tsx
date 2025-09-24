type DashboardTitleProps = {
  heading: string;
  description: string;
};

const DashboardTitle = ({ heading, description }: DashboardTitleProps) => {
  return (
    <div className="flex flex-col gap-2 px-2 mb-4 max-w-full">
      <h2 className="font-Arial font-bold text-lg sm:text-xl lg:text-[1.75rem] text-[#333333] break-words">
        {heading}
      </h2>
      <p className="font-Inter text-xs sm:text-sm lg:text-base xl:text-lg text-black/50 break-words">
        {description}
      </p>
    </div>
  );
};

export default DashboardTitle;
