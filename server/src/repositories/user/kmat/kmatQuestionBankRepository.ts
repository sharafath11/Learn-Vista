import { injectable } from "inversify";
import { IKmatQuestionBank, KmatQuestionBank } from "../../../models/user/kmat/kmatQuestionBank.model";
import { BaseRepository } from "../../baseRepository";
import { IKmatQuestionBankRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatQuestionBankRepository";

@injectable()
export class KmatQuestionBankRepository extends BaseRepository<IKmatQuestionBank, IKmatQuestionBank> implements IKmatQuestionBankRepository {
  constructor() {
    super(KmatQuestionBank);
  }

  async getRandomQuestions(section: string, count: number): Promise<IKmatQuestionBank[]> {
    return this.model.aggregate([
      { $match: { section } },
      { $sample: { size: count } }
    ]).exec();
  }
}
