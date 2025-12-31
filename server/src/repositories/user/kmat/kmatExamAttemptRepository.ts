import { injectable } from "inversify";
import { IKmatExamAttempt, KmatExamAttempt } from "../../../models/user/kmat/kmatExamAttempt.model";
import { BaseRepository } from "../../baseRepository";
import { IKmatExamAttemptRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatExamAttemptRepository";

@injectable()
export class KmatExamAttemptRepository extends BaseRepository<IKmatExamAttempt, IKmatExamAttempt> implements IKmatExamAttemptRepository {
  constructor() {
    super(KmatExamAttempt);
  }

  async findByUserId(userId: string): Promise<IKmatExamAttempt[]> {
    return this.findAll({ userId });
  }
}
