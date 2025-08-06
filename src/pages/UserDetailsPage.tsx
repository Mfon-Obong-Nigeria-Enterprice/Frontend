/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, ArrowLeft } from "lucide-react";

import Header from "@/components/header/Header";
import ManagerSidebar from "@/features/sidebar/ManagerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const UserDetailsPage = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [suspendModal, setSuspendModal] = useState(false);
  const [enableModal, setEnableModal] = useState(false);
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    // Fetch user details
    fetch(`https://mfon-obong-enterprise.onrender.com/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(`Error ${res.status}: ${text}`);
        const data = JSON.parse(text);
        setUser(data);
        // Optionally fetch activities if available
        if (Array.isArray(data.activities)) setActivities(data.activities);
      })
      .catch(() => setUser(null));
  }, [userId]);

  // Fallback for loading state
  if (!user) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-[#F9F9F9]">
          <ManagerSidebar />
          <div className="flex-1 flex flex-col items-center justify-center">
            <Header userRole="manager" />
            <div className="text-lg text-[#444] mt-20">
              Loading user details...
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Format account details
  const accountDetails = [
    {
      label: "Created Date",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "-",
    },
    { label: "Last Login", value: user.lastLogin || "-" },
    { label: "Total Logins", value: user.totalLogins || "-" },
    { label: "Session Duration", value: user.sessionDuration || "-" },
    { label: "Address", value: user.address || "-" },
    {
      label: "Sales Recorded",
      value: user.salesRecorded ? `₦${user.salesRecorded}` : "-",
    },
  ];

  // Format activities
  const staffActivities =
    Array.isArray(activities) && activities.length > 0
      ? activities
          .slice(0, 4)
          .map((a) => ({ activity: a.activity, time: a.time }))
      : [
          { activity: "Logged into the system", time: "Today at 9:23 AM" },
          {
            activity: "Record a new sales - Udom construction (₦125,000)",
            time: "Today at 11:45 AM",
          },
          { activity: "Profile image updated", time: "3 days ago at 2:13 PM" },
          {
            activity:
              "Recorded partial pickup: 20 bags of cement for Ade properties",
            time: "Yesterday at 2:00 PM",
          },
        ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F9F9F9]">
        <ManagerSidebar activeMenu="user-management" />
        <div className="flex-1 flex flex-col">
          <Header userRole="manager" />
          {/* Breadcrumb at top */}
          <div className="w-full bg-white px-8 pt-6 pb-2 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span className="font-semibold text-[#333]">User management</span>
              <span className="mx-1">&gt;</span>
              <span className="font-semibold text-[#333]">View User Data</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#333]">User Details</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  size="sm"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="size-4" /> Back to User List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSuspendModal(true)}
                >
                  Suspend User
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEnableModal(true)}
                >
                  Enable User
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteModal(true)}
                >
                  Delete User
                </Button>
              </div>
            </div>
          </div>
          {/* User Card and Details - full width */}
          <div className="w-full py-6 px-0">
            <div className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center gap-6 p-8 mb-8 border border-[#F0F0F0] w-full">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={user.profilePicture || "/images/manager-avatar.png"}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user.name ? user.name[0] : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <span className="text-2xl font-semibold text-[#333]">
                    {user.name}
                  </span>
                  <Badge
                    variant="default"
                    className={`capitalize text-xs px-3 py-1 font-medium ${
                      user.isActive
                        ? "bg-[#EAFBE7] text-[#2ECC71]"
                        : "bg-[#FDEDED] text-[#E74C3C]"
                    }`}
                  >
                    {user.isActive ? "Active" : user.status || "Inactive"}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1 mb-1">
                  <span className="text-[#666] text-sm mb-4">{user.email}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono">
                      <svg
                        className="w-4 h-4 text-[#888]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                      User ID: {user.userId || user._id}
                    </span>
                    <span className="mx-1">|</span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-[#888]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      Role: {user.role}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <svg
                      className="w-4 h-4 text-[#888]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.657 16.657L13.414 12.414a4 4 0 1 0-1.414 1.414l4.243 4.243a1 1 0 0 0 1.414-1.414z" />
                      <circle cx="9" cy="9" r="3" />
                    </svg>
                    Location: {user.location}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm text-[#444] bg-[#F5F5F5] px-4 py-2 rounded-lg border flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#333"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-13Z" />
                    <path d="M8 10h8M8 14h5" />
                  </svg>
                  Cell: {user.phone || user.mobile || "-"}
                </span>
                <span className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    {/* Calendar Icon for Created */}
                    <svg className="w-4 h-4 text-[#888]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="4" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </span>
                  <span className="mx-1">|</span>
                  <span className="flex items-center gap-1">
                    {/* Briefcase Icon for Department */}
                    <svg className="w-4 h-4 text-[#888]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="2" y="7" width="20" height="13" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                    Department: {user.department || "-"}
                  </span>
                </span>
              </div>
            </div>
            {/* Details Grid - full width */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full">
              <div className="bg-white rounded-xl shadow p-6 border border-[#F0F0F0] w-full">
                <h2 className="text-lg font-semibold mb-4 text-[#333]">
                  Account Details
                </h2>
                <hr className="border-[#F0F0F0] mb-4 border-1" />
                <ul className="divide-y divide-[#F0F0F0]">
                  {accountDetails.map((detail) => (
                    <li
                      key={detail.label}
                      className="flex justify-between items-center text-base text-[#444] py-3"
                    >
                      <span>{detail.label}</span>
                      <span>{detail.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow p-6 border border-[#F0F0F0] w-full">
                <h2 className="text-lg font-semibold mb-4 text-[#333]">
                  Staff Activities
                </h2>
                <hr className="border-[#F0F0F0] mb-4 border-1" />
                <ul className="divide-y divide-[#F0F0F0]">
                  {staffActivities.map((activity, idx) => (
                    <li key={idx} className="py-3">
                      <div className="text-base text-[#444] mb-1">
                        {activity.activity}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {activity.time}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span>
                    Showing 1-4 of {activities.length || 4} Activities
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base"
                      disabled
                    >
                      &#60;
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-[#F5EAEA] text-[#B0B0B0] font-semibold text-base">
                      1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base">
                      &#62;
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Export Button */}
            <div className="flex justify-end mb-8">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLink className="size-4" /> Export User Report
              </Button>
            </div>
            {/* Modals */}
            {deleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl">
                  <h3 className="text-lg font-bold mb-4">Delete User?</h3>
                  <p className="mb-6">
                    Are you sure you want to delete this user?
                  </p>
                  <div className="flex gap-4 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteModal(false)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {suspendModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl">
                  <h3 className="text-lg font-bold mb-4">Suspend User?</h3>
                  <p className="mb-6">
                    Are you sure you want to suspend this user?
                  </p>
                  <div className="flex gap-4 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setSuspendModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => setSuspendModal(false)}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {enableModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl">
                  <h3 className="text-lg font-bold mb-4">Enable User?</h3>
                  <p className="mb-6">
                    Are you sure you want to enable this user?
                  </p>
                  <div className="flex gap-4 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setEnableModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => setEnableModal(false)}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserDetailsPage;
