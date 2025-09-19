type DashboardTitleProps = {
  heading: string;
  description: string;
};

const DashboardTitle = ({ heading, description }: DashboardTitleProps) => {
  return (
    <div className="flex flex-col gap-2 px-2 md:px-0 mb-4">
      <h2 className="font-Arial font-bold text-xl xl:text-[1.75rem]  text-[#333333]">
        {heading}
      </h2>
      <p className="font-Inter text-sm xl:text-lg text-black/50">
        {description}
      </p>
    </div>
  );
};

export default DashboardTitle;
