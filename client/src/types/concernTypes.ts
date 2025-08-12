// src/types/concernTypes.ts

export interface ConcernAttachment {
  id: string;
  filename: string;
  url?: string;
  type: 'image' | 'audio';
  size: number;
}

// *** CRITICAL CHANGE HERE ***
// The 'file' property MUST be of type `File` for Multer/S3 uploads,
// not a `string` (which would be a Base64 string).
export interface sendAttachement {
  id: string;
  file: File; // <--- CHANGED FROM `string` TO `File`
  previewUrl?: string; // Added for frontend display, optional
  name: string; // The original filename
  size: number; // File size in MB (as stored in frontend state)
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