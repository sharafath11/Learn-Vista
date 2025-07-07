import { injectable } from "inversify";
import { BaseRepository } from "../BaseRepository";
import { IDonation } from "../../types/donationTypes";
import { IDonationRepoitory } from "../../core/interfaces/repositories/donation/IDonationRepoitory";
import { DonationModel } from "../../models/mentor/class/donation.model";

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
}
