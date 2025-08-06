import express from 'express';
import { TYPES } from '../../core/types';
import { verifyMentor } from '../../middlewares/mentorVerify';
import { IMentorController } from '../../core/interfaces/controllers/mentor/IMentor.Controller';
import { IMentorAuthController } from '../../core/interfaces/controllers/mentor/IMentorAuth.Controller';
import container from '../../core/di/container';
import { IMentorProfileController } from '../../core/interfaces/controllers/mentor/IMentorProfile.controller';
import  { uploadConcernFiles, uploadImage } from '../../middlewares/upload';
import {  IMentorStreamController } from '../../core/interfaces/controllers/mentor/IMentorStream.controller';
import { IMentorLessonsController } from '../../core/interfaces/controllers/mentor/IMentorLesson.Controller';
import { IMentorStudentsController } from '../../core/interfaces/controllers/mentor/ImentorStudent.controller';
import { IMentorConcernController } from '../../core/interfaces/controllers/mentor/IMentorConcern.Controller';
import { IMentorCommentsController } from '../../core/interfaces/controllers/mentor/IMentorComments.controller';
import { IMentorCourseController } from '../../core/interfaces/controllers/mentor/IMentorCourse.controller';
const router = express.Router();
const mentorAuthController = container.get<IMentorAuthController>(TYPES.MentorAuthController);
const mentorController = container.get<IMentorController>(TYPES.MentorController);
const mentorProfileController = container.get<IMentorProfileController>(TYPES.MentorProfileController)
const mentorLessonController=container.get<IMentorLessonsController>(TYPES.MentorLessonsController)
const mentorStreamController = container.get<IMentorStreamController>(TYPES.MentorStreamController)
const mentorStudentsController = container.get<IMentorStudentsController>(TYPES.MentorStudentsController)
const _mentorConcernControler = container.get<IMentorConcernController>(TYPES.mentorConcernController)
const _mentorCommentController = container.get<IMentorCommentsController>(TYPES.MentorCommentController)
const _mentorCourseController=container.get<IMentorCourseController>(TYPES.MentorCourseController)
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