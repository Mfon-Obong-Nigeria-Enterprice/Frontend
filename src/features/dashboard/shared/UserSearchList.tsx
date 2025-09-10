// src/components/SearchAndFilter.tsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectGroup, 
  SelectItem} from "@/components/ui/select";
import { Search, MapPin, Users, CalendarDays, Zap } from "lucide-react";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filterName: string, value: string) => void;
  roles?: string[];
  locations?: string[];
}

const UserSearchList: React.FC<SearchAndFilterProps> = ({ 
  onSearch, 
  onFilterChange, 
  roles = [], 
  locations = [] 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case 'role':
        setSelectedRole(value);
        break;
      case 'location':
        setSelectedLocation(value);
        break;
      case 'dateRange':
        setSelectedDateRange(value);
        break;
      case 'status':
        setSelectedStatus(value);
        break;
      default:
        break;
    }
    onFilterChange(filterName, value);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-6 px-4 py-5 font-sans w-full">
      {/* Search Input */}
      <div className="relative w-full mb-2 lg:mb-0 flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="size-5" />
        </span>
        <Input
          type="text"
          placeholder="Search"
          className="pl-10 pr-4 py-5 rounded-lg border border-[#E0E0E0] w-full text-sm bg-[#F9F9F9] text-[#444] placeholder:text-[#B0B0B0]"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto flex-1">
        <div className="flex gap-2 w-full overflow-x-auto scrollbar-hide md:overflow-visible">
          {/* Role Filter */}
          <Select value={selectedRole} onValueChange={(value) => handleFilterChange('role', value)}>
            <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
              <Users className="size-4 text-muted-foreground" />
              <span>{selectedRole === "all" ? "All Roles" : selectedRole}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {/* Location Filter */}
          <Select value={selectedLocation} onValueChange={(value) => handleFilterChange('location', value)}>
            <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
              <MapPin className="size-4 text-muted-foreground" />
              <span>{selectedLocation === "all" ? "All Locations" : selectedLocation}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {/* Date Range Filter */}
          <Select value={selectedDateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
            <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
              <CalendarDays className="size-4 text-muted-foreground" />
              <span>{selectedDateRange === "all" ? "Date Range" : selectedDateRange}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Date Range</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
              <Zap className="size-4 text-muted-foreground fill-[#7D7D7D]" />
              <span>{selectedStatus === "all" ? "All Status" : selectedStatus}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserSearchList;