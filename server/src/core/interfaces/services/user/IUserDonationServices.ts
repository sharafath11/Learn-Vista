import { Server } from "socket.io";
import { IUSerDonationResponseDto } from "../../../../shared/dtos/donation/donation-response.dto";

export interface IUserDonationServices{
    verifyDonation(sessionId: string, io?: Server, userId?: string): Promise<IUSerDonationResponseDto>
    getPaginatedDonations(
    userId: string,
    page: number
  ): Promise<{
    data: IUSerDonationResponseDto[];
    total: number;
    hasMore: boolean;
  }>;
    
}