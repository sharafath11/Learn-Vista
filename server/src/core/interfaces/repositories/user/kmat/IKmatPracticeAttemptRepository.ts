import { IKmatPracticeAttempt } from "../../../../../models/user/kmat/kmatPracticeAttempt.model";
import { IBaseRepository } from "../../IBaseRepository";

export interface IKmatPracticeAttemptRepository extends IBaseRepository<IKmatPracticeAttempt, IKmatPracticeAttempt> {
  findByUserId(userId: string): Promise<IKmatPracticeAttempt[]>;
}
