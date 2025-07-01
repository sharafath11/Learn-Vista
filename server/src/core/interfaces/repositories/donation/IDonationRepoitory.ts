import { IDonation } from "../../../../types/donationTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface IDonationRepoitory extends IBaseRepository<IDonation, IDonation> {
  findByPaymentIntentId(paymentIntentId: string): Promise<IDonation | null>;
}
