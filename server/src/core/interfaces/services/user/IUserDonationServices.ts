import { IDonation } from "../../../../types/donationTypes";

export interface IUserDonationServices{
    verifyDonation(sessionId:string):Promise<IDonation>
}