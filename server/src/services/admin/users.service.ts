import { ObjectId } from "mongoose";
import AdminUsersRepo from "../../repositories/admin/AdminUsersRepo";

class AdminUsersServices {
  async getAllUsers() {
    try {
      const users = await AdminUsersRepo.findAll();
      return { ok: true, msg: "Successfully fetched all users", users };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async blockUserServices(id: ObjectId, status: boolean) {
    try {
      const updatedUser = await AdminUsersRepo.update(id.toString(), { isBlocked: status });
  
      if (!updatedUser) {
        return { ok: false, msg: "User not found" };
      }
  
      return { ok: true, msg: `User ${status ? "Blocked" : "Unblocked"} successfully` };
    } catch (error: any) {
      console.error("Error blocking/unblocking user:", error.message);
      return { ok: false, msg: "Failed to update user status" };
    }
  }
  
  
}

export default new AdminUsersServices();
