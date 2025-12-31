import { Router } from 'express';
import container from '../../../core/di/container';
import { TYPES } from '../../../core/types';
import { IKmatController } from '../../../core/interfaces/controllers/user/IKmat.controller';
// import { userAuthMiddleware } from '../../../middlewares/userAuth.middleware'; 

const kmatRouter = Router();
const kmatController = container.get<IKmatController>(TYPES.KmatController);

kmatRouter.get('/daily-data', kmatController.getDailyData.bind(kmatController));
kmatRouter.post('/exam/start', kmatController.startExam.bind(kmatController));
kmatRouter.post('/exam/submit', kmatController.submitExam.bind(kmatController));
kmatRouter.post('/exam/check-answer', kmatController.checkAnswer.bind(kmatController));
kmatRouter.get('/result', kmatController.getResult.bind(kmatController));
kmatRouter.post('/report', kmatController.generateReport.bind(kmatController));

export default kmatRouter;
