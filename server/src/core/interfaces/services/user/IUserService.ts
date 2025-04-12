import { ISafeUser } from "../../../../types/userTypes";

export interface IUserService{
    getUser(token: string): Promise<ISafeUser>;
}