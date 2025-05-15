import express from "express";
import container from "../../core/di/container";
import AuthController from "../../controllers/user/auth.controller";
import { TYPES } from "../../core/types";
import { ProfileController } from "../../controllers/user/profile.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";
import upload, { uploadImage } from "../../middlewares/upload";
import { IUserController } from "../../core/interfaces/controllers/user/IUserController";
import { IUserCourseController } from "../../core/interfaces/controllers/user/IUserCourseController";


const router = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);
const profileController = container.get<ProfileController>(TYPES.ProfileController);
const userController = container.get<IUserController>(TYPES.UserController);
const userCourseController=container.get<IUserCourseController>(TYPES.UserCourseController)

router.post("/signup", authController.signup.bind(authController));
router.post("/google/signup", authController.googleAuth.bind(authController));
router.post("/otp", authController.sendOtp.bind(authController));
router.post("/otp-verify", authController.verifyOtp.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.post("/forgot-password", userController.forgotPasword.bind(userController));
router.post("/reset-password",userController.resetPassword.bind(userController))
router.get("/user", authenticateToken, userController.getUser.bind(userController));
router.post("/apply-mentor", 
  authenticateToken,
  upload.single("cv"),
  profileController.applyMentor.bind(profileController)
);
router.post('/edit-profile', authenticateToken, uploadImage.single('image'), profileController.editProfile.bind(profileController))
router.get("/courses", userCourseController.getAllCourse.bind(userCourseController));
router.patch("/update-course",authenticateToken,userCourseController.updateUserCourse.bind(userCourseController))

export default router;