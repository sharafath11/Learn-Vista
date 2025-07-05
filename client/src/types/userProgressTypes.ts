export interface IUserCourseProgress{
  userId: string;
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  overallProgressPercent: number;

}
