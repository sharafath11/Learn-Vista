import { IMentor } from "../../../../types/mentorTypes";

export interface IAdminMentorServices  {
    getAllMentors(): Promise<IMentor[]>;
    changeMentorStatus(id: string, status: boolean, email: string): Promise<IMentor|null>;
    toggleMentorBlock(id: string, isBlock: boolean): Promise<IMentor | null>;
    mentorDetils(id:string):Promise<IMentor>
}
