import { injectable } from "inversify";
import { IUserKmatState, UserKmatState } from "../../../models/user/kmat/userKmatState.model";
import { BaseRepository } from "../../baseRepository";
import { IUserKmatStateRepository } from "../../../core/interfaces/repositories/user/kmat/IUserKmatStateRepository";

@injectable()
export class UserKmatStateRepository extends BaseRepository<IUserKmatState, IUserKmatState> implements IUserKmatStateRepository {
  constructor() {
    super(UserKmatState);
  }

  async findByUserId(userId: string): Promise<IUserKmatState | null> {
    return this.findOne({ userId });
  }
}
