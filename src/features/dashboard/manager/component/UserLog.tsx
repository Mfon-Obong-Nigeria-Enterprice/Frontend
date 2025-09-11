import { ChevronLeft, ChevronRight } from "lucide-react";
import DashboardTitle from "../../shared/DashboardTitle";
import { useGoBack } from "@/hooks/useGoBack";
import { useMemo, useState } from "react";

// components
import Avatar from "../../shared/Avatar";

// ui component
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// hooks
import usePagination from "@/hooks/usePagination";

// stores
import { useActivityLogsStore } from "@/stores/useActivityLogsStore";
import { useUserStore } from "@/stores/useUserStore";

// PDF libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// types
import type { CompanyUser } from "@/stores/useUserStore";
import type { ActivityLogs } from "@/stores/useActivityLogsStore";
import UserSearchList from "../../shared/UserSearchList";

type ActivityWithUser = ActivityLogs & {
  user?: {
    name: string;
    profilePicture: string;
    location: string;
    role?: string;
  };
};

const UserLog = () => {
  const goBack = useGoBack();

  const { activities } = useActivityLogsStore();
  const { users } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    dateRange: "all",
    status: "all"
  });
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleViewClick = (activity: ActivityWithUser) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  // PDF Export Function
  const handleExportLog = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("User Audit Log Report", 105, 15, { align: "center" });
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });
    
    // Prepare table data
    const columns = [
      { header: "Timestamp", dataKey: "timestamp" },
      { header: "User", dataKey: "user" },
      { header: "Role", dataKey: "role" },
      { header: "Activity", dataKey: "activity" },
      { header: "Status", dataKey: "status" },
      { header: "Location", dataKey: "location" }
    ];
    
    const rows = filteredActivities.map(activity => ({
      timestamp: new Date(activity.timestamp).toLocaleString(),
      user: activity.user?.name || activity.performedBy,
      role: activity.user?.role || "UNKNOWN",
      activity: activity.action,
      status: activity.details ? "Success" : "Failed",
      location: activity.user?.location || "N/A"
    }));
    
    // Generate table
    autoTable(doc, {
      startY: 30,
      head: [columns.map(col => col.header)],
      body: rows.map(row => columns.map(col => row[col.dataKey as keyof typeof row])),
      theme: 'grid',
      headStyles: {
        fillColor: [44, 62, 80], // Dark blue header
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      margin: { top: 30 }
    });
    
    // Add page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: "center" });
    }
    
    // Save the PDF
    const date = new Date().toISOString().split('T')[0];
    doc.save(`user-audit-log-${date}.pdf`);
  };

  // Single Activity PDF Export (for modal)
  const handleExportSingleLog = () => {
    if (!selectedActivity) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Audit Log Entry Details", 105, 15, { align: "center" });
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });
    
    let yPosition = 35;
    
    // User Information Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text("User Information", 14, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    doc.text("User:", 14, yPosition);
    doc.text(selectedActivity.user?.name || selectedActivity.performedBy, 40, yPosition);
    yPosition += 7;
    
    doc.text("Email:", 14, yPosition);
    doc.text(selectedActivity.performedBy, 40, yPosition);
    yPosition += 7;
    
    doc.text("Role:", 14, yPosition);
    doc.text(selectedActivity.user?.role || "UNKNOWN", 40, yPosition);
    yPosition += 7;
    
    doc.text("Location:", 14, yPosition);
    doc.text(selectedActivity.user?.location || "N/A", 40, yPosition);
    yPosition += 12;
    
    // Action Details Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text("Action Details", 14, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    doc.text("Action:", 14, yPosition);
    doc.text(selectedActivity.action, 40, yPosition);
    yPosition += 7;
    
    doc.text("Status:", 14, yPosition);
    doc.text(selectedActivity.details ? "Success" : "Failed", 40, yPosition);
    yPosition += 7;
    
    doc.text("Timestamp:", 14, yPosition);
    doc.text(new Date(selectedActivity.timestamp).toLocaleString(), 40, yPosition);
    yPosition += 7;
    
    doc.text("Device:", 14, yPosition);
    doc.text(selectedActivity.device || "N/A", 40, yPosition);
    yPosition += 7;
    
    doc.text("Details:", 14, yPosition);
    
    // Handle long details with text wrapping
    const details = selectedActivity.details || "No additional details";
    const splitDetails = doc.splitTextToSize(details, 180);
    doc.text(splitDetails, 40, yPosition);
    
    // Save the PDF
    doc.save(`audit-log-entry-${selectedActivity.user?.name || "unknown"}-${new Date(selectedActivity.timestamp).toISOString().split('T')[0]}.pdf`);
  };

  // Get unique roles for filter dropdown
  const roles = useMemo(() => {
    const uniqueRoles = new Set<string>();
    users.forEach(user => uniqueRoles.add(user.role));
    return Array.from(uniqueRoles);
  }, [users]);

  const toggleRow = (i: number) => {
    setExpandedRows((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const mergeActivitiesWithUsers = (
    activities: ActivityLogs[],
    users: CompanyUser[]
  ): ActivityWithUser[] => {
    const userMap = new Map(users.map((u) => [u.email, u]));

    return activities.map((activity) => {
      if (activity.performedBy === "System") {
        return {
          ...activity,
          user: {
            name: "System",
            profilePicture: "SS",
            location: "",
            role: "SYSTEM"
          },
        };
      }

      const user = userMap.get(activity.performedBy);

      return {
        ...activity,
        user: user
          ? {
              name: user.name,
              profilePicture: user.profilePicture,
              location: user.branch,
              role: user.role
            }
          : {
              name: activity.performedBy,
              profilePicture: "/default-avatar.png",
              location: "N/A",
              role: "UNKNOWN"
            },
      };
    });
  };

  // Filter activities based on search and filters
  const filteredActivities = useMemo(() => {
    let result = mergeActivitiesWithUsers(activities, users);

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(activity => {
        return (
          activity.user?.name?.toLowerCase().includes(query) ||
          activity.performedBy.toLowerCase().includes(query) ||
          activity.action.toLowerCase().includes(query) ||
          activity.details.toLowerCase().includes(query) ||
          activity.device?.toLowerCase().includes(query) ||
          activity.user?.role?.toLowerCase().includes(query)
        );
      });
    }

    // Apply role filter
    if (filters.role !== "all") {
      result = result.filter(activity => activity.user?.role === filters.role);
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      result = result.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        
        switch (filters.dateRange) {
          case "today":
            return activityDate.toDateString() === now.toDateString();
          case "week":
            { const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return activityDate >= weekAgo; }
          case "month":
            { const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return activityDate >= monthAgo; }
          default:
            return true;
        }
      });
    }

    return result;
  }, [activities, users, searchQuery, filters]);

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(filteredActivities.length, 6);

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * 6;
    const endIndex = startIndex + 6;
    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, currentPage]);

  return (
    <div>
      {/* breadcrumb */}
      <div className="flex items-center gap-0.5">
        <span
          onClick={goBack}
          role="button"
          className="cursor-pointer text-sm text-[#444444] hover:underline"
        >
          user management
        </span>
        <ChevronRight className="size-3.5" />
        <span className="cursor-pointer text-sm text-[#444444] hover:underline">
          user audit log
        </span>
      </div>
      {/* start */}

      <main className="mt-5">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <DashboardTitle heading="User Audit Log" description="" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              </label>
              <span className="text-sm text-muted-foreground">
                Auto Refresh
              </span>
            </div>

            {/* back to user list */}
            <Button variant="outline" onClick={goBack}>
              <ChevronLeft /> Back to user list
            </Button>

            <Button onClick={handleExportLog}>Export Log</Button>
          </div>
        </div>

        <UserSearchList 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          roles={roles}
        />

        {/* activity log table */}
        <div className="bg-white border border-[#d9d9d9] rounded-[10px] mt-[40px] overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="py-3 px-4 text-[#333333] text-sm font-medium">
                  Timestamp
                </TableHead>
                <TableHead className="py-3 px-4 text-left font-semibold text-[#333]">
                  User details
                </TableHead>
                <TableHead className="font-semibold text-[#333]">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-[#333]">
                  Activity
                </TableHead>
                <TableHead className="font-semibold text-[#333]">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-[#333]">
                  Location
                </TableHead>
                <TableHead className="font-semibold text-[#333]">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="">
              {paginatedActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchQuery || Object.values(filters).some(f => f !== "all") 
                      ? "No activities match your search criteria" 
                      : "No activities found"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedActivities.map((a, i) => (
                  <TableRow key={i} className="pl-5">
                    <TableCell className="">
                      <span className="block text-xs text-[#444444]">
                        {new Date(a.timestamp).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="block text-[0.625rem] text-[#7D7D7D]">
                        {new Date(a.timestamp).toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-1.5 items-center">
                      <Avatar
                      name={a.user?.name}
                      profilePicture={a.user?.profilePicture}
                      role={a.role}
                    />
                      <p>
                        <span className="block text-xs font-medium text-[#444444]">
                          {a.user?.name}
                        </span>
                        <span className="block text-[9px] text-[#7D7D7D]">
                          {a.performedBy}
                        </span>
                      </p>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`min-w-16 mx-auto text-center py-2 px-2.5 rounded ${
                          a.user?.role === "STAFF"
                            ? "bg-[#2ECC7133] text-[#05431F]"
                            : a.user?.role === "ADMIN"
                            ? "bg-[#FFF2CE] text-[#F39C12]"
                            : a.user?.role === "SYSTEM"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-[#E2F3EB] text-[#1A3C7E]"
                        }`}
                      >
                        {a.user?.role === "MAINTAINER"
                          ? "MAINT"
                          : a.user?.role === "SUPER_ADMIN"
                          ? "MANAGER"
                          : a.user?.role === "SYSTEM"
                          ? "SYSTEM"
                          : a.user?.role || "UNKNOWN"}
                      </span>
                    </TableCell>
                    <TableCell
                      onClick={() => toggleRow(i)}
                      title={!expandedRows[i] ? a.details : ""}
                      className={`cursor-pointer ${
                        expandedRows[i] ? "whitespace-pre-wrap" : "truncate"
                      } max-w-[170px]`}
                    >
                      {a.details}
                    </TableCell>
                    <TableCell className="text-[#1AD410]">
                      {a.details ? "Success" : "Failed"}
                    </TableCell>
                    <TableCell>{a.user?.location}</TableCell>
                    <TableCell 
                      className="text-[#3D80FF] underline cursor-pointer hover:text-[#2a5cb9] transition-colors"
                      onClick={() => handleViewClick(a)}
                    >
                      view
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredActivities.length > 0 && (
            <div className="h-14 border-y border-[#D9D9D9] text-sm text-[#7D7D7D] flex justify-center items-center gap-3">
              <Pagination>
                <PaginationContent className="!flex !justify-between w-full px-5">
                  <PaginationItem>
                    {(() => {
                      const start = (currentPage - 1) * 6 + 1;
                      const end = Math.min(
                        currentPage * 6,
                        filteredActivities.length
                      );
                      return `Showing ${start}-${end} of ${filteredActivities.length} activities (Page ${currentPage} of ${totalPages})`;
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
                      />
                    </PaginationItem>
                    <PaginationItem className="flex items-center justify-center bg-[#8C1C1380] w-[34px] h-[34px] rounded px-4 text-lg text-white">
                      {currentPage}
                    </PaginationItem>
                    <PaginationNext
                      onClick={canGoNext ? goToNextPage : undefined}
                      className={`border  border-[#d9d9d9] ${
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
        </div>
      </main>

      {/* Modal for Audit Log Details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl overflow-hidden ">
          <DialogHeader className="px-6 pt-6 pb-3 border-b">
            <DialogTitle>Audit Log Entry Details</DialogTitle>
            
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-6">
              {/* User Information Section */}
              <div>
                <h3 className="text-lg font-medium text-[#2c3e50] mb-3 pb-2 border-b"> User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#7f8c8d] font-medium">User</p>
                    <p className="text-[#2c3e50] text-sm">{selectedActivity.user?.name || selectedActivity.performedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7f8c8d] font-medium">Email</p>
                    <p className="text-[#2c3e50] text-sm">{selectedActivity.performedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7f8c8d] font-medium">Role</p>
                    <p className="text-[#F39C12] bg-[#FFF2CE] border rounded-sm max-w-fit text-sm">{selectedActivity.user?.role || "UNKNOWN"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7f8c8d] font-medium">Location</p>
                    <p className="text-[#2c3e50] text-sm">{selectedActivity.user?.location || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Action Details Section */}
              <div>
                <h3 className="text-lg font-medium text-[#2c3e50] mb-3 pb-2 border-b">Action Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#7f8c8d] font-medium">Action</p>
                    <p className="text-[#2c3e50] text-sm">{selectedActivity.action}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7f8c8d] font-medium">Status</p>
                    <span className={`text-sm font-medium ${
                      selectedActivity.details ? " text-[#1AD410]" : " text-[#721c24]"
                    }`}>
                      {selectedActivity.details ? "Success" : "Failed"}
                    </span>
                  </div>
                  <div className="text-sm text-[#7f8c8d]">
                     <p className="text-sm text-[#7f8c8d] font-medium">TimeStamp</p>
                  <p className="text-[#2c3e50]">
                    {new Date(selectedActivity.timestamp).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })} - {new Date(selectedActivity.timestamp).toLocaleTimeString()}
                  </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7f8c8d] font-medium">Details</p>
                    <p className="text-[#2c3e50] text-sm">{selectedActivity.details || "No additional details"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7f8c8d] font-medium">Device</p>
                    <p className="text-[#2c3e50] text-sm">{selectedActivity.device || "N/A"}</p>
                  </div>
                </div>
              </div>
              
<div className="border-t p-4 mt-6 flex justify-end gap-3">
      <Button 
        onClick={() => setIsModalOpen(false)} 
        className="bg-white border border-black text-black hover:bg-white hover:text-black"
      >
        Close
      </Button>
      <Button onClick={handleExportSingleLog}>
        Export
      </Button>
    </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserLog;