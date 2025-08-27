import React from "react";
import { Link } from "react-router-dom";

// import { MdOutlineShoppingBag } from "react-icons/md";
// import { HiUsers } from "react-icons/hi2";
// import { RiWallet2Line } from "react-icons/ri";
// import { BsBoxSeam } from "react-icons/bs";

const QuickActions: React.FC = () => {
  return (
    // <div className="hidden md:block bg-white rounded p-5 mb-8">
    //   <h4 className="text-lg text-[var(--cl-text-dark)] font-medium mb-3">
    //     Quick Actions
    //   </h4>

    //   <div className="grid grid-cols-4 gap-10 min-h-[6.25rem]">
    //     {/* one */}
    //     <Link
    //       to="/staff/dashboard/new-sales"
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         gap: "0.5rem",
    //         width: "100%",
    //         height: "150px",
    //         borderRadius: "0.75rem",
    //         color: "white",
    //         textDecoration: "none",
    //         background: `
    //           conic-gradient(from 180deg at 50% 50%, 
    //           #176639 0deg, 
    //           #239955 120deg, 
    //           #176639 240deg, 
    //           #176639 360deg)
    //         `,
    //       }}
    //     >
    //       <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    //         <MdOutlineShoppingBag style={{ fontSize: "1.8rem" }} />
    //         <h6>New Sales</h6>
    //       </div>
    //       <p style={{ fontSize: "0.9rem" }}>Process customer purchase</p>
    //     </Link>

    //     {/* two */}
    //     <Link
    //       to="/staff/dashboard/s-clients"
    //       className="relative w-full h-[150px] rounded-xl shadow-lg overflow-hidden
    //          flex flex-col items-center justify-center text-white
    //          bg-gradient-to-r from-[#176639] via-[#239955] to-[#176639]"
    //     >
    //       {/* Gradient overlays */}
    //       <div
    //         className="pointer-events-none absolute inset-0"
    //         aria-hidden="true"
    //       >
    //         {/* left radial */}
    //         <div
    //           className="absolute inset-0 left-20
    //   bg-[radial-gradient(130%_100%_at_5%_25%,transparent_45%,rgba(74,222,128,0.9)_60%,transparent_75%)]"
    //         ></div>
    //         {/* right radial */}
    //         <div
    //           className="absolute inset-0 right-20
    //   bg-[radial-gradient(130%_100%_at_95%_75%,transparent_45%,rgba(74,222,128,0.9)_60%,transparent_75%)]"
    //         ></div>
    //       </div>

    //       {/* Content */}
    //       <div className="relative z-10 flex flex-col items-center">
    //         {/* top row: icon + title */}
    //         <div className="flex items-center gap-2">
    //           <RiWallet2Line className="text-2xl" />
    //           <h6 className="text-lg font-medium">Client Balance</h6>
    //         </div>

    //         {/* bottom row: subtitle */}
    //         <p className="text-sm mt-1">Check account Status</p>
    //       </div>
    //     </Link>

    //     {/* three */}
    //     <Link
    //       to="/staff/dashboard/s-clients"
    //       className="relative flex flex-col justify-center items-center gap-2
    //          w-full h-[150px] rounded-xl text-white shadow-lg overflow-hidden
    //          bg-gradient-to-b from-[#215AC8] via-[#2F6DE3] to-[#3D80FF] transition"
    //     >
    //       {/* LEFT tip (upper-left) */}
    //       <div
    //         aria-hidden
    //         className="pointer-events-none absolute top-0 left-0 w-16 h-14 bg-white/15
    //            [clip-path:polygon(0%_0%,100%_0%,0%_100%)]"
    //       />

    //       {/* RIGHT tip (bottom-right) */}
    //       <div
    //         aria-hidden
    //         className="pointer-events-none absolute bottom-0 right-0 w-16 h-14 bg-white/15
    //            [clip-path:polygon(100%_0%,100%_100%,0%_100%)]"
    //       />

    //       {/* content */}
    //       <div className="flex flex-row items-center gap-2 relative z-10">
    //         <HiUsers className="text-3xl" />
    //         <h6 className="text-lg font-medium">Find Client</h6>
    //       </div>
    //       <p className="text-sm relative z-10">Search Client Records</p>
    //     </Link>

    //     {/* four */}
    //     <Link
    //       to="/staff/dashboard/s-stock"
    //       className="flex flex-col justify-center items-center gap-2 w-full h-[150px] rounded-xl text-white shadow-lg 
    //          bg-gradient-to-r from-[#215AC8] via-[#2F6DE3] to-[#3D80FF] 
    //           transition"
    //     >
    //       <div className="flex flex-row items-center gap-2">
    //         <BsBoxSeam className="text-xl" />
    //         <h6 className="text-base font-medium">Check Stock</h6>
    //       </div>
    //       <p className="text-sm">View Inventory Levels</p>
    //     </Link>
    //   </div>
    // </div>
    <div className="hidden md:block bg-white rounded-2xl mb-8 ">
      <h4 className="text-lg text-[var(--cl-text-dark)] pl-4 pt-3 font-medium mb-3">
          Quick Actions
      </h4>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 ">
      <Link to="/staff/dashboard/new-sales">
        <img
          src="/images/NewSales.svg"
          alt="Image 1"
          className="w-full h-auto rounded-lg hover:opacity-80 transition"
        />
      </Link>
      <Link to="/staff/dashboard/s-clients">
        <img
          src="/images/ClientBalance.svg"
          alt="Image 2"
          className="w-full h-auto rounded-lg hover:opacity-80 transition"
        />
      </Link>
      <Link to="/staff/dashboard/s-clients">
        <img
          src="/images/FindClient.svg"
          alt="Image 3"
          className="w-full h-auto rounded-lg hover:opacity-80 transition"
        />
      </Link>
      <Link to="/staff/dashboard/s-stock">
        <img
          src="/images/CheckStock.svg"
          alt="Image 4"
          className="w-full h-auto rounded-lg hover:opacity-80 transition"
        />
      </Link>
    </div>
    
    
    </div>


  );
};

export default QuickActions;
