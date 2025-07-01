import { IDonation } from "../../../../types/donationTypes";

export interface IAdminDonationServices {
    getConcerns():Promise<IDonation[]>
}