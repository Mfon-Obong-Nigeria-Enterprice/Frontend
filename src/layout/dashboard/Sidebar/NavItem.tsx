import { NavLink } from "react-router-dom";

type NavItemProps = {
  to: string;
  icon: React.ReactNode | string;
  label: string;
};

const NavItem = ({ icon, label, to }: NavItemProps) => {
  return (
    <NavLink to={to} end={to === "/dashboard"}>
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default NavItem;
