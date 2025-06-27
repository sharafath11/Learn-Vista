export interface ConcernAttachment {
  id: string;
  file: File;
  type: 'image' | 'audio';
  name: string;
  size: string; 
}

export interface ConcernFormData {
  message: string;
  attachments: ConcernAttachment[];
  courseId: string;
  mentorId: string;
}

export interface ConcernDialogProps {
  courseId: string;
  mentorId: string;
  onSuccess?: () => void;
}
export interface IConcern {
  id: string;
  message: string;
  attachments?: ConcernAttachment[];
  courseId: string;
  mentorId: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}