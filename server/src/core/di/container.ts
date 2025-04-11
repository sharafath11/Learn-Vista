import { Container } from 'inversify';
import { TYPES } from '../types';

// Controllers
import { IMentorAuthController } from '../interfaces/controllers/mentor/IMentorAuth.Controller';
import { MentorAuthController } from '../../controllers/mentor/MentorAuth.Controller';
import { IMentorController } from '../interfaces/controllers/mentor/IMentor.Controller';
import { MentorController } from '../../controllers/mentor/mentor.controller';

// Services
import { IMentorAuthService } from '../interfaces/services/mentor/IMentorAuth.Service';
import { MentorAuthService } from '../../services/mentor/MentorAuth.Service';
import { IMentorService } from '../interfaces/services/mentor/IMentor.Service';
import { MentorService } from '../../services/mentor/Mentor.Service';

// Repositories
import { IMentorRepository } from '../interfaces/repositories/mentor/IMentorRepository';
import { MentorRepository } from '../../repositories/mentor/MentorRepository';
import { IMentorOtpRepository } from '../interfaces/repositories/mentor/IMentorOtpRepository';
import { MentorOtpRepository } from '../../repositories/mentor/otpRepo';

const container = new Container();

// Bind Controllers
container.bind<IMentorAuthController>(TYPES.MentorAuthController)
  .to(MentorAuthController)
  .inSingletonScope();

container.bind<IMentorController>(TYPES.MentorController)
  .to(MentorController)
  .inSingletonScope();

// Bind Services
container.bind<IMentorAuthService>(TYPES.MentorAuthService)
  .to(MentorAuthService)
  .inSingletonScope();

container.bind<IMentorService>(TYPES.MentorService)
  .to(MentorService)
  .inSingletonScope();

// Bind Repositories
container.bind<IMentorRepository>(TYPES.MentorRepository)
  .to(MentorRepository)
  .inSingletonScope();

container.bind<IMentorOtpRepository>(TYPES.MentorOtpRepository)
  .to(MentorOtpRepository)
  .inSingletonScope();

export default container;