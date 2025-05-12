import express from "express";
import verifyAdmin from "../../middlewares/authVerifyAdmin";
import container from "../../core/di/container";
import { TYPES } from "../../core/types";
import { IAdminUserController } from "../../core/interfaces/controllers/admin/IAdminUser.controller";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.Controller";
import { IAdminMentorController } from "../../core/interfaces/controllers/admin/IAdminMentor.Controller";
import { IAdminCourseController } from "../../core/interfaces/controllers/admin/IAdminCourse.Controller";
import { uploadImage } from "../../middlewares/upload";
const route = express.Router();

const adminMentorController = container.get<IAdminMentorController>(TYPES.AdminMentorController);
const adminUsersController = container.get<IAdminUserController>(TYPES.AdminUserController); 
const adminAuthController = container.get<IAdminAuthController>(TYPES.AdminAuthController)
const adminCourseController=container.get<IAdminCourseController>(TYPES.AdminCourseController)
route.post("/login", adminAuthController.login.bind(adminAuthController));
route.post("/logout", verifyAdmin, adminAuthController.logout.bind(adminAuthController));
route.get("/users", verifyAdmin, adminUsersController.getAllUsers.bind(adminUsersController));
route.patch("/users/block", verifyAdmin, adminUsersController.userBlock.bind(adminUsersController));
route.get("/mentors", verifyAdmin, adminMentorController.getAllMentors.bind(adminMentorController));
route.get("/mentor/:id", verifyAdmin, adminMentorController.mentorDetils.bind(adminMentorController));
route.patch("/mentor/change-status", verifyAdmin, adminMentorController.changeStatus.bind(adminMentorController));
route.patch("/mentor/block", verifyAdmin, adminMentorController.blockMentor.bind(adminMentorController));
route.patch("/course/edit-course",verifyAdmin, uploadImage.single('thumbnail'),adminCourseController.editCourse.bind(adminCourseController))
route.post("/create-course", verifyAdmin, uploadImage.single('thumbnail'), adminCourseController.createClass.bind(adminCourseController));
route.get("/courses", adminCourseController.getCourse.bind(adminCourseController));
route.patch("/block-courses",adminCourseController.blockCourses.bind(adminCourseController))
route.post("/add-categories", verifyAdmin, adminCourseController.addCategories.bind(adminCourseController));
route.get("/categories", verifyAdmin, adminCourseController.getAllCategories.bind(adminCourseController));
route.patch("/categorie/block", verifyAdmin, adminCourseController.blockCategorie.bind(adminCourseController));
route.patch("/edit/category",verifyAdmin,adminCourseController.editCategories.bind(adminCourseController))

export default route;
