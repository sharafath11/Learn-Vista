import MentorRepo from "../../repositories/mentor/MentorRepo";

class MentorService{
    async getMentor(id:string) {
        const mentor = await MentorRepo.findById(id);
        if (!mentor) throw new Error("Please login");
        if(mentor.isBlock) throw new Error("You're account was blocked please contect LV admin")
        const Rementor= {
            // _id: mentor._id,
            username: mentor.username,
            email: mentor.email,
            expertise: mentor.expertise,
            experience: mentor.experience,
            bio: mentor.bio,
            applicationDate:mentor.applicationDate,
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