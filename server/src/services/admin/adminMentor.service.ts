import { ObjectId } from "mongoose";
import AdminMentorRepo from "../../repositories/admin/AdminMentorRepo";
import { sendMentorStatusChangeEmail } from "../../utils/emailService";

class AdminMentorService {
  async getAllMentors() {
    return await AdminMentorRepo.findAll();
  }

  async changeStatusMentor(id: ObjectId, status: string, email: string) {
    const updated = await AdminMentorRepo.update(id.toString(), { status }); 

    if (!updated) {
      throw new Error("Mentor not found or status update failed");
    }

    if (status === "approved") {
      await sendMentorStatusChangeEmail(email, status);
    }

    return updated;
  }

  async blockMentorServices(id: ObjectId, status: boolean) {
    console.log(status)
    const updatedUser = await AdminMentorRepo.update(id.toString(), { isBlock: status });

    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser
  }
}

export default new AdminMentorService();
