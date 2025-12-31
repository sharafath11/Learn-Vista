import { IKmatQuestionBank } from "../../../../../models/user/kmat/kmatQuestionBank.model";
import { IBaseRepository } from "../../IBaseRepository";

export interface IKmatQuestionBankRepository extends IBaseRepository<IKmatQuestionBank, IKmatQuestionBank> {
  getRandomQuestions(section: string, count: number): Promise<IKmatQuestionBank[]>;
}
