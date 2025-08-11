import { IDonation } from "../../../types/donationTypes";
import { IDonationResponseDto, IAdminDonationResponseDto } from "./donation-response.dto";

export class DonationMapper {
  static toResponseDto(donation: IDonation): IDonationResponseDto {
    return {
      id: donation._id.toString(),
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      amount: donation.amount,
      currency: donation.currency,
      message: donation.message,
      status: donation.status,
      paymentIntentId: donation.paymentIntentId,
      stripeCustomerId: donation.stripeCustomerId,
      transactionId: donation.transactionId,
      receiptUrl: donation.receiptUrl,
      donorId: donation.donorId ? donation.donorId.toString() : undefined,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt
    };
  }
    static toAdminDonationResponseDto(donation: IDonation): IAdminDonationResponseDto{
       return {
           id: donation._id.toString(),
           amount: donation.amount,
           date: donation.createdAt,
           donorName: donation.donorName,
           status:donation.status
           
        }
    }
}
