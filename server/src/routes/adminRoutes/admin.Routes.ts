import express from "express";
import verifyAdmin from "../../middlewares/authVerifyAdmin";
import { uploadImage } from "../../middlewares/upload";
import { CreateCategoryDto } from "../../shared/dtos/categories/category.dto";
import { validateDto } from "../../middlewares/validateDto";
import { AdminLoginDto } from "../../shared/dtos/auth/login.dto";
import { adminAuthController, adminUsersController, adminMentorController, adminCourseController, adminCategoryController, adminConcernController, adminDonationController } from "./adminController";
const route = express.Router();


route.post("/login",validateDto(AdminLoginDto), adminAuthController.login.bind(adminAuthController));
route.post("/logout", verifyAdmin, adminAuthController.logout.bind(adminAuthController));
route.get("/users", verifyAdmin, adminUsersController.getAllUsers.bind(adminUsersController));
route.patch("/users/block", verifyAdmin, adminUsersController.userBlock.bind(adminUsersController));
route.get("/mentors", verifyAdmin, adminMentorController.getAllMentors.bind(adminMentorController));
route.get("/all/mentors",verifyAdmin,adminMentorController.getAllMentorsNotFiltering.bind(adminMentorController))
route.get("/mentor/:id", verifyAdmin, adminMentorController.mentorDetils.bind(adminMentorController));
route.patch("/mentor/:mentorId/status", verifyAdmin, adminMentorController.changeStatus.bind(adminMentorController));
route.patch("/mentor/:mentorId/block", verifyAdmin, adminMentorController.blockMentor.bind(adminMentorController));
route.patch("/courses/:courseId",verifyAdmin, uploadImage.single('thumbnail'),adminCourseController.editCourse.bind(adminCourseController))
route.post("/courses", verifyAdmin, uploadImage.single('thumbnail'), adminCourseController.createClass.bind(adminCourseController));
route.get("/courses",verifyAdmin, adminCourseController.getCourse.bind(adminCourseController));
route.patch("/courses/:id/block",verifyAdmin,adminCourseController.blockCourses.bind(adminCourseController))
route.post("/categories", verifyAdmin, validateDto(CreateCategoryDto), adminCategoryController.addCategory.bind(adminCategoryController));
route.get("/categories", verifyAdmin, adminCategoryController.getAllCategories.bind(adminCategoryController));
route.get("/all/category",verifyAdmin,adminCategoryController.getCategories.bind(adminCategoryController))
route.patch("/categories/:id/block", verifyAdmin, adminCategoryController.blockCategory.bind(adminCategoryController));
route.patch("/categories/:id", verifyAdmin, adminCategoryController.editCategory.bind(adminCategoryController));
route.get("/concerns", verifyAdmin, adminConcernController.getConcernController.bind(adminConcernController))
route.patch("/concern/:id/status",verifyAdmin,adminConcernController.updateConcernStatus.bind(adminConcernController) );
route.get("/all/concerns",verifyAdmin,adminConcernController.getAllConcerns.bind(adminConcernController))
route.get("/donations", verifyAdmin, adminDonationController.getDonations.bind(adminDonationController));
route.get("/donations/filter", verifyAdmin, adminDonationController.getFilteredDonations.bind(adminDonationController));
route.get("/user/certificates/:userId",verifyAdmin,adminUsersController.getCertificate.bind(adminUsersController))
route.patch("/user/certificates/:certificateId/revoke", verifyAdmin, adminUsersController.revokCertificate.bind(adminUsersController));
route.get("/course/lessons/:courseId",verifyAdmin,adminCourseController.getLessons.bind(adminCourseController))
export default route;
