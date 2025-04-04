import { ObjectId } from "mongoose";
import AdminUsersRepo from "../../repositories/admin/AdminUsersRepo";

class AdminUsersServices {
  async getAllUsers() {
    try {
      const users = await AdminUsersRepo.getAllUsers();
      return { ok: true, msg: "Successfully fetched all users", users };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async blockUserServices(id: ObjectId, status: boolean) {
    return await AdminUsersRepo.blockUsersRepo(id, status);
  }
  
}

export default new AdminUsersServices();
