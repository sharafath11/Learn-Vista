import express from 'express';
import { TYPES } from '../../core/types';
import { verifyMentor } from '../../middlewares/mentorVerify';
import { IMentorController } from '../../core/interfaces/controllers/mentor/IMentor.Controller';
import { IMentorAuthController } from '../../core/interfaces/controllers/mentor/IMentorAuth.Controller';
import container from '../../core/di/container';
import { IMentorProfileController } from '../../core/interfaces/controllers/mentor/IMentorProfile.controller';
import upload, { uploadConcernFiles, uploadImage } from '../../middlewares/upload';
import {  IMentorStreamController } from '../../core/interfaces/controllers/mentor/IMentorStream.controller';
import { IMentorLessonsController } from '../../core/interfaces/controllers/mentor/IMentorLesson.Controller';
import { IMentorStudentService } from '../../core/interfaces/services/mentor/IMentorStudent.Service';
import { IMentorStudentsController } from '../../core/interfaces/controllers/mentor/ImentorStudent.controller';
import { IMentorConcernController } from '../../core/interfaces/controllers/mentor/IMentorConcern.Controller';
import { MarketplaceDeployment } from 'aws-sdk';
const router = express.Router();
const mentorAuthController = container.get<IMentorAuthController>(TYPES.MentorAuthController);
const mentorController = container.get<IMentorController>(TYPES.MentorController);
const mentorProfileController = container.get<IMentorProfileController>(TYPES.MentorProfileController)
const mentorLessonController=container.get<IMentorLessonsController>(TYPES.MentorLessonsController)
const mentorStreamController = container.get<IMentorStreamController>(TYPES.MentorStreamController)
const mentorStudentsController = container.get<IMentorStudentsController>(TYPES.MentorStudentsController)
const _mentorConcernControler=container.get<IMentorConcernController>(TYPES.mentorConcernController)
router.post('/signup', (req, res) => mentorAuthController.signupController(req, res));
router.post('/send-otp', (req, res) => mentorAuthController.mentorOtpControler(req, res));
router.post('/otp/verify', (req, res) => mentorAuthController.verifyOtp(req, res));
router.post('/login', (req, res) => mentorAuthController.login(req, res));
router.post('/logout', (req, res) => mentorAuthController.logout(req, res));
router.post("/edit-profile",uploadImage.single('image'),verifyMentor,(req,res)=>mentorProfileController.editProfile(req,res))
router.get('/get-mentor', verifyMentor, (req, res, next) => {
    mentorController.getMentor(req, res).catch(next);
});
router.post("/forget-password", (req, res) => mentorAuthController.forgetPassword(req, res));
router.post("/reset-password", (req, res) => mentorAuthController.restartPassword(req, res));
router.get("/courses", verifyMentor, mentorController.getCourses.bind(mentorController));
router.patch("/course/status-change",verifyMentor, mentorController.statusChange.bind(mentorController));
router.get("/live-session/start/:courseId", verifyMentor, mentorStreamController.startStreamController.bind(mentorStreamController));
router.get("/end/stream/:liveId",verifyMentor,mentorStreamController.endStreamController.bind(mentorStreamController))
router.post("/change/password",verifyMentor,mentorProfileController.changePassword.bind(mentorProfileController))
router.get("/courses/lessons/:courseId", verifyMentor, mentorLessonController.getLessons.bind(mentorLessonController));
router.post("/generate-s3-upload-url", verifyMentor, mentorLessonController.S3Upload.bind(mentorLessonController)),
router.post(
    "/add-lessons",
    verifyMentor,
    uploadImage.single("thumbnail"), 
    
    mentorLessonController.addLesson.bind(mentorLessonController)
    );
router.patch(
  "/edit/lessons/:lessonId",
  verifyMentor,
  uploadImage.single("thumbnail"),
  mentorLessonController.editLesson.bind(mentorLessonController)
);
router.post("/delete-s3-file", verifyMentor, mentorLessonController.deleteS3File.bind(mentorLessonController));
router.post("/play-video",verifyMentor,mentorLessonController.getSignedVideoUrl.bind(mentorLessonController))
// router.post("/uploadfiles-to-s3", verifyMentor, mentorLessonController.uploadToS3.bind(mentorLessonController));
router.post("/lessons/add/questions",verifyMentor, mentorLessonController.addQuestions.bind(mentorLessonController));
router.get("/lesson/questions/:lessonId",verifyMentor, mentorLessonController.getQuestions.bind(mentorLessonController));
router.patch("/lesson/edit/question/:questionId", verifyMentor, mentorLessonController.editQuestions.bind(mentorLessonController));
router.get("/course/students/:courseId", verifyMentor, mentorStudentsController.getStudentDetilesController.bind(mentorStudentsController));
router.get("/comments/:lessonId",verifyMentor,mentorLessonController.getComments.bind(mentorLessonController))
router.patch("/student/block", verifyMentor, mentorStudentsController.blockStudentController.bind(mentorStudentsController));
router.post("/genarate/options",verifyMentor,mentorLessonController.genarateOptions.bind(mentorLessonController))
router.post(
  "/raise/concern",verifyMentor,
  uploadConcernFiles.array("attachments", 5), 
  _mentorConcernControler.addConcern.bind(_mentorConcernControler)
);
router.get("/concerns", verifyMentor, _mentorConcernControler.getConcern.bind(_mentorConcernControler))
router.get("/pagenated/courses",verifyMentor,mentorController.coursePagenated.bind(mentorController))
export default router;