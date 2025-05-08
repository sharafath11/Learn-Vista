import { IMentor } from "../../../../types/mentorTypes";

export interface IAdminMentorServices {
getAllMentors(
    page?: number,
    limit?: number,
    search?: string,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: IMentor[]; total: number; totalPages?: number }>;
  changeMentorStatus(id: string, status: boolean, email: string): Promise<IMentor | null>;
  toggleMentorBlock(id: string, isBlock: boolean): Promise<IMentor | null>;
  mentorDetails(id: string): Promise<IMentor>;
}
