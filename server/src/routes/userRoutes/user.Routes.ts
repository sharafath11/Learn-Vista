import express from "express";
import { authenticateToken } from "../../middlewares/authenticateToken";
import upload, { uploadDailyTaskAudio, uploadImage } from "../../middlewares/upload";
import { authController, profileController, userCertificateController, userController, userCourseController, userDonationController, userLessonsController, userLiveController } from "./userControllers";
import { checkUserBlock } from "../../middlewares/checkUserBlock";


const router = express.Router();
router.post("/signup", authController.signup.bind(authController));
router.post("/google/signup", authController.googleAuth.bind(authController));
router.post("/otp", authController.sendOtp.bind(authController));
router.post("/otp-verify", authController.verifyOtp.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.post("/forgot-password", userController.forgotPasword.bind(userController));
router.post("/reset-password",checkUserBlock,userController.resetPassword.bind(userController))
router.get("/user", authenticateToken, checkUserBlock,userController.getUser.bind(userController));
router.post("/apply-mentor", 
  authenticateToken,checkUserBlock,
  upload.single("cv"),
  profileController.applyMentor.bind(profileController)
);
router.patch('/profile', authenticateToken,checkUserBlock, uploadImage.single('image'), profileController.editProfile.bind(profileController))
router.get("/courses",authenticateToken,checkUserBlock, userCourseController.getAllCourse.bind(userCourseController));
router.patch("/courses/:courseId", authenticateToken,checkUserBlock, userCourseController.updateUserCourse.bind(userCourseController));
router.get("/start-live/vc/:courseId", authenticateToken,checkUserBlock, userLiveController.getRoomId.bind(userLiveController));
router.get("/live/:liveId/verify",authenticateToken,checkUserBlock,userLiveController.verify.bind(userLiveController))
router.patch("/profile/password", authenticateToken,checkUserBlock, profileController.changePassword.bind(profileController));
router.get("/courses/lessons/:courseId",authenticateToken,checkUserBlock,userLessonsController.getLessons.bind(userLessonsController))
router.get("/lessons/:lessonId/questions",authenticateToken,checkUserBlock,userLessonsController.getQuestions.bind(userLessonsController));
router.get("/lessons/:lessonId/details",authenticateToken,checkUserBlock,userLessonsController.getAllDetilsInLesson.bind(userLessonsController));
router.post("/lessons/:lessonId/report",authenticateToken,checkUserBlock,userLessonsController.getLessonReport.bind(userLessonsController));
router.get("/categories",userCourseController.getCategories.bind(userCourseController))
router.post("/lessons/:lessonId/comment",authenticateToken,checkUserBlock,userLessonsController.saveComments.bind(userLessonsController));
router.post("/donations/checkout-session",checkUserBlock, userDonationController.createCheckoutSession.bind(userDonationController))
router.get("/donation-session/:sessionId/verify", userDonationController.verifySession.bind(userDonationController))
router.get("/course/progress", authenticateToken,checkUserBlock, userCourseController.getProgressDetiles.bind(userCourseController))
router.get("/let-fun/psc", authenticateToken, checkUserBlock, userController.getQuestionByNumber.bind(userController));
router.post("/psc/check-answer",authenticateToken,checkUserBlock,userController.checkPSCAnswer.bind(userController))
router.patch("/lessons/:lessonId/progress", authenticateToken, checkUserBlock, userLessonsController.updateLessonProgress.bind(userLessonsController));
router.post("/lessons/:lessonId/voicenote", authenticateToken, checkUserBlock, userLessonsController.saveVoiceNote.bind(userLessonsController))
      .get("/lessons/:lessonId/voicenotes", authenticateToken, checkUserBlock, userLessonsController.getVoiceNotes.bind(userLessonsController))
      .delete("/lessons/:lessonId/voicenote/:voiceNoteId", authenticateToken, checkUserBlock, userLessonsController.deleteVoiceNote.bind(userLessonsController))
      .patch("/lessons/:lessonId/voicenote/:voiceNoteId", authenticateToken, checkUserBlock, userLessonsController.editVoiceNote.bind(userLessonsController));


router.delete("/lessons/:lessonId/voicenotes", authenticateToken, checkUserBlock, userLessonsController.getVoiceNotes.bind(userLessonsController));
router.get("/donations/:page", authenticateToken,checkUserBlock, userDonationController.getPaginatedDonations.bind(userDonationController));
router.get("/certificates", authenticateToken,checkUserBlock, userCertificateController.getCertificates.bind(userCertificateController))
router.get("/certificate/:certificateId",userCertificateController.getCertificate.bind(userCertificateController))
router
  .route("/daily-task/today")
  .get(authenticateToken,checkUserBlock, userController.getDailyTask.bind(userController))
  .post(uploadDailyTaskAudio.single("audioFile"), authenticateToken,checkUserBlock, userController.updateDailyTask.bind(userController));

router.get("/dailyTaks",authenticateToken,checkUserBlock,userController.getAllDailyTask.bind(userController))
export default router;
