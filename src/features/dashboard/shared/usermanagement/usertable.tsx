import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import DeleteUserModal from "./modals/deleteusermodal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import usePagination from "@/hooks/usePagination";

import { MoreVertical, ExternalLink } from "lucide-react";
import SuspendUserModal from "./modals/suspendusermodal";

const UserTable = () => {
  const navigate = useNavigate();
  // const { id } = useParams();
  const users = useUserStore((s) => s.users);
  const currentUser = useAuthStore((s) => s.user);
  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [suspendModal, setSuspendModal] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  // super admin sees all data except his own but maintainer only sees staff and admin
  const filteredUsers = users.filter((user) => {
    if (currentUser?.role === "SUPER_ADMIN") {
      return user.role !== "SUPER_ADMIN";
    }
    return user.role !== "MAINTAINER" && user.role !== "SUPER_ADMIN";
  });

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase(); // Single name, take first letter
    }
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
      0
    )}`.toUpperCase();
  };

  const {
    currentPage,
    // setCurrentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination((filteredUsers ?? []).length, 10);

  const currentUserList = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredUsers?.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  return (
    <div className="mt-5">
      <Table>
        <TableHeader>
          <TableRow className="w-full bg-[#F5F5F5]">
            <TableHead className="text-[#333] text-sm font-medium xl:font-semibold py-5 px-4 uppercase font-Inter">
              User ID
            </TableHead>
            <TableHead className="text-[#333] text-sm font-medium xl:font-semibold py-5 px-4 uppercase font-Inter">
              USER DETAILS
            </TableHead>
            <TableHead className="text-[#333] text-sm font-medium xl:font-semibold py-5 px-4 uppercase font-Inter">
              ROLE
            </TableHead>
            <TableHead className="text-[#333] text-sm font-medium xl:font-semibold py-5 px-4 uppercase font-Inter">
              PERMISSIONS
            </TableHead>
            <TableHead className="text-[#333] text-sm font-medium xl:font-semibold py-5 px-4 uppercase font-Inter">
              STATUS
            </TableHead>
            <TableHead className="text-[#333] text-sm font-medium xl:font-semibold py-5 px-4 uppercase font-Inter">
              LAST LOGIN
            </TableHead>
            <TableHead className="text-[#333] text-sm font-medium xl:font-semibold py-5 px-4 uppercase font-Inter">
              LOCATION
            </TableHead>
            <TableHead className="text-[#333] text-sm font-medium xl:font-semibold py-5 px-4 uppercase font-Inter">
              CREATED
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUserList.length < 1 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                No users found
              </TableCell>
            </TableRow>
          ) : (
            currentUserList.map((user, index) => {
              const userId = `U-${(index + 1).toString().padStart(3, "0")}`;
              return (
                <TableRow
                  key={user._id + 1}
                  className="relative px-5 font-Inter font-medium text-sm"
                >
                  {/* userID */}

                  <TableCell className="pl-5">{userId}</TableCell>

                  {/* photo, name, email */}
                  <TableCell className="flex items-center gap-2">
                    {/* photo */}
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`flex justify-center items-center w-full h-full text-white ${
                            user.role === "STAFF"
                              ? "bg-[#2ECC71]"
                              : user.role === "ADMIN"
                              ? "bg-[#392423]"
                              : "bg-[#F39C12]"
                          }`}
                        >
                          <span>{getInitials(user.name)}</span>
                        </div>
                      )}
                    </div>

                    {/* name and email */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#444444] font-medium text-sm">
                        {user.name}
                      </span>
                      <span className="text-[#7D7D7D] text-xs">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="">
                    <span
                      className={`min-w-16 mx-auto  text-center py-2 px-2.5 rounded ${
                        user.role === "STAFF"
                          ? "bg-[#2ECC7133] text-[#05431F]"
                          : user.role === "ADMIN"
                          ? "bg-[#FFF2CE] text-[#F39C12]"
                          : "bg-[#E2F3EB] text-[#1A3C7E]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="font-normal text-xs ">
                    {user.role === "STAFF"
                      ? "Record Sales"
                      : user.role === "ADMIN"
                      ? "Inventory, client"
                      : "System maintainer"}
                  </TableCell>

                  <TableCell
                    className={`text-xs ${
                      user.isBlocked
                        ? "text-[#F95353]" // suspended
                        : user.isActive
                        ? "text-[#1AD410]" // active
                        : "text-[#F39C12]" // inactive
                    }`}
                  >
                    {user.isBlocked
                      ? "Suspended"
                      : user.isActive
                      ? "Active"
                      : "Inactive"}
                  </TableCell>

                  <TableCell>Last login</TableCell>
                  <TableCell className="text-[#444444] font-normal">
                    {user.branch || "N/A"}
                  </TableCell>

                  <TableCell className="text-[#444444] font-normal">
                    {new Date(user.createdAt).toDateString()}
                  </TableCell>
                  <TableCell>
                    <Popover
                      open={popoverOpen === user._id}
                      onOpenChange={(open) =>
                        setPopoverOpen(open ? user._id : null)
                      }
                    >
                      <PopoverTrigger
                        asChild
                        // className="absolute top-1/2 -translate-y-1/2 right-0"
                      >
                        <button
                          className="ml-2 p-1 rounded hover:bg-muted border border-[#E0E0E0]"
                          aria-label="User actions"
                        >
                          <MoreVertical className="size-5 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-64 p-0 rounded-lg shadow-lg border border-[#F0F0F0]"
                      >
                        <>
                          <button
                            className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium"
                            onClick={() =>
                              navigate(
                                `/maintainer/dashboard/user-management/${user._id}`
                              )
                            }
                          >
                            <span className="flex-1 text-left">
                              View User Data
                            </span>
                            <ExternalLink className="size-4 text-muted-foreground" />
                          </button>
                          <button className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium">
                            <span className="flex-1 text-left">Edit User</span>
                            <ExternalLink className="size-4 text-muted-foreground" />
                          </button>
                          <button
                            className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium"
                            // onClick={() => handleEnableClick(user.name)}
                          >
                            <span className="flex-1 text-left">
                              Enable User
                            </span>
                          </button>
                          <button
                            className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium"
                            onClick={() => {
                              setSuspendModal({
                                id: user._id,
                                name: user.name,
                              });
                              setPopoverOpen(null);
                            }}
                          >
                            <span className="flex-1 text-left">
                              Suspend User
                            </span>
                          </button>
                          <button
                            className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium text-red-600"
                            onClick={() => {
                              setDeleteModal({
                                id: user._id,
                                name: user.name,
                              });
                              setPopoverOpen(null);
                            }}
                          >
                            <span className="flex-1 text-left">
                              Delete User
                            </span>
                          </button>
                        </>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {/* pagination */}

      {filteredUsers && currentUserList && (
        <div className="h-14 border-y border-[#D9D9D9] text-sm text-[#7D7D7D] flex justify-center items-center gap-3">
          <Pagination>
            <PaginationContent className="!flex !justify-between w-full px-5">
              <PaginationItem>
                {(() => {
                  const start = (currentPage - 1) * 10 + 1;
                  const end = Math.min(currentPage * 10, filteredUsers.length);
                  return `Showing ${start}-${end} of ${filteredUsers.length} users (Page ${currentPage} of ${totalPages})`;
                })()}
              </PaginationItem>
              <div className="flex justify-center gap-[18px]">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={canGoPrevious ? goToPreviousPage : undefined}
                    className={`border border-[#d9d9d9] ${
                      !canGoPrevious
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                    aria-label="Go to previous page"
                  ></PaginationPrevious>
                </PaginationItem>
                <PaginationItem className="flex items-center justify-center bg-[#8C1C1380] w-[34px] h-[34px] rounded px-4 text-lg text-white">
                  {currentPage}
                </PaginationItem>
                <PaginationNext
                  onClick={canGoNext ? goToNextPage : undefined}
                  className={`border border-[#d9d9d9] ${
                    !canGoNext
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }`}
                  aria-label="Go to next page"
                ></PaginationNext>
              </div>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* modal to delete user */}
      {deleteModal && (
        <DeleteUserModal
          user={deleteModal}
          onClose={() => setDeleteModal(null)}
        />
      )}

      {/* modal to suspend user */}
      {suspendModal && (
        <SuspendUserModal
          user={suspendModal}
          onClose={() => setSuspendModal(null)}
        />
      )}
    </div>
  );
};

export default UserTable;
