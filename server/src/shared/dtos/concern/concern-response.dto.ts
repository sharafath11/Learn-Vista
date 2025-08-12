export interface IConcernResponseDto {
  id: string;
  title: string;
  message: string;
  courseId?: string;
  status: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  mentorId:string
}

export interface IAdminConcernCourseResponseDto {
  id: string;
  title: string;
}
