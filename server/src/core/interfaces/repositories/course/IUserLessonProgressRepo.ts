import { Document } from "mongoose"
import { IUserLessonProgress } from "../../../../types/userLessonProgress";
import { IBaseRepository } from "../IBaseRepository";


export interface IUserLessonProgressRepository extends IBaseRepository<IUserLessonProgress, IUserLessonProgress> {
      
}
