import { Server } from "socket.io";
import { IDonation } from "../../../../types/donationTypes";

export interface IUserDonationServices{
    verifyDonation(sessionId:string,io?:Server,userId?:string):Promise<IDonation>
}