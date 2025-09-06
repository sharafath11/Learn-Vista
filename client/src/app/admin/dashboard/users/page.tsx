"use client";

import { SearchAndFilterBar } from "@/src/components/admin/SearchAndFilterBar";
import { UserTable } from "@/src/components/admin/users/UserTable";
import { CustomAlertDialog } from "@/src/components/custom-alert-dialog";
import { useAdminContext } from "@/src/context/adminContext";
import useDebounce from "@/src/hooks/useDebouncing";
import { AdminAPIMethods } from "@/src/services/methods/admin.api";
import { showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import { useEffect, useState } from "react";

const User = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Blocked" | "Approved" | "Pending" | "Rejected"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const usersPerPage = 2;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<boolean>(false);

  const { users, setUsers, getAllUsers, totalUsersCount } = useAdminContext();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    const filters: Record<string, unknown> = {};

    if (statusFilter === "Active") filters.isBlocked = false;
    else if (statusFilter === "Blocked") filters.isBlocked = true;

    const sort: Record<string, 1 | -1> = {
      username: sortOrder === "asc" ? 1 : -1,
    };

    getAllUsers({
      page: currentPage,
      search: debouncedSearchTerm,
      filters,
      limit: usersPerPage,
      sort,
    });
  }, [currentPage, debouncedSearchTerm, statusFilter, sortOrder, getAllUsers]);

  const totalPages = Math.ceil(totalUsersCount / usersPerPage);

  function handleBlockClick(id: string, status: boolean) {
    setSelectedUserId(id);
    setSelectedStatus(status);
    setIsDialogOpen(true);
  }

  async function confirmBlockToggle() {
    if (!selectedUserId) return;

    const res = await AdminAPIMethods.blockUser({
      id: selectedUserId,
      status: selectedStatus,
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUserId ? { ...user, isBlocked: selectedStatus } : user
        )
      );

      if (selectedStatus) {
        showInfoToast("User blocked");
      } else {
        showSuccessToast("User unblocked");
      }
    }
    setIsDialogOpen(false);
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "mentor":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          roleFilter={"User"}
        />

        <div className="rounded-lg shadow-sm overflow-hidden bg-white">
          <UserTable
            onBlockToggle={handleBlockClick}
            currentUsers={users}
            getRoleColor={getRoleColor}
          />
        </div>

        <div className="flex justify-center items-center mt-6">
          <nav
            className="inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                    ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      <CustomAlertDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={selectedStatus ? "Block User" : "Unblock User"}
        description={
          selectedStatus
            ? "Are you sure you want to block this user? They will lose access immediately."
            : "Are you sure you want to unblock this user?"
        }
        variant={selectedStatus ? "warning" : "info"}
        onConfirm={confirmBlockToggle}
        onCancel={() => setIsDialogOpen(false)}
        confirmText={selectedStatus ? "Yes, Block" : "Yes, Unblock"}
        cancelText="Cancel"
      />
    </div>
  );
};

export default User;
