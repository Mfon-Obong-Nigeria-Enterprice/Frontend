import React from "react";
import type { Role } from "@/types/types";

interface AvatarProps {
  name?: string;
  profilePicture?: string | null;
  role?: Role;
  size?: number; // default 36px
}

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
    0
  )}`.toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({
  name,
  profilePicture,
  role,
  size = 36,
}) => {
  const bgColor =
    role === "STAFF"
      ? "bg-[#2ECC71]"
      : role === "ADMIN"
      ? "bg-[#392423]"
      : "bg-[#F39C12]";

  return (
    <div
      className="bg-gray-500 rounded-full overflow-hidden flex items-center justify-center text-white"
      style={{ width: size, height: size }}
    >
      {profilePicture ? (
        <img
          src={profilePicture}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center ${bgColor}`}
        >
          <span className="text-sm font-medium">{getInitials(name)}</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
