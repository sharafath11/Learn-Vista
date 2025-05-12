"use client";

import { useEffect, useState, useMemo } from "react";
import { MoreHorizontal, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAdminContext } from "@/src/context/adminContext";
import { AdminAPIMethods } from "@/src/services/APImethods";
import { showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import CategoryForm from "./categoriesModal";
import { SearchAndFilterBar } from "@/src/components/admin/SearchAndFilterBar";

interface Category {
  _id: string;
  title: string;
  description: string;
  isBlock: boolean;
  createdAt: string;
}

export default function CategoriesList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const { cat: categories, setCat: setCategories } = useAdminContext();
 console.log("categoiries",categories)
  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Blocked" | "Approved" | "Pending" | "Rejected">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const categoriesPerPage = 2;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories with filters
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const filters: Record<string, any> = {};
        if (statusFilter !== "All") {
          filters.isBlock = statusFilter === "Blocked";
        }

        const res = await AdminAPIMethods.getGetegories({
          page: currentPage,
          limit: categoriesPerPage,
          search: debouncedSearchTerm,
          sort: { createdAt: sortOrder === "asc" ? 1 : -1 },
          filters,
        });

        if (res.ok) {
          setCategories(res.data.categories);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [debouncedSearchTerm, statusFilter, sortOrder, currentPage, categoriesPerPage]);

  const handleToggleBlock = async (id: string, status: boolean) => {
    const res = await AdminAPIMethods.blockCategorie(id, !status);
    if (res.ok) {
      showSuccessToast(res.msg);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isBlock: !status } : c))
      );
    } else {
      showInfoToast(res.msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button onClick={() => { setIsModalOpen(true); setEditingCategory(null); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
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
          roleFilter="Category"
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {categories.map((category) => (
                <Card key={category._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span className="truncate max-w-[180px]">{category.title}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setIsModalOpen(true);
                              setEditingCategory(category.id);
                            }}
                            className="cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleBlock(category.id, category.isBlock)}
                            className="cursor-pointer"
                          >
                            {category.isBlock ? "Unblock" : "Block"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                      {category.description}
                    </p>
                    <Badge
                      variant={category.isBlock ? "destructive" : "default"}
                      className="mt-2"
                    >
                      {category.isBlock ? "Blocked" : "Active"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {isModalOpen && (
          <CategoryForm
            categoryId={editingCategory}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setCurrentPage(1); 
            }}
          />
        )}
      </div>
    </div>
  );
}