import React from "react";
import BusinessReport1 from "./component/BusinessReport1";
import TotalRevenueTrends from "./component/TotalRevenueTrends";
import SalesAnalytic from "./component/SalesAnalytic";

interface Product {
  prodName: string;
  soldUnit: number;
  revenue: number;
  category: string;
}



const topProducts: Product[] = [
  {
    prodName: "cement",
    soldUnit: 320,
    revenue: 960000,
    category: "construction",
  },
  {
    prodName: "Rod",
    soldUnit: 190,
    revenue: 285000,
    category: "Reinforcement",
  },
  {
    prodName: "Tiles",
    soldUnit: 100,
    revenue: 280000,
    category: "Finishing",
  },
];



const BusinessReport: React.FC = () => {
  return (
    <div>
      <BusinessReport1 />
      <TotalRevenueTrends />
      <SalesAnalytic 
        topProduct={topProducts}
      />
    </div>
  );
};

export default BusinessReport;