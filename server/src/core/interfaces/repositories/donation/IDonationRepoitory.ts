import { FilterQuery } from "mongoose";
import { IDonation } from "../../../../types/donationTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface IDonationRepoitory extends IBaseRepository<IDonation, IDonation> {
  findByPaymentIntentId(paymentIntentId: string): Promise<IDonation | null>;
  findManyWithFilter(
    filters: FilterQuery<IDonation>,
    sort: Record<string, 1 | -1>,
    skip: number,
    limit: number
  ): Promise<IDonation[]>;

  countFiltered(filters: FilterQuery<IDonation>): Promise<number>;
}
