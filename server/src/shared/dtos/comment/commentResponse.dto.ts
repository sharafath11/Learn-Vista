export interface ICommentResponseDto {
  id: string;
  lessonId: string;
  userId?: string;
  userName: string;
  comment: string;
  mentorId: string;
  courseId: string;
  createdAt: string; 
}

export interface IAdminCommentResponseDto {
    id:string
    userName: string;
    comment: string
    lessonId:string
}
export interface IMentorCommentResponseDto {
  userName: string;           
  createdAt: Date;          
  courseTitle: string;        
  lessonTitle: string;        
  comment: string;         
}
export interface IMentorCommentResponseAtLesson{
  userName: string
  createdAt: Date
  comment: string;     
}