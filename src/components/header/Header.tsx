import { FaRegBell } from "react-icons/fa";
import { Menu } from "lucide-react";
import Logo from "../Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type HeaderProps = {
  userRole?: "manager" | "maintainer" | "admin" | "staff";
  onMenuClick?: () => void;
};

const Header = ({ userRole, onMenuClick }: HeaderProps) => {
  return (
    <header className="h-14 sm:h-16 fixed top-0 right-0 left-0 z-20 flex justify-between items-center px-4 sm:px-7 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="hidden md:block">
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
