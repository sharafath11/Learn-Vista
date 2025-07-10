import express from "express";
import verifyAdmin from "../../middlewares/authVerifyAdmin";
import container from "../../core/di/container";
import { TYPES } from "../../core/types";
import { IAdminUserController } from "../../core/interfaces/controllers/admin/IAdminUser.controller";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.Controller";
import { IAdminMentorController } from "../../core/interfaces/controllers/admin/IAdminMentor.Controller";
import { IAdminCourseController } from "../../core/interfaces/controllers/admin/IAdminCourse.Controller";
import { uploadImage } from "../../middlewares/upload";
import { IAdminDonationController } from "../../core/interfaces/controllers/admin/IAdminDonation.Controller";
import router from "../userRoutes/user.Routes";
const route = express.Router();

const adminMentorController = container.get<IAdminMentorController>(TYPES.AdminMentorController);
const adminUsersController = container.get<IAdminUserController>(TYPES.AdminUserController); 
const adminAuthController = container.get<IAdminAuthController>(TYPES.AdminAuthController)
const adminCourseController = container.get<IAdminCourseController>(TYPES.AdminCourseController)
const adminDonationController=container.get<IAdminDonationController>(TYPES.AdminDonationCOntroller)
route.post("/login", adminAuthController.login.bind(adminAuthController));
route.post("/logout", verifyAdmin, adminAuthController.logout.bind(adminAuthController));
route.get("/users", verifyAdmin, adminUsersController.getAllUsers.bind(adminUsersController));
route.patch("/users/block", verifyAdmin, adminUsersController.userBlock.bind(adminUsersController));
route.get("/mentors", verifyAdmin, adminMentorController.getAllMentors.bind(adminMentorController));
route.get("/all/mentors",verifyAdmin,adminMentorController.getAllMentorsNotFiltering.bind(adminMentorController))
route.get("/mentor/:id", verifyAdmin, adminMentorController.mentorDetils.bind(adminMentorController));
route.patch("/mentor/change-status", verifyAdmin, adminMentorController.changeStatus.bind(adminMentorController));
route.patch("/mentor/block", verifyAdmin, adminMentorController.blockMentor.bind(adminMentorController));
route.patch("/course/edit-course",verifyAdmin, uploadImage.single('thumbnail'),adminCourseController.editCourse.bind(adminCourseController))
route.post("/create-course", verifyAdmin, uploadImage.single('thumbnail'), adminCourseController.createClass.bind(adminCourseController));
route.get("/courses",verifyAdmin, adminCourseController.getCourse.bind(adminCourseController));
route.patch("/block-courses",verifyAdmin,adminCourseController.blockCourses.bind(adminCourseController))
route.post("/add-categories", verifyAdmin, adminCourseController.addCategories.bind(adminCourseController));
route.get("/categories", verifyAdmin, adminCourseController.getAllCategories.bind(adminCourseController));
route.get("/all/categegory",verifyAdmin,adminCourseController.getCategories.bind(adminCourseController))
route.patch("/categorie/block", verifyAdmin, adminCourseController.blockCategorie.bind(adminCourseController));
route.patch("/edit/category", verifyAdmin, adminCourseController.editCategories.bind(adminCourseController));
route.get("/concers", verifyAdmin, adminCourseController.getConcernController.bind(adminCourseController))
route.patch("/concern/:id/status",verifyAdmin,adminCourseController.updateConcernStatus.bind(adminCourseController) );
route.get("/all/concerns",verifyAdmin,adminCourseController.getAllConcerns.bind(adminCourseController))
route.get("/donations", verifyAdmin, adminDonationController.getDonations.bind(adminDonationController));
route.get("/donations/filter",verifyAdmin,adminDonationController.getFilteredDonations.bind(adminDonationController))

export default route;
