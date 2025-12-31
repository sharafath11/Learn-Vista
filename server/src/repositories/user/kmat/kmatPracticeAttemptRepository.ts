import { injectable } from "inversify";
import { IKmatPracticeAttempt, KmatPracticeAttempt } from "../../../models/user/kmat/kmatPracticeAttempt.model";
import { BaseRepository } from "../../baseRepository";
import { IKmatPracticeAttemptRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatPracticeAttemptRepository";

@injectable()
export class KmatPracticeAttemptRepository extends BaseRepository<IKmatPracticeAttempt, IKmatPracticeAttempt> implements IKmatPracticeAttemptRepository {
  constructor() {
    super(KmatPracticeAttempt);
  }

  async findByUserId(userId: string): Promise<IKmatPracticeAttempt[]> {
    return this.findAll({ userId });
  }
}
