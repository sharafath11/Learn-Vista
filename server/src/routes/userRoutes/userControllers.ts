import container from "../../core/di/container";
import { TYPES } from "../../core/types";
import AuthController from "../../controllers/user/auth.controller";
import { ProfileController } from "../../controllers/user/profile.controller";
import { IUserController } from "../../core/interfaces/controllers/user/IUserController";
import { IUserCourseController } from "../../core/interfaces/controllers/user/IUserCourseController";
import { IUserLiveController } from "../../core/interfaces/controllers/user/IUserLiveVideoController";
import { IUserLessonsController } from "../../core/interfaces/controllers/user/IUserLessonsContoller";
import { IUserDonationController } from "../../core/interfaces/controllers/user/IUserDonationController";
import { IUserCertificateController } from "../../core/interfaces/controllers/user/IUserCertificateController";

export const authController = container.get<AuthController>(TYPES.AuthController);
export const profileController = container.get<ProfileController>(TYPES.ProfileController);
export const userController = container.get<IUserController>(TYPES.UserController);
export const userCourseController = container.get<IUserCourseController>(TYPES.UserCourseController);
export const userLiveController = container.get<IUserLiveController>(TYPES.UserLiveCOntroller);
export const userLessonsController = container.get<IUserLessonsController>(TYPES.UserLessonsController);
export const userDonationController = container.get<IUserDonationController>(TYPES.UserDonationController);
export const userCertificateController = container.get<IUserCertificateController>(TYPES.UserCertificateController);
