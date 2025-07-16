import { IUserCourseProgress } from "@/src/types/userProgressTypes";

export const getCourseProgress = (
  courseId: string,
  progresses: IUserCourseProgress[]
): number => {
  const progress = progresses.find((p) => p.courseId === courseId);
  const overallProgress = progress?.overallProgressPercent ?? 0;
  return Math.round(overallProgress);
};