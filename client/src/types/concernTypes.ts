// src/types/concernTypes.ts

import { ICourse } from "./courseTypes";

export interface ConcernAttachment {
  id: string;
  filename: string;
  url?: string;
  type: 'image' | 'audio';
  size: number;
}

export interface sendAttachement {
  id: string;
  file: File;
  previewUrl?: string; 
  name: string;
  size: number;
  type: 'image' | 'audio';
}


export interface ConcernFormData {
  message: string;
  attachments: ConcernAttachment[]; // These are the attachments AFTER upload to S3
  courseId: string;
  mentorId: string;
}

export interface ConcernDialogProps {
  courseId: string;
  onSuccess?: () => void;
}

export interface IConcern {
  
  id: string;
  title:string
  message: string;
  attachments?: ConcernAttachment[]; 
  courseId: string;
  mentorId: string;
  resolution: string,
  courseTitle?:string
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}
export type IConcernFilters = {
  status?: "open" | "in-progress" | "resolved";
  courseId?: string;
};

export type IConcernSort = {
  createdAt?: 1 | -1;
};

export interface IAdminConcernModalProps {
  concern: IConcern | null
  onClose: () => void
  onStatusChange: () => void
}


export type IMentorConcernStatus = 'open' | 'in-progress' | 'resolved'

export interface IMentorSortOption {
  value: string
  label: string
  defaultOrder?: 'asc' | 'desc'
}

export interface IMentorConcernFilterOption<T = string> {
  value: T
  label: string
  count?: number
  icon?: React.ReactNode
}



export interface IMentorConcernsToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: IMentorConcernStatus | "all";
  setStatusFilter: (status: IMentorConcernStatus | "all") => void;
  courseFilter: string;
  setCourseFilter: (courseId: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  courses: ICourse[]; 
  statusCounts: {
    all: number;
    open: number;
    resolved: number;
    'in-progress': number;
  };
}
