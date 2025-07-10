import { injectable } from "inversify";
import { BaseRepository } from "../BaseRepository";
import { IDonation } from "../../types/donationTypes";
import { IDonationRepoitory } from "../../core/interfaces/repositories/donation/IDonationRepoitory";
import { DonationModel } from "../../models/mentor/class/donation.model";
import { FilterQuery } from "mongoose";

@injectable()
export class DonationRepoitory
  extends BaseRepository<IDonation, IDonation>
  implements IDonationRepoitory
{
  constructor() {
    super(DonationModel);
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<IDonation | null> {
    return await DonationModel.findOne({ paymentIntentId }).lean<IDonation>().exec();
  }
  async findManyWithFilter(
    filters: FilterQuery<IDonation>,
    sort: Record<string, 1 | -1>,
    skip: number,
    limit: number
  ): Promise<IDonation[]> {
    return DonationModel.find(filters).sort(sort).skip(skip).limit(limit).lean();
  }

  async countFiltered(filters: FilterQuery<IDonation>): Promise<number> {
    return DonationModel.countDocuments(filters);
  }
}
