// types/services/IConcernService.ts

import { ObjectId } from "mongoose";
import { AdminConcernCourseResponseDto, ConcernResponseDto } from "../../../../shared/dtos/concern/concern-response.dto";

type ConcernFilter = {
  status?: 'open' | 'in-progress' | 'resolved';
  courseId?: string;
};

type SortOrder = 1 | -1;

export interface IAdminConcernService {
  getConcern():Promise<ConcernResponseDto[]>;
  updateConcern(concernId: string, updateData: Partial<ConcernResponseDto>): Promise<void>;
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
  ): Promise<{ concerns: ConcernResponseDto[]; courses: AdminConcernCourseResponseDto[] }>;
  countAllConcerns(filters: ConcernFilter): Promise<number>;
}
