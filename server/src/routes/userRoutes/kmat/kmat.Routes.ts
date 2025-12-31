import { Router } from 'express';
import container from '../../../core/di/container';
import { TYPES } from '../../../core/types';
import { IKmatController } from '../../../core/interfaces/controllers/user/IKmat.controller';
import { authenticateToken } from '../../../middlewares/authenticateToken';

const kmatRouter = Router();
const kmatController = container.get<IKmatController>(TYPES.KmatController);

kmatRouter.use(authenticateToken);

kmatRouter.get('/daily-data', kmatController.getDailyData.bind(kmatController));
kmatRouter.post('/exam/start', kmatController.startExam.bind(kmatController));
kmatRouter.post('/exam/submit', kmatController.submitExam.bind(kmatController));
kmatRouter.get('/result/:id', kmatController.getResult.bind(kmatController));
kmatRouter.post('/report', kmatController.generateReport.bind(kmatController));
kmatRouter.get('/history', kmatController.getHistory.bind(kmatController));
kmatRouter.post('/practice/submit', kmatController.submitPractice.bind(kmatController));

export default kmatRouter;
