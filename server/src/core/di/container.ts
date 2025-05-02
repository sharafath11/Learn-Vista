import { Container } from 'inversify';
import { TYPES } from '../types';

// Controllers
import { IMentorAuthController } from '../interfaces/controllers/mentor/IMentorAuth.Controller';
import { MentorAuthController } from '../../controllers/mentor/MentorAuth.Controller';
import { IMentorController } from '../interfaces/controllers/mentor/IMentor.Controller';
import { MentorController } from '../../controllers/mentor/mentor.controller';
import { IAdminUserController } from '../interfaces/controllers/admin/IAdminUser.controller';
import AdminUserController from '../../controllers/admin/AdminUser.Controller';
import AdminMentorController from '../../controllers/admin/AdminMentor.Controller';
import { IUserController } from '../interfaces/controllers/user/IUserController';
import { UserController } from '../../controllers/user/user.controller';
import { AuthController } from '../../controllers/user/auth.controller';
import { ProfileController } from '../../controllers/user/profile.controller';

// Services
import { IMentorAuthService } from '../interfaces/services/mentor/IMentorAuth.Service';
import { MentorAuthService } from '../../services/mentor/MentorAuth.Service';
import { IMentorService } from '../interfaces/services/mentor/IMentor.Service';
import { MentorService } from '../../services/mentor/Mentor.Service';
import { IAdminUserServices } from '../interfaces/services/admin/IAdminUserServices';
import AdminUsersServices from '../../services/admin/AdminUsers.Service';
import { IUserService } from '../interfaces/services/user/IUserService';
import { UserService } from '../../services/user/User.service';
import { IAuthService } from '../interfaces/services/user/IAuthService';
import { AuthService } from '../../services/user/auth.service';
import { ProfileService } from '../../services/user/profile.service';
import { AdminMentorService } from '../../services/admin/adminMentor.service';

// Repositories
import { IMentorRepository } from '../interfaces/repositories/mentor/IMentorRepository';
import { MentorRepository } from '../../repositories/mentor/MentorRepository';
import { IMentorOtpRepository } from '../interfaces/repositories/mentor/IMentorOtpRepository';
import { MentorOtpRepository } from '../../repositories/mentor/otpRepo';
import { IAdminMentorRepository } from '../interfaces/repositories/admin/IAdminMentorRepository';
import { AdminMentorRepository } from '../../repositories/admin/AdminMentorRepo';
import { IAdminUsersRepository } from '../interfaces/repositories/admin/IAdminUsersRepository';
import { AdminUsersRepo } from '../../repositories/admin/AdminUsersRepo';
import { IUserRepository } from '../interfaces/repositories/user/IUserRepository';
import { UserRepository } from '../../repositories/user/userRepository';
import { IOtpRepository } from '../interfaces/repositories/user/IOtpRepository';
import { OtpRepository } from '../../repositories/user/OtpRepository';
import { IAdminAuthController } from '../interfaces/controllers/admin/IAdminAuth.Controller';
import AdminAuthController from '../../controllers/admin/AdminAuth.Controller';
import { IProfileController } from '../interfaces/controllers/user/IProfileController';
import { IAdminAuthService } from '../interfaces/services/admin/IAdminAuthService';
import AdminAuthService from '../../services/admin/auth.service';
import { IAdminMentorController } from '../interfaces/controllers/admin/IAdminMentor.Controller';
import { IProfileService } from '../interfaces/services/user/IUserProfileService';
import { IMentorProfileController } from '../interfaces/controllers/mentor/IMentorProfile.controller';

import { IMentorProfileService } from '../interfaces/services/mentor/IMentorProfile.Service';
import { MentorProfileController } from '../../controllers/mentor/mentorProfile.controller';
import { MentorProfileService } from '../../services/mentor/MentorProfile.Service';
import AdminCourseController from '../../controllers/admin/AdminCategoryCourse.Controller';
import { IAdminCourseController } from '../interfaces/controllers/admin/IAdminCourse.Controller';
import { IAdminCourseServices } from '../interfaces/services/admin/IAdminCourseService';
import AdminCourseServices from '../../services/admin/AdminCategoryCourse.Service';
import { IAdminCourserRepository } from '../interfaces/repositories/admin/IAdminCourseRepository';
import { IAdminCategoriesRepostory } from '../interfaces/repositories/admin/IAdminCategoryRepository';
import { AdminCourseRepository } from '../../repositories/admin/AdminCourseRepo';
import { AdminCategoriesRepo } from '../../repositories/admin/AdminCategoriesRepo';

const container = new Container();

// Controller Bindings
container.bind<IMentorAuthController>(TYPES.MentorAuthController).to(MentorAuthController);
container.bind<IMentorController>(TYPES.MentorController).to(MentorController);
container.bind<IUserController>(TYPES.UserController).to(UserController);
container.bind<IAdminUserController>(TYPES.AdminUserController).to(AdminUserController);
container.bind<IAdminMentorController>(TYPES.AdminMentorController).to(AdminMentorController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<IProfileController>(TYPES.ProfileController).to(ProfileController);
container.bind<IAdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController),
container.bind<IMentorProfileController>(TYPES.MentorProfileController).to(MentorProfileController)
container.bind<IAdminCourseController>(TYPES.AdminCourseController).to(AdminCourseController)
// Service Bindings
container.bind<IMentorAuthService>(TYPES.MentorAuthService).to(MentorAuthService);
container.bind<IMentorService>(TYPES.MentorService).to(MentorService);
container.bind<IAdminUserServices>(TYPES.AdminUsersService).to(AdminUsersServices);
container.bind<AdminMentorService>(TYPES.AdminMentorService).to(AdminMentorService);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IProfileService>(TYPES.ProfileService).to(ProfileService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService)
container.bind<IMentorProfileService>(TYPES.MentorProfileService).to(MentorProfileService)
container.bind<IAdminCourseServices>(TYPES.AdminCourseService).to(AdminCourseServices);
// Repository Bindings
container.bind<IMentorRepository>(TYPES.MentorRepository).to(MentorRepository);
container.bind<IMentorOtpRepository>(TYPES.MentorOtpRepository).to(MentorOtpRepository);
container.bind<IAdminMentorRepository>(TYPES.AdminMentorRepository).to(AdminMentorRepository);
container.bind<IAdminUsersRepository>(TYPES.AdminUsersRepository).to(AdminUsersRepo);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<IAdminCourserRepository>(TYPES.AdminCourseRepository);
// Services


// Repositories
container.bind<IAdminCourserRepository>(TYPES.AdminCourseRepository).to(AdminCourseRepository);
container.bind<IAdminCategoriesRepostory>(TYPES.AdminCategoriesRepository).to(AdminCategoriesRepo);


export default container;
