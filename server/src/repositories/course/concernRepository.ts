import { FilterQuery } from "mongoose";
import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import ConcernModel from "../../models/class/concernModel";
import { IConcern } from "../../types/concernTypes";
import { BaseRepository } from "../BaseRepository";
import { toDTOArray } from "../../utils/toDTO";

export class ConcernRepository extends BaseRepository<IConcern, IConcern> implements IConcernRepository{
    constructor() {
        super(ConcernModel)
    }
    async findMany(
    filters: Record<string, unknown>,
    sort: Record<string, 1 | -1> = { createdAt: -1 },
    skip = 0,
    limit = 2
  ): Promise<{ data: IConcern[]; total: number }> {
    const [data, total] = await Promise.all([
      ConcernModel.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ConcernModel.countDocuments(filters)
    ]);
     const dtoData = toDTOArray<IConcern>(data);
    return { data:dtoData, total };
    }
  async findWithPagination(
  filter: FilterQuery<IConcern>,
  limit: number,
  skip: number,
  sort: Record<string, 1 | -1>
): Promise<IConcern[]> {
  const results= await this.model
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
   return toDTOArray<IConcern>(results);
}

async count(filter: FilterQuery<IConcern>): Promise<number> {
  return this.model.countDocuments(filter);
}
  
}