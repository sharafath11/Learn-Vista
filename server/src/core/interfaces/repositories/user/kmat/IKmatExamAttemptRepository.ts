import { IKmatExamAttempt } from "../../../../../models/user/kmat/kmatExamAttempt.model";
import { IBaseRepository } from "../../IBaseRepository";

export interface IKmatExamAttemptRepository extends IBaseRepository<IKmatExamAttempt, IKmatExamAttempt> {
  findByUserId(userId: string): Promise<IKmatExamAttempt[]>;
}
