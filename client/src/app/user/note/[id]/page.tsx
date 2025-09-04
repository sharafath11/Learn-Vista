"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Search, Clock, User, Bot, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";

import { showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import { IVoiceNote, SortOption } from "@/src/types/lessons";
import { Input } from "@/src/components/shared/components/ui/input";
import { Button } from "@/src/components/shared/components/ui/button";
import { Card } from "@/src/components/shared/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/shared/components/ui/tooltip";
import { CustomAlertDialog } from "@/src/components/custom-alert-dialog";

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

  const fetchNotes = async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const res = await UserAPIMethods.getVoiceNotes(lessonId, {
        search: searchQuery,
        sort: sortBy === "newest" ? "desc" : "asc",
      });
      if (res.ok) setNotes(res.data);
      else showInfoToast(res.msg);
    } catch (err) {
      showInfoToast("Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchNotes();
    }, 500); // debounce search
    return () => clearTimeout(handler);
  }, [lessonId, searchQuery, sortBy]);

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

  // Open confirmation modal before deleting
  const confirmDelete = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!lessonId || !noteToDelete) return;

    try {
      const res = await UserAPIMethods.deleteVoiceNote(lessonId, noteToDelete);
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteToDelete));
        showSuccessToast("Note deleted successfully.");
      } else {
        showInfoToast(res.msg);
      }
    } catch (err) {
      showInfoToast("Failed to delete note.");
    } finally {
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleEdit = async (noteId: string) => {
    try {
      const res = await UserAPIMethods.editVoiceNote(lessonId, noteId);
      if (res.ok) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId ? { ...n, PrefectNote: res.data.AiResponse } : n
          )
        );
        showSuccessToast("AI response regenerated successfully.");
      } else {
        showInfoToast(res.msg);
      }
    } catch (err) {
      showInfoToast("Failed to regenerate AI response.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            My Voice Notes
          </h1>
          <p className="text-lg text-gray-600">
            Review your notes and AI-enhanced insights for this lesson.
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setSortBy("newest")}
              variant={sortBy === "newest" ? "default" : "outline"}
              className="rounded-full px-5 py-2 transition-colors duration-200"
            >
              <Clock className="h-4 w-4 mr-2" /> Newest
            </Button>
            <Button
              onClick={() => setSortBy("oldest")}
              variant={sortBy === "oldest" ? "default" : "outline"}
              className="rounded-full px-5 py-2 transition-colors duration-200"
            >
              <Clock className="h-4 w-4 mr-2" /> Oldest
            </Button>
          </div>
        </div>

        {/* Notes List */}
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
              <Card
                key={note.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Note Header */}
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(note.id);
                            }}
                            className="text-gray-500 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Note</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(note.id);
                            }}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Note</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Notes Content */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-cyan-800 text-base">Your Note</span>
                    </div>
                    <p
                      className={`text-gray-800 leading-relaxed ${
                        expandedNote === note.id ? "" : "line-clamp-3"
                      }`}
                    >
                      {note.note}
                    </p>
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

                {/* Expand/Collapse */}
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
              </Card>
            ))
          )}
        </div>

        {!loading && notes.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">Showing {notes.length} notes.</p>
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
