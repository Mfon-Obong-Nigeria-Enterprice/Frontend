type DashboardTitleProps = {
  heading: string;
  description: string;
};

const DashboardTitle = ({ heading, description }: DashboardTitleProps) => {
  return (
    <div>
      <h2 className="font-Arial font-bold text-[1.75rem]  text-[#333333]">
        {heading}
      </h2>
      <p className="font-Inter text-lg leading-none text-black/50">
        {description}
      </p>
    </div>
  );
};

export default DashboardTitle;
