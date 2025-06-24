import { FaRegBell } from "react-icons/fa";
import { Avatar } from "flowbite-react";
import Logo from "./Logo";

type HeaderProps = {
  userRole?: "manager" | "admin" | "staff";
};

const Header = ({ userRole }: HeaderProps) => {
  return (
    <header className="h-[4rem] fixed top-0 right-0 left-0 z-0 flex justify-between items-center px-5 py-3 bg-white">
      <Logo />

      <div className="flex gap-4 items-center">
        <div className="border border-[#F5F5F5] rounded-full p-2">
          <FaRegBell />
        </div>
        <p className="capitalize">{userRole} User</p>

        <Avatar
          img={`/images/${userRole}-avatar.png`}
          alt={`${userRole} avatar`}
          status="online"
          statusPosition="top-right"
          rounded
        />
      </div>
    </header>
  );
};

export default Header;
