import { ISafeUser, IUser } from "../../../../types/userTypes";

export interface IUserService{
    getUser(token: string): Promise<IUser>;
    forgetPassword(email: string): Promise<void>;
    resetPassword(id:string,password:string):Promise<void>
}