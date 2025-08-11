import { AdminDonationResponseDto } from "../../../../shared/dtos/donation/donation-response.dto";
import { IDonation } from "../../../../types/donationTypes";

export interface IAdminDonationServices {
    getFilteredDonations(
  filters: Record<string, any>,
  sort: Record<string, 1 | -1>,
  skip: number,
  limit: number
): Promise<AdminDonationResponseDto[]>;

    countFilteredDonations(filters: Record<string, any>): Promise<number>;
    getDonation():Promise<AdminDonationResponseDto[]>

}