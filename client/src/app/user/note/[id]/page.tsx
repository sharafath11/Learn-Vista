"use client";

import { useState, useEffect,useCallback } from "react";
import { useParams } from "next/navigation";
import { Clock, ChevronDown, ChevronUp, X, Check, Edit, Trash2, Bot, User } from "lucide-react";
import { showSuccessToast } from "@/src/utils/Toast";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import { IVoiceNote, SortOption } from "@/src/types/lessons";
import { Button } from "@/src/components/shared/components/ui/button";
import { Card } from "@/src/components/shared/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/shared/components/ui/tooltip";
import { CustomAlertDialog } from "@/src/components/custom-alert-dialog";
import { SearchSortComponent } from "./SearchSortComponent";
import { PaginationComponent } from "./PaginationComponent";
import useDebounce from "@/src/hooks/useDebouncing";

export default function VoiceNotesDashboard() {
  const params = useParams();
  const lessonId = params?.id as string;

  const [notes, setNotes] = useState<IVoiceNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const notesPerPage = 5;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchNotes = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    const res = await UserAPIMethods.getVoiceNotes(lessonId, {
      search: debouncedSearchQuery,
      sort: sortBy === "newest" ? "desc" : "asc",
      limit: notesPerPage,
      page: currentPage,
    });
    if (res.ok) {
      setNotes(res.data.notes ?? []);
      setTotalPages(Math.ceil((res.data.totalNotes ?? 0) / notesPerPage));
    } else {
      setNotes([]);
      setTotalPages(0);
    }
    setLoading(false);
  }, [lessonId, debouncedSearchQuery, sortBy, currentPage]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const toggleExpanded = (noteId: string) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const confirmDelete = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!lessonId || !noteToDelete) return;
    const res = await UserAPIMethods.deleteVoiceNote(lessonId, noteToDelete);
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete));
      showSuccessToast("Note deleted successfully.");
    }
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const startEdit = (noteId: string, currentText: string) => {
    setEditNoteId(noteId);
    setEditNoteText(currentText);
  };

  const cancelEdit = () => {
    setEditNoteId(null);
    setEditNoteText("");
  };

  const saveEdit = async (noteId: string) => {
    if (!lessonId || !editNoteText.trim()) return;
    const res = await UserAPIMethods.editVoiceNote(lessonId, noteId, editNoteText);
    if (res.ok) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, note: editNoteText, PrefectNote: res.data.PrefectNote } : n
        )
      );
      showSuccessToast("Note updated successfully.");
      cancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            My Voice Notes
          </h1>
          <p className="text-lg text-gray-600">
            Review and edit your notes with AI-enhanced insights for this lesson.
          </p>
        </div>
        <SearchSortComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <div className="space-y-6">
          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading notes...</p>
          ) : notes.length === 0 ? (
            <Card className="p-10 text-center bg-white shadow-md">
              <p className="text-gray-500 text-lg font-medium">
                No notes found for this lesson.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Start by adding your first voice note.
              </p>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{note.course}</h3>
                    <p className="text-sm text-gray-500 mt-1">{note.lesson}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1.5" />
                      <span>{formatDate(note.notedDate as string)}</span>
                    </div>
                    <TooltipProvider>
                      {editNoteId === note.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => saveEdit(note.id)}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={cancelEdit}
                            className="text-gray-600 hover:bg-gray-100"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => startEdit(note.id, note.note)}
                                className="text-gray-500 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Note</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => confirmDelete(note.id)}
                                className="text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Note</TooltipContent>
                          </Tooltip>
                        </>
                      )}
                    </TooltipProvider>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-cyan-800 text-base">Your Note</span>
                    </div>
                    {editNoteId === note.id ? (
                      <textarea
                        value={editNoteText}
                        onChange={(e) => setEditNoteText(e.target.value)}
                        className="w-full p-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={4}
                      />
                    ) : (
                      <p
                        className={`text-gray-800 leading-relaxed ${
                          expandedNote === note.id ? "" : "line-clamp-3"
                        }`}
                      >
                        {note.note}
                      </p>
                    )}
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-800 text-base">AI Enhanced Note</span>
                    </div>
                    <p
                      className={`text-gray-800 leading-relaxed ${
                        expandedNote === note.id ? "" : "line-clamp-3"
                      }`}
                    >
                      {note.PrefectNote}
                    </p>
                  </div>
                </div>
                {editNoteId !== note.id && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(note.id)}
                      className="text-sm text-gray-500 hover:bg-gray-100"
                    >
                      {expandedNote === note.id ? (
                        <>
                          Collapse <ChevronUp className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Expand <ChevronDown className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
        {!loading && notes.length > 0 && (
          <div className="mt-10 text-center">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
      <CustomAlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Confirm Delete"
        description="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
        variant="error"
      />
    </div>
  );
}
