import { ObjectId } from "mongoose";
import userRepository from "../user/userRepository";


class AdminUsersRepo {
  async getAllUsers() {
    try {
      const allUsers = await userRepository.findAll();
      return allUsers;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async blockUsersRepo(id: ObjectId, status: boolean) {
    try {
      const stringId = id.toString();
      const userUpdated = await userRepository.update(
        stringId,
        { isBlocked: status }
      );
  
      if (!userUpdated) {
        throw new Error("User not found");
      }
  
      return { ok: true, msg: `User ${status ? "Blocked" : "Unblocked"} successfully` };
    } catch (error) {
      console.error("Error updating block status:", error);
      return { ok: false, msg: "Failed to update user status" };
    }
  }
  
  
}

export default new AdminUsersRepo();
