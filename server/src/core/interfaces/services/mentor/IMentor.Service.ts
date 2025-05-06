import { ICourse, IPopulatedCourse } from "../../../../types/classTypes";
import { IMentor } from "../../../../types/mentorTypes";


export interface IMentorService {
  getMentor(id: string): Promise<Partial<IMentor>>;
  getCourses(id: string): Promise<IPopulatedCourse[]>;
  courseApproveOrReject(id:string,courseId:string,status:string,courseRejectReson:string):Promise<void>
}