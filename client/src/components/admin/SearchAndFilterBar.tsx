import { SearchAndFilterProps } from "@/src/types/adminTypes";
import React from "react";
import { Input } from "@/src/components/shared/components/ui/input";
import { Button } from "@/src/components/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/shared/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const SearchAndFilterBar: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  roleFilter
}) => {
  const mentorStatusOptions = ['Approved', 'Pending', 'Rejected'];
  const userStatusOptions = ['Active', 'Blocked'];
  const courseStatusOptions = ['Active', 'Blocked'];

  const statusOptions = roleFilter === "Mentor" 
    ? mentorStatusOptions 
    : roleFilter === "Course" 
      ? courseStatusOptions 
      : userStatusOptions;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
      {/* Search with icon */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto justify-between gap-2">
            <span>{statusFilter === "All" ? "Status" : statusFilter}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem 
            onClick={() => setStatusFilter("All")}
            className={cn(statusFilter === "All" && "bg-accent")}
          >
            All Status
          </DropdownMenuItem>
          {statusOptions.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={cn(statusFilter === status && "bg-accent")}
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Order */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto justify-between gap-2">
            <span>{sortOrder === "asc" ? "A → Z" : "Z → A"}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuItem 
            onClick={() => setSortOrder("asc")}
            className={cn(sortOrder === "asc" && "bg-accent")}
          >
            A → Z
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortOrder("desc")}
            className={cn(sortOrder === "desc" && "bg-accent")}
          >
            Z → A
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};