import { MdOutlineDashboard, MdOutlineShoppingBag } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { IoPerson, IoSettingsOutline } from "react-icons/io5";

// import { useLocation } from "react-router-dom";

import NavItem from "./NavItem";

// type NavbarProps = {

// }

const navLinks = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: <MdOutlineDashboard />,
  },
  { label: "Inventory", to: "/admin/inventory", icon: <BsBoxSeam /> },
  { label: "Clients", to: "/admin/clients", icon: <IoPerson /> },
  { label: "Sales", to: "/admin/sales", icon: <MdOutlineShoppingBag /> },
  {
    label: "Transactions",
    to: "/admin/transactions",
    icon: <img src="/icons/transaction.svg" />,
  },
  { label: "Settings", to: "/admin/settings", icon: <IoSettingsOutline /> },
];

const Navbar = () => {
  //   const location = useLocation();

  return (
    <div className="flex flex-col justify-between">
      <nav className="bg-white flex flex-col gap-5">
        {navLinks.map((item) => (
          <NavItem
            key={item.to}
            icon={item.icon}
            to={item.to}
            label={item.label}
          />
        ))}
      </nav>

      <div>
        <p>Logout</p>
      </div>
    </div>
  );
};

export default Navbar;
