import { FaRegBell } from "react-icons/fa";
import { Avatar } from "flowbite-react";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="h-[4rem] fixed top-0 left-0 right-0 flex justify-between items-center px-2 py-5 bg-white">
      <Logo />
      {/* <div className="flex items-baseline-last gap-1 max-w-[282px]">
        <div>
          <img
            className="w-[4rem]"
            src="/logo.png"
            alt="Mfon-Enterprise Logo"
          />
        </div>
        <p className="font-Arial font-bold text-sm leading-none text-[#333333]">
          Mfon-Obong Nigerian Enterprise
        </p>
      </div> */}

      <div className="flex gap-4 items-center">
        <div className="border border-[#F5F5F5] rounded-full p-2">
          <FaRegBell />
        </div>
        <p>Admin User</p>
        {/* <div className=""> */}
        <Avatar
          img="/images/admin-avatar.svg"
          alt="Admin avatar"
          status="online"
          statusPosition="top-right"
          rounded
        />
        {/* </div> */}
      </div>
    </header>
  );
};

export default Header;
