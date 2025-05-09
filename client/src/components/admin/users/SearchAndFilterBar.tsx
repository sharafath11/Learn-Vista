import { SearchAndFilterProps } from "@/src/types/adminTypes";
import React from "react";

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

  const statusOptions = roleFilter === "Mentor" ? mentorStatusOptions : userStatusOptions;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
      />

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(
            e.target.value as 'All' | 'Active' | 'Blocked' | 'Approved' | 'Pending' | 'Rejected'
          )
        }
        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
      >
        <option value="All">All Status</option>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
      >
        <option value="asc">Sort A-Z</option>
        <option value="desc">Sort Z-A</option>
      </select>
    </div>
  );
};
