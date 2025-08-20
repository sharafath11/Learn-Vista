import express from 'express';
import { verifyMentor } from '../../middlewares/mentorVerify';
import  { uploadConcernFiles, uploadImage } from '../../middlewares/upload';
import { mentorAuthController, mentorProfileController, mentorController, _mentorCourseController, mentorStreamController, mentorLessonController, mentorStudentsController, _mentorConcernControler, _mentorCommentController } from './mentorController';
import { checkMentorBlock } from '../../middlewares/checkMentorBlock';
const router = express.Router();

router.post('/auth/signup', mentorAuthController.signupController.bind(mentorAuthController));
router.post('/auth/signup/otp',mentorAuthController.mentorOtpControler.bind(mentorAuthController));
router.post('/auth/signup/otp/verify',mentorAuthController.verifyOtp.bind(mentorAuthController));
router.post('/auth/login', mentorAuthController.login.bind(mentorAuthController));
router.post('/auth/logout',mentorAuthController.logout.bind(mentorAuthController));
router.patch("/profile",uploadImage.single('image'),verifyMentor,mentorProfileController.editProfile.bind(mentorProfileController))
router.get('/me', verifyMentor,checkMentorBlock,mentorController.getMentor.bind(mentorController));
router.post("/auth/password/forgot",mentorAuthController.forgetPassword.bind(mentorAuthController));
router.post("/auth/password/reset",verifyMentor,checkMentorBlock,mentorAuthController.restartPassword.bind(mentorAuthController));
router.get("/courses", verifyMentor,checkMentorBlock, _mentorCourseController.getCourses.bind(_mentorCourseController));
router.patch("/courses/:courseId/status",verifyMentor,checkMentorBlock, _mentorCourseController.changeStatus.bind(_mentorCourseController));
router.get("/courses/:courseId/stream/start", verifyMentor, checkMentorBlock,mentorStreamController.startStreamController.bind(mentorStreamController));
router.get("/stream/:liveId/end",verifyMentor,checkMentorBlock,mentorStreamController.endStreamController.bind(mentorStreamController))
router.post("/me/password",verifyMentor,checkMentorBlock,mentorProfileController.changePassword.bind(mentorProfileController))
router.get("/courses/:courseId/lessons", verifyMentor, checkMentorBlock,mentorLessonController.getLessons.bind(mentorLessonController));
router.post("/lessons/upload-url", verifyMentor, checkMentorBlock,mentorLessonController.S3Upload.bind(mentorLessonController));
router.post(
    "/lessons",
    verifyMentor,checkMentorBlock,
    uploadImage.single("thumbnail"), 
    
    mentorLessonController.addLesson.bind(mentorLessonController)
    );
router.patch(
  "/lessons/:lessonId",checkMentorBlock,
  verifyMentor,
  uploadImage.single("thumbnail"),
  mentorLessonController.editLesson.bind(mentorLessonController)
);
router.post("/delete-s3-file", verifyMentor,checkMentorBlock, mentorLessonController.deleteS3File.bind(mentorLessonController));
router.post("/lessons/:lessonId/video-url",verifyMentor,checkMentorBlock,mentorLessonController.getSignedVideoUrl.bind(mentorLessonController))
// router.post("/uploadfiles-to-s3", verifyMentor, mentorLessonController.uploadToS3.bind(mentorLessonController));
router.post("/lessons/question",verifyMentor,checkMentorBlock, mentorLessonController.addQuestions.bind(mentorLessonController));
router.get("/lessons/:lessonId/questions",verifyMentor,checkMentorBlock, mentorLessonController.getQuestions.bind(mentorLessonController));
router.patch("/questions/:questionId", verifyMentor,checkMentorBlock, mentorLessonController.editQuestions.bind(mentorLessonController));
router.get("/course/:courseId/students", verifyMentor,checkMentorBlock, mentorStudentsController.getStudentDetilesController.bind(mentorStudentsController));
router.get("/lessons/:lessonId/comments",verifyMentor,checkMentorBlock,mentorLessonController.getComments.bind(mentorLessonController))
router.patch("/students/:studentId/block", verifyMentor,checkMentorBlock, mentorStudentsController.blockStudentController.bind(mentorStudentsController));
router.post("/lessons/options",verifyMentor,checkMentorBlock,mentorLessonController.genarateOptions.bind(mentorLessonController))
router.post(
  "/concerns",verifyMentor,checkMentorBlock,
  uploadConcernFiles.array("attachments", 5), 
  _mentorConcernControler.addConcern.bind(_mentorConcernControler)
);
router.get("/concerns", verifyMentor,checkMentorBlock, _mentorConcernControler.getConcern.bind(_mentorConcernControler))
router.get("/courses/pagenated", verifyMentor,checkMentorBlock, _mentorCourseController.getPaginatedCourses.bind(_mentorCourseController));
router.get("/comments", verifyMentor,checkMentorBlock, _mentorCommentController.getAllComments.bind(_mentorCommentController));
router.patch("/courses/:courseId/publish",verifyMentor,checkMentorBlock,_mentorCourseController.publishCourse.bind(_mentorCourseController))

export default router;