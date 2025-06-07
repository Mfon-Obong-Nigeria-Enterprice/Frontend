import { FaRegBell } from "react-icons/fa";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-2 py-5 bg-white">
      <div className="flex items-baseline-last gap-1 max-w-[282px]">
        <div>
          <img
            className="w-[94px]"
            src="/logo.png"
            alt="Mfon-Enterprise Logo"
          />
        </div>
        <p className="font-Arial font-bold text-base text-[#333333]">
          Mfon-Obong Nigerian Enterprise
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="border border-[#F5F5F5] rounded-full p-2">
          <FaRegBell />
        </div>
        <p>Admin User</p>
        <div>
          {/* <img className="w-[70px]" src="/images/admin-avatar.svg" alt="" /> */}
          <img className="w-10" src="/images/admin-avatar.svg" alt="" />
        </div>
      </div>
    </header>
  );
};

export default Header;
