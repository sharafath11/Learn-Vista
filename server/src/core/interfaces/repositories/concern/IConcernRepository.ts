import { FilterQuery } from "mongoose";
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
  findWithPagination(
  filter: FilterQuery<IConcern>,
  limit: number,
  skip: number,
  sort: Record<string, 1 | -1>
): Promise<IConcern[]>;

count(filter: FilterQuery<IConcern>): Promise<number>;

}