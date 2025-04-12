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
// import { AdminMentorService } from '../../services/admin/AdminMentorService';
import { AdminMentorService } from '../../services/admin/adminMentor.service';

// Repositories
import { IMentorRepository } from '../interfaces/repositories/mentor/IMentorRepository';
import { MentorRepository } from '../../repositories/mentor/MentorRepository';
import { IMentorOtpRepository } from '../interfaces/repositories/mentor/IMentorOtpRepository';
import { MentorOtpRepository } from '../../repositories/mentor/otpRepo';
import { IAdminMentorRepository } from '../interfaces/repositories/admin/IAdminMentorRepository';
// import { AdminMentorRepository } from '../../repositories/admin/AdminMentorRepository';
import { AdminMentorRepository } from '../../repositories/admin/AdminMentorRepo';
import AdminMentorController from '../../controllers/admin/AdminMentor.Controller';
import { IAdminUsersRepository } from '../interfaces/repositories/admin/IAdminUsersRepository';
import AdminUsersServices from '../../services/admin/AdminUsers.Service';
import { AdminUsersRepo } from '../../repositories/admin/AdminUsersRepo';
// import { AdminUsersController } from '../../controllers/admin/AdminUser.Controller';
import AdminUserController from '../../controllers/admin/AdminUser.Controller';
import { IUserRepository } from '../interfaces/repositories/user/IUserRepository';
import { AuthController } from '../../controllers/user/auth.controller';
import { UserRepository } from '../../repositories/user/userRepository';
import { OtpRepository } from '../../repositories/user/OtpRepository';
import { IAuthService } from '../interfaces/services/user/IAuthService';
import { AuthService } from '../../services/user/auth.service';
import { ProfileService } from '../../services/user/profile.service';
import { ProfileController } from '../../controllers/user/profile.controller';
// import { AdminMentorController } from "../../controllers/admin/AdminMentor.Controller";
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

container.bind<AdminMentorService>(TYPES.AdminMentorService)
  .to(AdminMentorService)
  .inSingletonScope();

// Bind Repositories
container.bind<IMentorRepository>(TYPES.MentorRepository)
  .to(MentorRepository)
  .inSingletonScope();

container.bind<IMentorOtpRepository>(TYPES.MentorOtpRepository)
  .to(MentorOtpRepository)
  .inSingletonScope();

container.bind<IAdminMentorRepository>(TYPES.AdminMentorRepository)
  .to(AdminMentorRepository)
  .inSingletonScope();
  container.bind<AdminMentorController>(TYPES.AdminMentorController)
  .to(AdminMentorController)
  .inSingletonScope();
  container.bind<IAdminUsersRepository>(TYPES.AdminUsersRepository)
  .to(AdminUsersRepo)
  .inSingletonScope();

container.bind<AdminUsersServices>(TYPES.AdminUsersService)
  .to(AdminUsersServices)
  .inSingletonScope();
  container.bind<AdminUserController>(TYPES.AdminUserController)
  .to(AdminUserController)
  .inSingletonScope();
  container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
  container.bind<typeof OtpRepository>(TYPES.OtpRepository).toConstantValue(OtpRepository);
  container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
  container.bind<ProfileService>(TYPES.ProfileService).to(ProfileService).inSingletonScope();
  container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
  container.bind<ProfileController>(TYPES.ProfileController).to(ProfileController).inSingletonScope();
  
export default container;