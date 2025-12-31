import { injectable } from "inversify";
import { IKmatDailyReport, KmatDailyReport } from "../../../models/user/kmat/kmatDailyReport.model";
import { BaseRepository } from "../../baseRepository";
import { IKmatDailyReportRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatDailyReportRepository";

@injectable()
export class KmatDailyReportRepository extends BaseRepository<IKmatDailyReport, IKmatDailyReport> implements IKmatDailyReportRepository {
  constructor() {
    super(KmatDailyReport);
  }

  async findByUserAndDate(userId: string, date: string): Promise<IKmatDailyReport | null> {
    return this.findOne({ userId, date });
  }
}
