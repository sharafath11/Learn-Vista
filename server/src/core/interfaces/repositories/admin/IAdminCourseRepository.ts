import { IBaseRepository } from "../IBaseRepository";
import { ICourse } from "../../../../types/classTypes";
import { FilterQuery } from "mongoose";

export interface IAdminCourserRepository extends IBaseRepository<ICourse, ICourse> {
  getClassRepo(
    page: number,
    limit: number,
    search?: string,
    filters?: FilterQuery<ICourse>,
    sort?: Record<string, 1 | -1>
  ): Promise<{ data: ICourse[]; total: number; totalPages?: number }>;
}
