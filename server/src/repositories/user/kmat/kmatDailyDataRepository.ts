import { injectable } from "inversify";
import { IKmatDailyData, KmatDailyData } from "../../../models/user/kmat/kmatDailyData.model";
import { BaseRepository } from "../../baseRepository";
import { IKmatDailyDataRepository } from "../../../core/interfaces/repositories/user/kmat/IKmatDailyDataRepository";

@injectable()
export class KmatDailyDataRepository extends BaseRepository<IKmatDailyData, IKmatDailyData> implements IKmatDailyDataRepository {
  constructor() {
    super(KmatDailyData);
  }

  async findByUserAndDate(userId: string, date: string): Promise<IKmatDailyData | null> {
    return this.findOne({ userId, date });
  }

  async findFailedGenerations(): Promise<IKmatDailyData[]> {
    return this.findAll({ status: 'failed' });
  }
}
