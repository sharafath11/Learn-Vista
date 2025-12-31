import { IUserKmatState } from "../../../../../models/user/kmat/userKmatState.model";
import { IBaseRepository } from "../../IBaseRepository";

export interface IUserKmatStateRepository extends IBaseRepository<IUserKmatState, IUserKmatState> {
  findByUserId(userId: string): Promise<IUserKmatState | null>;
}
