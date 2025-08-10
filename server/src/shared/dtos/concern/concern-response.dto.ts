export class ConcernResponseDto {
  id!: string;
  title!: string;
  message!: string;
  courseId?: string;
  status!: string;
  resolution?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
export class AdminConcernCourseResponseDto{
    id!: string;
    title!:string
}
