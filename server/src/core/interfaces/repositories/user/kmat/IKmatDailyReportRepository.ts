import { IKmatDailyReport } from "../../../../../models/user/kmat/kmatDailyReport.model";
import { IBaseRepository } from "../../IBaseRepository";

export interface IKmatDailyReportRepository extends IBaseRepository<IKmatDailyReport, IKmatDailyReport> {
  findByUserAndDate(userId: string, date: string): Promise<IKmatDailyReport | null>;
}
