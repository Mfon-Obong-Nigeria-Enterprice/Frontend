import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

// components
import UserAccountDetails from "./useraccountdetails";

// hooks
import { useGoBack } from "@/hooks/useGoBack";

// stores
import { useUserStore } from "@/stores/useUserStore";
import { useActivityLogsStore } from "@/stores/useActivityLogsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useModalStore } from "@/stores/useModalStore";

// ui components
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

// icons
import { ChevronLeft, ChevronRight, MapPin, Trash2 } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineCall } from "react-icons/md";
import { RiCalendar2Line } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import { RxHamburgerMenu } from "react-icons/rx";

// types
import type { CompanyUser } from "@/stores/useUserStore";
import ResetPassword from "./modals/resetpassword";
import Modal from "@/components/Modal";

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const goback = useGoBack();
  const userAccount = useAuthStore((s) => s.user);
  const { users } = useUserStore();
  const { openDelete, openStatus } = useModalStore();

  const activityLogs = useActivityLogsStore((s) => s.activities);
  const [isPasswordModal, setIsPasswordModal] = useState<boolean>(false);

  // Get the passed data from navigation state
  const { userData, activities, lastLogin, activityCount } =
    location.state || {};

  // Fallback: if no state passed, fetch from store
  const user: CompanyUser = userData || users.find((u) => u._id === id);

  const handleResetPassword = () => {
    setIsPasswordModal(true);
  };
  const handleClosePasswordModal = () => {
    setIsPasswordModal(false);
  };

  // If no activities passed, fetch from store
  const userActivities =
    activities ||
    activityLogs.filter(
      (log) => log.performedBy === user?._id || log.performedBy === user?.email
    );

  // Fallback if no user found
  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-lg text-[#444] mt-20">
          This user details is not found...
        </div>
      </div>
    );
  }

  return (
    <section>
      {/* breadcrumb */}
      <p className="flex items-center gap-0.5 text-sm text-[#444444]">
        <span onClick={goback} className="hover:underline cursor-pointer">
          User management
        </span>
        <ChevronRight className="size-3" />
        <span> View User Data</span>
      </p>

      {/* heading */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-10 ">
        <div className="flex-1 flex justify-between items-center">
          <h4 className="text-xl md:text-2xl font-bold text-[#333]">
            User Details
          </h4>
          <Popover>
            <PopoverTrigger>
              <RxHamburgerMenu className="md:hidden fill-[#7D7D7D] cursor-pointer" />
            </PopoverTrigger>

            <PopoverContent className="space-y-3 w-fit mr-4">
              {user.isBlocked ? (
                <span
                  onClick={() => openStatus(user._id, user.name, "enable")}
                  className="pb-2"
                >
                  Enable user
                </span>
              ) : (
                <span
                  onClick={() => openStatus(user._id, user.name, "suspend")}
                  className="pb-2"
                >
                  Suspend user
                </span>
              )}

              <Separator />

              {userAccount?.role === "MAINTAINER" && (
                <span onClick={handleResetPassword} className="menu-item">
                  Reset Password
                </span>
              )}

              <Separator />
              <span
                onClick={() => {
                  openDelete(user._id, user.name);
                }}
              >
                Delete User
              </span>
            </PopoverContent>
          </Popover>
        </div>

        {/* buttons */}
        <div className="flex gap-5">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ChevronLeft /> Back to user list
          </Button>
          <div className="hidden md:block">
            {user.isBlocked ? (
              <Button
                variant="blueoutline"
                onClick={() => openStatus(user._id, user.name, "enable")}
              >
                Enable user
              </Button>
            ) : (
              <Button
                variant="blueoutline"
                onClick={() => openStatus(user._id, user.name, "suspend")}
              >
                Suspend user
              </Button>
            )}
          </div>

          {userAccount?.role === "MAINTAINER" && (
            <button
              onClick={handleResetPassword}
              className="hidden md:block item-center cursor-pointer text-sm bg-[#2ECC71] text-[#FFFFFF] px-4 py-2 rounded-[10px] hover:bg-[#2ecc7090] transition-colors font-medium items-center gap-2"
            >
              Reset Password
            </button>
          )}
          <Button
            variant="destructive"
            onClick={() => {
              openDelete(user._id, user.name);
            }}
            className="hidden md:flex"
          >
            <Trash2 /> Delete User
          </Button>
        </div>
      </div>

      {/* top user info */}
      <article className="bg-white rounded-[10px] py-4 px-2 md:p-7 backdrop-blur-2xl mt-[36px]">
        {/*  user profile */}
        <div className="flex gap-3 md:gap-10">
          {/* image */}
          <div className="max-w-[94px] w-full max-h-[94px] shadow-md aspect-auto rounded-full border-2 overflow-hidden">
            {user.profilePicture ? (
              <img
                src={user?.profilePicture}
                alt={user?.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full max-w-[94px] bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-3xl">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>

          {/* details with name, status, email*/}
          <article className="flex-1 flex flex-col md:flex-row md:justify-between gap-3">
            {/* left with name and email */}

            {/* name and email */}
            <div>
              <div className="flex gap-5">
                <h6 className="text-xl md:text-[28px] font-medium text-[#333333]">
                  {user?.name}
                </h6>
                <span
                  className={`inline-flex justify-center items-center mt-2 text-[8px] md:text-sm md:min-w-[67px] h-5 md:h-[28px] rounded-full p-2.5 ${
                    user.isBlocked
                      ? "bg-[#FFCACA] text-[#F95353]"
                      : user.isActive
                      ? "bg-[#E2F3EB] text-[#1AD410]"
                      : "bg-[#FFE7A4] text-[#F39C12]"
                  }`}
                >
                  {user.isBlocked
                    ? "Suspended"
                    : user.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
              <p className="text-xs md:text-base text-[#333333]">
                {user?.email}
              </p>
            </div>

            {/* right with phone number */}
            <div className="h-12 flex items-center gap-3 w-fit border border-[#d9d9d9] p-2 md:px-6 rounded-[8px] text-[#333333]">
              <MdOutlineCall className="size-3 md:size-4.5" />
              <span className="text-xs md:text-base">Cell: {user?.phone}</span>
            </div>
          </article>
        </div>

        {/* roles and other data */}
        <div className="flex justify-between items-center mt-8 md:ml-[94px]">
          {/* left side roles */}
          <div className="flex gap-5">
            {/* user role */}
            <div className="flex items-center-safe gap-1 text-[#333333] text-xs">
              <FaRegUser className="size-2.5" />
              <span className="capitalize">
                Role: {user.role.toLowerCase()}
              </span>
            </div>

            {/* user's branch */}
            <div className="flex items-center-safe gap-1 text-[#333333] text-xs">
              <MapPin className="size-2.5" />
              <span className="capitalize">Location: {user.branch}</span>
            </div>
          </div>

          {/* right side details */}
          <div className="hidden md:flex gap-4">
            {/* date created */}
            <div className="flex items-center-safe gap-1">
              <RiCalendar2Line className="size-2.5" />
              <span className="text-[#333333] text-xs">
                Created: {new Date(user.createdAt).toDateString()}
              </span>
            </div>

            {/* separator */}
            <p className="bg-[#7d7d7d] w-[1px] h-5" />

            {/* department */}
            <div className="flex items-center-safe gap-1">
              <HiUsers className="size-2.5" />
              <p className="text-[#333333] text-xs">
                Department:{" "}
                <span>
                  {user.role === "STAFF"
                    ? "Sales"
                    : user.role === "ADMIN"
                    ? "Administration"
                    : "System maintainance"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* account details + activities */}
      <UserAccountDetails
        user={user}
        activities={userActivities}
        lastLogin={lastLogin}
        activityCount={activityCount}
      />

      <div className="md:flex md:justify-end mt-5">
        <Button
          variant="outline"
          className="w-full md:w-fit h-[46px] cursor-pointer"
        >
          Export User Report
        </Button>
      </div>
      {/* reset password modal */}
      {isPasswordModal && (
        <Modal
          isOpen={isPasswordModal}
          onClose={handleClosePasswordModal}
          size="xl"
        >
          <ResetPassword user={user} onClose={handleClosePasswordModal} />
        </Modal>
      )}
    </section>
  );
};

export default UserDetailsPage;
