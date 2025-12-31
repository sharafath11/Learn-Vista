import { IKmatDailyData } from "../../../../../models/user/kmat/kmatDailyData.model";
import { IBaseRepository } from "../../IBaseRepository";

export interface IKmatDailyDataRepository extends IBaseRepository<IKmatDailyData, IKmatDailyData> {
  findByUserAndDate(userId: string, date: string): Promise<IKmatDailyData | null>;
  findFailedGenerations(): Promise<IKmatDailyData[]>;
}
