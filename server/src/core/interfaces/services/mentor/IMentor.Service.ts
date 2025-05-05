import { ICourse } from "../../../../types/classTypes";
import { IMentor } from "../../../../types/mentorTypes";


export interface IMentorService {
  getMentor(id: string): Promise<Partial<IMentor>>;
  getCourses(id: string): Promise<ICourse[]>;
  courseApproveOrReject(id:string,courseId:string,status:string):Promise<void>
}