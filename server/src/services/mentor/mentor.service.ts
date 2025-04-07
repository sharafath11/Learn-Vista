import MentorRepo from "../../repositories/mentor/MentorRepo";

class MentorService{
    async getUser(id:string) {
        const mentor = await MentorRepo.findById(id);
        if (!mentor) throw new Error("Please login");
        if(mentor.isBlock) throw new Error("Somthing fishy please contect LV admin")
        const Rementor= {
            _id: mentor._id,
            username: mentor.username,
            email: mentor.email,
            expertise: mentor.expertise,
            experience: mentor.experience,
            bio: mentor.bio,
            phoneNumber: mentor?.phoneNumber || "",
            socialLinks: mentor.socialLinks,
            liveClasses: mentor.liveClasses,
            coursesCreated: mentor.coursesCreated,
            reviews:mentor.reviews
            
        }
        return Rementor
    }
}
export default new MentorService()