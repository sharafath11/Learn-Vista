"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus } from "lucide-react";
import { useAdminContext } from "@/src/context/adminContext";
import { showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import CategoryForm from "./categoriesModal";
import { SearchAndFilterBar } from "@/src/components/admin/SearchAndFilterBar";
import { Button } from "@/src/components/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/shared/components/ui/card";
import { Skeleton } from "@/src/components/shared/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/shared/components/ui/dropdown-menu";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { AdminAPIMethods } from "@/src/services/methods/admin.api";
import { ICategoryFilters } from "@/src/types/adminTypes";



export default function CategoriesList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const { cat: categories, setCat: setCategories } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Blocked" | "Approved" | "Pending" | "Rejected"
  >("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const categoriesPerPage = 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const filters: ICategoryFilters = {};
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
          setCategories(res.data.data);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [debouncedSearchTerm, statusFilter, sortOrder, currentPage]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Categories Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your content categories
            </p>
          </div>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setEditingCategory(null);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
          >
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(categoriesPerPage)].map((_, i) => (
              <Card
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {categories?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
                <div className="text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No categories found
                </h3>
                <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                  {debouncedSearchTerm
                    ? "No categories match your search criteria. Try a different search term."
                    : "You haven't created any categories yet. Start by adding a new category."}
                </p>
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                    setEditingCategory(null);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {categories?.map((category) => (
                    <Card
                      key={category.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:border-indigo-100"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold text-gray-800 truncate max-w-[180px]">
                            {category.title}
                          </CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-40 border border-gray-200 shadow-lg"
                            >
                              <DropdownMenuItem
                                onClick={() => {
                                  setIsModalOpen(true);
                                  setEditingCategory(category.id);
                                }}
                                className="cursor-pointer text-gray-700 hover:bg-gray-100"
                              >
                                <Pencil className="w-4 h-4 mr-2 text-blue-500" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleToggleBlock(
                                    category.id,
                                    category.isBlock
                                  )
                                }
                                className="cursor-pointer text-gray-700 hover:bg-gray-100"
                              >
                                {category.isBlock ? (
                                  <span className="text-green-600">
                                    Unblock
                                  </span>
                                ) : (
                                  <span className="text-amber-600">Block</span>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                          {category.description || "No description provided"}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge
                            variant={
                              category.isBlock ? "destructive" : "default"
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              category.isBlock
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {category.isBlock ? "Blocked" : "Active"}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {category?.createdAt
                              ? new Date(category.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {totalPages > 0 && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex items-center space-x-1">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &larr; Prev
                      </button>

                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
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
                              className={`px-4 py-1 rounded-md text-sm font-medium ${
                                currentPage === pageNum
                                  ? "bg-indigo-600 text-white shadow-md"
                                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next &rarr;
                      </button>
                    </nav>
                  </div>
                )}
              </>
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
