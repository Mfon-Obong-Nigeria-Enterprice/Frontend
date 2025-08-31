// types
import type { CompanyUser } from "@/stores/useUserStore";

const ResetPassword = ({ user }: { user: CompanyUser }) => {
  return (
    <section>
      {/* heading */}
      <div className="flex items-center gap-7">
        {/* the shield icon */}
        <div className="flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#E6FFF1]">
          <img src="/icons/shield-locked.svg" />
        </div>

        {/* title and user's name */}
        <div>
          <h5 className="text-[#1E1E1E] text-xl font-medium">Reset Password</h5>
          <p className="text-[#7D7D7D]">{user?.name}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-[#F5F5F5]"></div>
    </section>
  );
};

export default ResetPassword;
