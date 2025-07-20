import { injectable } from "inversify";
import { BaseRepository } from "../BaseRepository";
import { IDonation } from "../../types/donationTypes";
import { IDonationRepoitory } from "../../core/interfaces/repositories/donation/IDonationRepoitory";
import { DonationModel } from "../../models/mentor/class/donation.model";
import { FilterQuery } from "mongoose";
import { toDTO } from "../../utils/toDTO";

@injectable()
export class DonationRepoitory
  extends BaseRepository<IDonation, IDonation>
  implements IDonationRepoitory
{
  constructor() {
    super(DonationModel);
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<IDonation | null> {
    const doc = await DonationModel.findOne({ paymentIntentId }).exec();
    return doc ? toDTO<IDonation>(doc) : null;
  }

  async findManyWithFilter(
    filters: FilterQuery<IDonation>,
    sort: Record<string, 1 | -1>,
    skip: number,
    limit: number
  ): Promise<IDonation[]> {
    const docs = await DonationModel.find(filters).sort(sort).skip(skip).limit(limit);
    return docs.map(doc => toDTO<IDonation>(doc));
  }

  async countFiltered(filters: FilterQuery<IDonation>): Promise<number> {
    return DonationModel.countDocuments(filters);
  }
}
