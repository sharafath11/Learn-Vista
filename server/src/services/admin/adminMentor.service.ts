import { ObjectId } from "mongoose";
import AdminMentorRepo from "../../repositories/admin/AdminMentorRepo";
import { sendMentorStatusChangeEmail } from "../../utils/emailService";

class AdminMentorService {
  async getAllMentors() {
    return await AdminMentorRepo.findAll();
  };
  async changeStatusMentor(id: ObjectId, status: string, email: string) {
    console.log(id,status,email)
    try {
      await AdminMentorRepo.update(id.toString(), { status }); 
      if (status === "Approved") {
        sendMentorStatusChangeEmail(email,status)
      }
    } catch (error:any) {
      console.error(error.message)
    }
  }
}

export default new AdminMentorService();
