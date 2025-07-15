export interface IUserCourseProgress{
  userId: string;
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  overallProgressPercent: number;

}
export interface IUserLessonProgress {
  id:string
  userId: string;
  courseId: string;
  lessonId: string;
  videoProgressPercent: number;
  videoWatchedDuration: number; 
  videoTotalDuration: number; 
  theoryCompleted: boolean;
  practicalCompleted: boolean;
  mcqCompleted: boolean;
  overallProgressPercent: number;
  videoCompleted:boolean
}