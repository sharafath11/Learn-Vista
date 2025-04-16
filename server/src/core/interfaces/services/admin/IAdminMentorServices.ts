import { IMentor } from "../../../../types/mentorTypes";

export interface IAdminMentorServices {
    getAllMentors(page: number, limit: number, search: string): void;
    changeMentorStatus(id: string, status: boolean, email: string): IMentor;
    toggleMentorBlock(id: string, isBlock: boolean):
}