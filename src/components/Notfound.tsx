/** @format */

import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-gradient-to-tr from-[#F4E8E7] to-[#8C1C1380] overflow-hidden flex items-center justify-center">
      <svg
        viewBox="0 0 1440 320"
        className="absolute top-0 left-0 w-full h-64"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#F4E8E7"
          fillOpacity="1"
          d="M0,96L60,117.3C120,139,240,181,360,186.7C480,192,600,160,720,154.7C840,149,960,171,1080,170.7C1200,171,1320,149,1380,138.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </svg>
      {/*  #8C1C1380 */}
      <div className="relative z-10 text-center p-6 max-w-md">
        <h1 className="text-7xl font-extrabold text-[#8C1C1380] animate-pulse">
          404
        </h1>
        <p className="mt-4 text-2xl font-semibold text-gray-800">
          Oops! Page not found
        </p>
        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => navigate(-1)}
          className="mt-6 inline-block bg-[#8C1C1380] text-white font-medium rounded-lg shadow hover:bg-[[#8C1C1330]] transition"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};
export default Notfound;
