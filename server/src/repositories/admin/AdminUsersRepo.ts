import { BaseRepository } from "../BaseRepository";
import { IUser } from "../../types/userTypes";
import { userModel } from "../../models/user/userModel";


class AdminUsersRepo extends BaseRepository<IUser> {
 constructor() {
    super(userModel)
  }  
}

export default new AdminUsersRepo();
