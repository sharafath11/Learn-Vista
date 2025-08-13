import express from 'express';
import { verifyMentor } from '../../middlewares/mentorVerify';
import  { uploadConcernFiles, uploadImage } from '../../middlewares/upload';
import { mentorAuthController, mentorProfileController, mentorController, _mentorCourseController, mentorStreamController, mentorLessonController, mentorStudentsController, _mentorConcernControler, _mentorCommentController } from './mentorController';
const router = express.Router();

router.post('/auth/signup', (req, res) => mentorAuthController.signupController(req, res));
router.post('/auth/signup/otp', (req, res) => mentorAuthController.mentorOtpControler(req, res));
router.post('/auth/signup/otp/verify', (req, res) => mentorAuthController.verifyOtp(req, res));
router.post('/auth/login', (req, res) => mentorAuthController.login(req, res));
router.post('/auth/logout', (req, res) => mentorAuthController.logout(req, res));
router.patch("/profile",uploadImage.single('image'),verifyMentor,(req,res)=>mentorProfileController.editProfile(req,res))
router.get('/me', verifyMentor, (req, res, next) => {
    mentorController.getMentor(req, res).catch(next);
});
router.post("/auth/password/forgot", (req, res) => mentorAuthController.forgetPassword(req, res));
router.post("/auth/password/reset", (req, res) => mentorAuthController.restartPassword(req, res));
router.get("/courses", verifyMentor, _mentorCourseController.getCourses.bind(_mentorCourseController));
router.patch("/courses/:courseId/status",verifyMentor, _mentorCourseController.changeStatus.bind(_mentorCourseController));
router.get("/courses/:courseId/stream/start", verifyMentor, mentorStreamController.startStreamController.bind(mentorStreamController));
router.get("/stream/:liveId/end",verifyMentor,mentorStreamController.endStreamController.bind(mentorStreamController))
router.post("/me/password",verifyMentor,mentorProfileController.changePassword.bind(mentorProfileController))
router.get("/courses/:courseId/lessons", verifyMentor, mentorLessonController.getLessons.bind(mentorLessonController));
router.post("/lessons/upload-url", verifyMentor, mentorLessonController.S3Upload.bind(mentorLessonController));
router.post(
    "/lessons",
    verifyMentor,
    uploadImage.single("thumbnail"), 
    
    mentorLessonController.addLesson.bind(mentorLessonController)
    );
router.patch(
  "/lessons/:lessonId",
  verifyMentor,
  uploadImage.single("thumbnail"),
  mentorLessonController.editLesson.bind(mentorLessonController)
);
router.post("/delete-s3-file", verifyMentor, mentorLessonController.deleteS3File.bind(mentorLessonController));
router.post("/lessons/:lessonId/video-url",verifyMentor,mentorLessonController.getSignedVideoUrl.bind(mentorLessonController))
// router.post("/uploadfiles-to-s3", verifyMentor, mentorLessonController.uploadToS3.bind(mentorLessonController));
router.post("/lessons/question",verifyMentor, mentorLessonController.addQuestions.bind(mentorLessonController));
router.get("/lessons/:lessonId/questions",verifyMentor, mentorLessonController.getQuestions.bind(mentorLessonController));
router.patch("/questions/:questionId", verifyMentor, mentorLessonController.editQuestions.bind(mentorLessonController));
router.get("/course/:courseId/students", verifyMentor, mentorStudentsController.getStudentDetilesController.bind(mentorStudentsController));
router.get("/lessons/:lessonId/comments",verifyMentor,mentorLessonController.getComments.bind(mentorLessonController))
router.patch("/students/:studentId/block", verifyMentor, mentorStudentsController.blockStudentController.bind(mentorStudentsController));
router.post("/lessons/options",verifyMentor,mentorLessonController.genarateOptions.bind(mentorLessonController))
router.post(
  "/concerns",verifyMentor,
  uploadConcernFiles.array("attachments", 5), 
  _mentorConcernControler.addConcern.bind(_mentorConcernControler)
);
router.get("/concerns", verifyMentor, _mentorConcernControler.getConcern.bind(_mentorConcernControler))
router.get("/courses/pagenated", verifyMentor, _mentorCourseController.getPaginatedCourses.bind(_mentorCourseController));
router.get("/comments", verifyMentor, _mentorCommentController.getAllComments.bind(_mentorCommentController));
router.patch("/courses/:courseId/publish",verifyMentor,_mentorCourseController.publishCourse.bind(_mentorCourseController))

export default router;