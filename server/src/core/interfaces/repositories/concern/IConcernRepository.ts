import { IConcern } from "../../../../types/concernTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface IConcernRepository extends IBaseRepository<IConcern, IConcern> {
    findMany(
    filters: Record<string, any>,
    sort?: Record<string, 1 | -1>,
    skip?: number,
    limit?: number
  ): Promise<{
    data: IConcern[];
    total: number;
  }>;
}