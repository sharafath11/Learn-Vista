import { ISafeUser } from "../../../../types/userTypes";

export interface IUserService{
    getUser(token: string): Promise<ISafeUser>;
    forgetPassword(email: string): Promise<void>;
    resetPassword(id:string,password:string):Promise<void>
}