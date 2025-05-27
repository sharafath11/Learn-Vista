import express from 'express';
import { TYPES } from '../../core/types';
import { verifyMentor } from '../../middlewares/mentorVerify';
import { IMentorController } from '../../core/interfaces/controllers/mentor/IMentor.Controller';
import { IMentorAuthController } from '../../core/interfaces/controllers/mentor/IMentorAuth.Controller';
import container from '../../core/di/container';
import { IMentorProfileController } from '../../core/interfaces/controllers/mentor/IMentorProfile.controller';
import upload, { uploadImage } from '../../middlewares/upload';
import {  IMentorStreamController } from '../../core/interfaces/controllers/mentor/IMentorStream.controller';
import { IMentorLessonsController } from '../../core/interfaces/controllers/mentor/IMentorLesson.Controller';
const router = express.Router();
const mentorAuthController = container.get<IMentorAuthController>(TYPES.MentorAuthController);
const mentorController = container.get<IMentorController>(TYPES.MentorController);
const mentorProfileController = container.get<IMentorProfileController>(TYPES.MentorProfileController)
const mentorLessonController=container.get<IMentorLessonsController>(TYPES.MentorLessonsController)
const mentorStreamController=container.get<IMentorStreamController>(TYPES.MentorStreamController)
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
router.post("/add-lessons", verifyMentor, mentorLessonController.addLesson.bind(mentorLessonController));
router.patch("/edit/lessons", verifyMentor, mentorLessonController.editLesson.bind(mentorLessonController));
router.post("/delete-s3-file", verifyMentor, mentorLessonController.deleteS3File.bind(mentorLessonController));
// router.post("/uploadfiles-to-s3", verifyMentor, mentorLessonController.uploadToS3.bind(mentorLessonController));

export default router;