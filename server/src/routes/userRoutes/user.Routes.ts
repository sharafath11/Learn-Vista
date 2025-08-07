import express from "express";
import container from "../../core/di/container";
import AuthController from "../../controllers/user/auth.controller";
import { TYPES } from "../../core/types";
import { ProfileController } from "../../controllers/user/profile.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";
import upload, { uploadDailyTaskAudio, uploadImage } from "../../middlewares/upload";
import { IUserController } from "../../core/interfaces/controllers/user/IUserController";
import { IUserCourseController } from "../../core/interfaces/controllers/user/IUserCourseController";
import { IUserLiveController } from "../../core/interfaces/controllers/user/IUserLiveVideoController";
import { IUserLessonsController } from "../../core/interfaces/controllers/user/IUserLessonsContoller";
import { IUserDonationController } from "../../core/interfaces/controllers/user/IUserDonationController";
import { UserLessonsController } from "../../controllers/user/userLessons.controller";
import { IUserCertificateController } from "../../core/interfaces/controllers/user/IUserCertificateController";


const router = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);
const profileController = container.get<ProfileController>(TYPES.ProfileController);
const userController = container.get<IUserController>(TYPES.UserController);
const userCourseController = container.get<IUserCourseController>(TYPES.UserCourseController)
const userLiveController = container.get<IUserLiveController>(TYPES.UserLiveCOntroller)
const userLessonsController = container.get<IUserLessonsController>(TYPES.UserLessonsController)
const userDonationController = container.get<IUserDonationController>(TYPES.UserDonationController);
const userCertificateController=container.get<IUserCertificateController>(TYPES.UserCertificateController)

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
router.patch('/profile', authenticateToken, uploadImage.single('image'), profileController.editProfile.bind(profileController))
router.get("/courses",authenticateToken, userCourseController.getAllCourse.bind(userCourseController));
router.patch("/courses/:courseId", authenticateToken, userCourseController.updateUserCourse.bind(userCourseController));
router.get("/start-live/vc/:courseId", authenticateToken, userLiveController.getRoomId.bind(userLiveController));
router.patch("/profile/password", authenticateToken, profileController.changePassword.bind(profileController));
router.get("/courses/lessons/:courseId",authenticateToken,userLessonsController.getLessons.bind(userLessonsController))
router.get("/lessons/:lessonId/questions",authenticateToken,userLessonsController.getQuestions.bind(userLessonsController));
router.get("/lessons/:lessonId/details",authenticateToken,userLessonsController.getAllDetilsInLesson.bind(userLessonsController));
router.post("/lessons/:lessonId/report",authenticateToken,userLessonsController.getLessonReport.bind(userLessonsController));
router.get("/categories",userCourseController.getCategories.bind(userCourseController))
router.post("/lessons/:lessonId/comment",authenticateToken,userLessonsController.saveComments.bind(userLessonsController));
router.post("/donations/checkout-session", userDonationController.createCheckoutSession.bind(userDonationController))
router.get("/donation-session/:sessionId/verify", userDonationController.verifySession.bind(userDonationController))
router.get("/course/progress", authenticateToken, userCourseController.getProgressDetiles.bind(userCourseController))
router.get("/let-fun/psc", userController.getQuestionByNumber.bind(userController));
router.patch("/lessons/:lessonId/progress",authenticateToken,userLessonsController.updateLessonProgress.bind(userLessonsController));
router.get("/donations/:page", authenticateToken, userDonationController.getPaginatedDonations.bind(userDonationController));
router.get("/certificates", authenticateToken, userCertificateController.getCertificates.bind(userCertificateController))
router.get("/certificate/:certificateId", authenticateToken, userCertificateController.getCertificate.bind(userCertificateController))
router
  .route("/daily-task/today")
  .get(authenticateToken, userController.getDailyTask.bind(userController))
  .post(uploadDailyTaskAudio.single("audioFile"), authenticateToken, userController.updateDailyTask.bind(userController));

router.get("/dailyTaks",authenticateToken,userController.getAllDailyTask.bind(userController))
export default router;
