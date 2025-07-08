import { FaRegBell } from "react-icons/fa";
import Logo from "../Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
type HeaderProps = {
  userRole?: "manager" | "maintainer" | "admin" | "staff";
};

const Header = ({ userRole }: HeaderProps) => {
  return (
    <header className="h-14 sm:h-16 fixed top-0 right-0 left-0 z-20 flex justify-between items-center pr-5 pl-10 py-3 bg-white">
      <div>
        <div className="hidden md:flex">
          <Logo />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="border border-[#F5F5F5] rounded-full p-2">
          <FaRegBell />
        </div>
        <p className="hidden sm:block capitalize">{userRole}</p>

        <Avatar>
          <AvatarImage src={`/images/${userRole}-avatar.png`} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
