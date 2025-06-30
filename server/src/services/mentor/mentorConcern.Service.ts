import { inject, injectable } from "inversify";
import { IMentorConcernService } from "../../core/interfaces/services/mentor/IMentorConcern.Service";
import { TYPES } from "../../core/types";
import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import { IConcern } from "../../types/concernTypes";
import { validateConcernPayload } from "../../validation/validateConcernPayload";

@injectable()
export class MentorConcernService implements IMentorConcernService {
  constructor(
    @inject(TYPES.ConcernRepository)
    private _concernRepo: IConcernRepository
  ) {}

  async addConcern(data: IConcern): Promise<IConcern> {
    validateConcernPayload(data);
    console.log(data)
    const concern = await this._concernRepo.create(data);
    return concern;
  }
  async getConcerns(
    filters: Record<string, any>,
    sort: Record<string, 1 | -1>,
    skip: number,
    limit: number
  ): Promise<{ data: IConcern[]; total: number }> {
    return this._concernRepo.findMany(filters, sort, skip, limit);
  }

}
