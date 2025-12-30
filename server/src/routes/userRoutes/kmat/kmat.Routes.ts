import { Router } from 'express';
import { LearnController } from '../../../controllers/user/kmat/learn.controller';
import { ExamController } from '../../../controllers/user/kmat/exam.controller';
// import { userAuthMiddleware } from '../../../middlewares/userAuth.middleware'; 

const kmatRouter = Router();
const learnController = new LearnController();
const examController = new ExamController();

// Learn Routes
kmatRouter.post('/learn', learnController.getLearnContent.bind(learnController));
kmatRouter.post('/practice', learnController.generatePracticeQuestions.bind(learnController));

// Exam Routes
// kmatRouter.use(authMiddleware); // Uncomment if auth middleware logic is confirmed
kmatRouter.post('/exam/start', (req, res) => { examController.startExam(req, res); });
kmatRouter.post('/exam/check-answer', (req, res) => { examController.checkAnswer(req, res); });
kmatRouter.post('/exam/submit', (req, res) => { examController.submitExam(req, res); });
kmatRouter.get('/result/:id', (req, res) => { examController.getResult(req, res); });

export default kmatRouter;
