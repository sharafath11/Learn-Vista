// types/services/IConcernService.ts

import { ObjectId } from "mongoose";
import { IConcern } from "../../../../types/concernTypes";
import { ICourse } from "../../../../types/classTypes";

type ConcernFilter = {
  status?: 'open' | 'in-progress' | 'resolved';
  courseId?: string;
};

type SortOrder = 1 | -1;

export interface IAdminConcernService {
  getConcern():Promise<IConcern[]>;
  updateConcern(concernId: string, updateData: Partial<IConcern>): Promise<void>;
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
  ): Promise<{ concerns: IConcern[]; courses: ICourse[] }>;
  countAllConcerns(filters: ConcernFilter): Promise<number>;
}
