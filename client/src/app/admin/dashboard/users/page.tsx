"use client";

import { SearchAndFilterBar } from "@/src/components/admin/users/SearchAndFilterBar";
import { UserTable } from "@/src/components/admin/users/UserTable";
import { getRequest, patchRequest } from "@/src/services/api";
import { UserRole } from "@/src/types/adminTypes";
import { IUser } from "@/src/types/authTypes";
import { useEffect, useState } from "react";

const User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<IUser[]>([]);

  const usersPerPage = 8;

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const res = await getRequest("/admin/getAllUsers");
    if (res.ok) {
      setUsers(res.users);
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && !user.isBlocked) ||
      (statusFilter === 'Blocked' && user.isBlocked);
  
    return matchesSearch && matchesStatus;
  });
  

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  async function onBlockToggle(id: string, status: boolean) {
    const res = await patchRequest("/admin/block-user", { id, status });
    if (res.ok) {
      setUsers(prev =>
        prev.map(user =>
          user._id === id ? { ...user, isBlocked: status } : user
        )
      );
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
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}       />

        <div className="rounded-lg shadow-sm overflow-hidden bg-white">
          <UserTable
            onBlockToggle={onBlockToggle}
            currentUsers={currentUsers}
            getRoleColor={getRoleColor}
          />

          
        </div>
      </div>
    </div>
  );
};

export default User;
