// src/types/concernTypes.ts

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