export interface ConcernAttachment {
  id: string;
  filename: string; 
  url?: string;    
  type: 'image' | 'audio';
  size: number;    
}


export interface ConcernFormData {
  message: string;
  attachments: ConcernAttachment[];
  courseId: string;
  mentorId: string;
}

export interface ConcernDialogProps {
  courseId: string;
  onSuccess?: () => void;
}
export interface IConcern {
  _id:string
  id: string;
  title:string
  message: string;
  attachments?: ConcernAttachment[];
  courseId: string;
  mentorId: string;
  resolution:string,
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}