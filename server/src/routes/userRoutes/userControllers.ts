import container from "../../core/di/container";
import { TYPES } from "../../core/types";
import AuthController from "../../controllers/user/auth.controller";
import { ProfileController } from "../../controllers/user/profile.controller";
import { IUserController } from "../../core/interfaces/controllers/user/IUser.controller";
import { IUserCourseController } from "../../core/interfaces/controllers/user/IUserCourse.controller";
import { IUserLiveController } from "../../core/interfaces/controllers/user/IUserLiveVideo.controller";
import { IUserLessonsController } from "../../core/interfaces/controllers/user/IUserLessons.controller";
import { IUserDonationController } from "../../core/interfaces/controllers/user/IUserDonation.controller";
import { IUserCertificateController } from "../../core/interfaces/controllers/user/IUserCertificate.controller";

export const authController = container.get<AuthController>(TYPES.AuthController);
export const profileController = container.get<ProfileController>(TYPES.ProfileController);
export const userController = container.get<IUserController>(TYPES.UserController);
export const userCourseController = container.get<IUserCourseController>(TYPES.UserCourseController);
export const userLiveController = container.get<IUserLiveController>(TYPES.UserLiveCOntroller);
export const userLessonsController = container.get<IUserLessonsController>(TYPES.UserLessonsController);
export const userDonationController = container.get<IUserDonationController>(TYPES.UserDonationController);
export const userCertificateController = container.get<IUserCertificateController>(TYPES.UserCertificateController);
