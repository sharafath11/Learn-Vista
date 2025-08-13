
export interface ICategoryResponseDto {
  id: string;
  title: string;
  description?: string;
  createdAt?: Date; 
  isBlock:boolean
}
export interface ICategoryCoursePopulated {
  id: string;
  title: string;
}
export interface ICategoryUserCourseResponse{
  id: String,
  title:string
}
