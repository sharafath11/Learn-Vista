// types/services/IConcernService.ts

import { ObjectId } from "mongoose";
import { IAdminConcernCourseResponseDto, IConcernResponseDto } from "../../../../shared/dtos/concern/concern-response.dto";

type ConcernFilter = {
  status?: 'open' | 'in-progress' | 'resolved';
  courseId?: string;
};

type SortOrder = 1 | -1;

export interface IAdminConcernService {
  getConcern():Promise<IConcernResponseDto[]>;
  updateConcern(concernId: string, updateData: Partial<IConcernResponseDto>): Promise<void>;
  updateConcernStatus(
    concernId: string | ObjectId,
    status: 'resolved' | 'in-progress',
    resolution: string
  ): Promise<void>;
  getAllConcerns(
    filters: ConcernFilter,
    limit: number,
    skip: number,
    sort: Record<string, SortOrder>
  ): Promise<{ concerns: IConcernResponseDto[]; courses: IAdminConcernCourseResponseDto[] }>;
  countAllConcerns(filters: ConcernFilter): Promise<number>;
}
