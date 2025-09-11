import container from "../../core/di/container";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.controller";
import { IAdminCategoryController } from "../../core/interfaces/controllers/admin/IAdminCategory.controller";
import { IAdminConcernController } from "../../core/interfaces/controllers/admin/IAdminConcern.controller";
import { IAdminCourseController } from "../../core/interfaces/controllers/admin/IAdminCourse.controller";
import { IAdminDonationController } from "../../core/interfaces/controllers/admin/IAdminDonation.controller";
import { IAdminMentorController } from "../../core/interfaces/controllers/admin/IAdminMentor.controller";
import { IAdminUserController } from "../../core/interfaces/controllers/admin/IAdminUser.controller";
import { TYPES } from "../../core/types";

export const adminMentorController = container.get<IAdminMentorController>(TYPES.AdminMentorController);
export const adminUsersController = container.get<IAdminUserController>(TYPES.AdminUserController); 
export const adminAuthController = container.get<IAdminAuthController>(TYPES.AdminAuthController)
export const adminCourseController = container.get<IAdminCourseController>(TYPES.AdminCourseController)
export const adminDonationController = container.get<IAdminDonationController>(TYPES.AdminDonationCOntroller)
export const adminConcernController = container.get<IAdminConcernController>(TYPES.AdminConcernController)
export const adminCategoryController=container.get<IAdminCategoryController>(TYPES.AdminCategoryController)