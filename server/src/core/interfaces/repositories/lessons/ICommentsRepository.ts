import { FilterQuery, ObjectId, SortOrder } from "mongoose";
import { IComment } from "../../../../types/lessons";
import { IBaseRepository } from "../IBaseRepository";

export interface ICommentstRepository extends IBaseRepository<IComment, IComment>{
 findWithPagination(
    filter: Record<string, any>,
    sort: Record<string, 1 | -1>,
    page: number,
     limit: number,
     mentorId:string|ObjectId
  ): Promise<IComment[]>;
  countDocuments(filter: Record<string, any>): Promise<number>;
}