import { ICourse } from "../../../../types/classTypes";
import { IMentor } from "../../../../types/mentorTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface IMentorCourseRepo extends IBaseRepository <ICourse, ICourse>{
  
}