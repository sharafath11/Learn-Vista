"use client";

import { SearchAndFilterBar } from "@/src/components/admin/users/SearchAndFilterBar";
import { UserTable } from "@/src/components/admin/users/UserTable";
import { useAdminContext } from "@/src/context/adminContext";
import { AdminAPIMethods } from "@/src/services/APImethods";
import { showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import { useEffect, useState } from "react";

const User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const usersPerPage = 10;

  const { users, setUsers, getAllUsers, totalUsersCount } = useAdminContext();

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 700); 

    return () => clearTimeout(timer); 
  }, [searchTerm]);

  
  useEffect(() => {
    const filters: Record<string, unknown> = {};

    if (statusFilter === 'Active') filters.isBlocked = false;
    else if (statusFilter === 'Blocked') filters.isBlocked = true;

    const sort: Record<string, 1 | -1> = { username: sortOrder === 'asc' ? 1 : -1 };

    getAllUsers({
      page: currentPage,
      search: debouncedSearchTerm,
      filters,
      sort,
    });
  }, [currentPage, debouncedSearchTerm, statusFilter, sortOrder]);

  const totalPages = Math.ceil(totalUsersCount / usersPerPage);

  async function onBlockToggle(id: string, status: boolean) {
    const res = await AdminAPIMethods.blockUser({ id, status });
    if (res.ok) {
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, isBlocked: status } : user
        )
      );
      status ? showInfoToast(`User blocked`) : showSuccessToast("User unblocked");
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'mentor':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">User Management</h1>
        </div>

        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          sortOrder={sortOrder}
          setSortOrder={(val) => {
            setSortOrder(val);
            setCurrentPage(1);
          }}
        />

        <div className="rounded-lg shadow-sm overflow-hidden bg-white">
          <UserTable
            onBlockToggle={onBlockToggle}
            currentUsers={users}
            getRoleColor={getRoleColor}
          />
        </div>

        <div className="flex justify-center items-center mt-6">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === index + 1
                    ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default User;
