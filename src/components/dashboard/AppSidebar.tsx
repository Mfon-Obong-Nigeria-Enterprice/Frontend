import { Link, useLocation } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineShoppingBag } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { IoPerson, IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarFooter,
  SidebarGroup,
  // SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard/overview",
    icon: MdOutlineDashboard,
  },
  { title: "Inventory", url: "/admin/dashboard/inventory", icon: BsBoxSeam },
  { title: "Clients", url: "/admin/dashboard/clients", icon: IoPerson },
  { title: "Sales", url: "/admin/dashboard/sales", icon: MdOutlineShoppingBag },
  {
    title: "Transactions",
    url: "/admin/dashboard/transactions",
    icon: RiLogoutCircleRLine,
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: IoSettingsOutline,
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  return (
    <Sidebar className="mt-[3.5rem] pt-10">
      {/* <SidebarHeader /> */}
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title} className="">
                    <SidebarMenuButton
                      asChild
                      className={`hover:bg-[#8C1C1380] hover:text-white rounded-sm p-6 my-1 flex items-center gap-3 transition-all
                        ${
                          isActive
                            ? "bg-[#8C1C1380] text-white"
                            : "bg-[#F4E8E7] text-[#333333] "
                        }`}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-[18vh]">
          <SidebarGroupContent>
            <SidebarMenuButton className="p-5 hover:bg-[#F4E8E7]">
              <IoIosLogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter> */}
      {/* <SidebarContent className="mt-auto">*/}
      {/* <SidebarMenuButton>
          <IoIosLogOut />
          <span>Logout</span>
        </SidebarMenuButton> */}
      {/* </SidebarContent>  */}
      {/* </SidebarFooter> */}
    </Sidebar>
  );
}

// import {
//   Sidebar,
//   SidebarItems,
//   SidebarItem,
//   SidebarItemGroup,
//   SidebarCTA,
// } from "flowbite-react";

// const navLinks = [
//   {
//     label: "Dashboard",
//     to: "/admin/dashboard/overview",
//     icon: MdOutlineDashboard,
//   },
//   { label: "Inventory", to: "/admin/dashboard/inventory", icon: BsBoxSeam },
//   { label: "Clients", to: "/admin/dashboard/clients", icon: IoPerson },
//   { label: "Sales", to: "/admin/dashboard/sales", icon: MdOutlineShoppingBag },
//   {
//     label: "Transactions",
//     to: "/admin/dashboard/transactions",
//     icon: RiLogoutCircleRLine,
//   },
//   {
//     label: "Settings",
//     to: "/admin/dashboard/settings",
//     icon: IoSettingsOutline,
//   },
// ];

// const Navbar: React.FC = () => {
//   return (
//     // <ThemeProvider>
//     <Sidebar className="fixed top-[5rem] z-30 left-0 h-full bg-white w-64 flex flex-col justify-between shadow-sm">
//       <SidebarItems>
//         <SidebarItemGroup className="border-none flex flex-col gap-4">
//           {navLinks.map((item) => (
//             <SidebarItem
//               key={item.label}
//               // href={item.to}
//               as={NavLink}
//               to={item.to}
//               icon={item.icon}
//               className=" bg-[#F4E8E7] hover:bg-[#8C1C1380] text-[#333333] hover:text-white p-4 active:bg-[#8C1C1380]  active:text-white"
//             >
//               {/* <NavLink to={item.to}>{item.label}</NavLink> */}
//               {item.label}
//             </SidebarItem>
//             // </NavLink>
//           ))}
//         </SidebarItemGroup>
//       </SidebarItems>
//       <SidebarCTA>
//         <button className="flex gap-3 items-center py-6 px-7 font-medium text-xl text-[#333333]">
//           <IoIosLogOut />
//           Logout
//         </button>
//       </SidebarCTA>
//     </Sidebar>
//     // </ThemeProvider>
//   );
// };

// export default Navbar;
