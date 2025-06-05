import { type SetupTitleProps } from "../../../types/types";

const SetupTitle = ({ title, description }: SetupTitleProps) => {
  return (
    <div className="bg-[#F4E8E7] min-h-[98px] md:min-h-[155px] flex flex-col items-center justify-center gap-3.5 px-5">
      <h3 className="text-text-dark font-Arial text-base md:text-2xl leading-none text-center">
        {title}
      </h3>
      <p className="text-text-semidark font-Inter font-normal text-[0.75rem] md:text-base leading-none text-center">
        {description}
      </p>
    </div>
  );
};

export default SetupTitle;
