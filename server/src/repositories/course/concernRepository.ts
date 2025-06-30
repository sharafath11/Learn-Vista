import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import ConcernModel from "../../models/class/concernModel";
import { IConcern } from "../../types/concernTypes";
import { BaseRepository } from "../BaseRepository";

export class ConcernRepository extends BaseRepository<IConcern, IConcern> implements IConcernRepository{
    constructor() {
        super(ConcernModel)
    }
    async findMany(
    filters: Record<string, any>,
    sort: Record<string, 1 | -1> = { createdAt: -1 },
    skip = 0,
    limit = 10
  ): Promise<{ data: IConcern[]; total: number }> {
    const [data, total] = await Promise.all([
      ConcernModel.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ConcernModel.countDocuments(filters)
    ]);
    return { data, total };
  }
}