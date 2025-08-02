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
import AdminCourseController from '../../controllers/admin/AdminCourse.Controller';
import { IAdminCourseController } from '../interfaces/controllers/admin/IAdminCourse.Controller';
import { IAdminCourseServices } from '../interfaces/services/admin/IAdminCourseService';
import AdminCourseServices from '../../services/admin/AdminCourse.Service';
import { ICourseRepository } from '../interfaces/repositories/course/ICourseRepository';
import { CourseRepository } from '../../repositories/course/CourseRepository';
import { ILiveRepository } from '../interfaces/repositories/course/ILiveRepository';
import { LiveRepository } from '../../repositories/course/LiveRepository';
import { ISessionRepository } from '../interfaces/repositories/course/ISessionRepository';
import { SessionRepository } from '../../repositories/course/SessionRepository';
import { MentorStreamController } from '../../controllers/mentor/MentorStream.controller';
import { IUserCourseController } from '../interfaces/controllers/user/IUserCourseController';
import { UserCourseController } from '../../controllers/user/userCourse.controller';
import { IUserCourseService } from '../interfaces/services/user/IUserCourseController';
import { UserCourseService } from '../../services/user/UserCourse.service';
import { IUserLiveController } from '../interfaces/controllers/user/IUserLiveVideoController';
import { UserLiveCallController } from '../../controllers/user/liveVideo.Controller';
import { IUserLiveService } from '../interfaces/services/user/IUserLiveService';
import { LiveUserService } from '../../services/user/LiveUser.Service';
import { IMentorStreamService } from '../interfaces/services/mentor/ImentorStream.service';
import { MentorStreamService } from '../../services/mentor/mentorStream.service';
import { IMentorStreamController } from '../interfaces/controllers/mentor/IMentorStream.controller';
import { LessonsRepository } from '../../repositories/lesson/lessonsRepository';
import { ILessonsRepository } from '../interfaces/repositories/lessons/ILessonRepository';
import { IMentorLessonService } from '../interfaces/services/mentor/IMentorLesson.Service';
import { MentorLessonService } from '../../services/mentor/MentorLesson.Service';
import { IMentorLessonsController } from '../interfaces/controllers/mentor/IMentorLesson.Controller';
import { MentorLessonsController } from '../../controllers/mentor/MentorLessons.Controller';
import { IQuestionsRepository } from '../interfaces/repositories/lessons/IQuestionsRepository';
import { QuestionsRepository } from '../../repositories/lesson/qustionRepository';
import { IUserLessonsController } from '../interfaces/controllers/user/IUserLessonsContoller';
import { UserLessonsController } from '../../controllers/user/userLessons.controller';
import { IUserLessonsService } from '../interfaces/services/user/IUserLessonsService';
import { UserLessonsService } from '../../services/user/Lessons.Service';
import { ILessonReportRepository } from '../interfaces/repositories/lessons/ILessonReportRepository';
import { LessonReportRepository } from '../../repositories/lesson/lessonReportRepository';
import { ICommentstRepository } from '../interfaces/repositories/lessons/ICommentsRepository';
import { CommentsRepository } from '../../repositories/lesson/commentRepository';
import { IMentorStudentsController } from '../interfaces/controllers/mentor/ImentorStudent.controller';
import { MentorStudentsController } from '../../controllers/mentor/mentorStudents.controller';
import { IMentorStudentService } from '../interfaces/services/mentor/IMentorStudent.Service';
import { MentorStudentService } from '../../services/mentor/MentorStudent.Service';
import { ICategoriesRepository } from '../interfaces/repositories/course/ICategoriesRepository';
import { CategoriesRepository } from '../../repositories/course/categorieRepository';
import { IConcernRepository } from '../interfaces/repositories/concern/IConcernRepository';
import { ConcernRepository } from '../../repositories/course/concernRepository';
import { IMentorConcernController } from '../interfaces/controllers/mentor/IMentorConcern.Controller';
import { MentorConcernController } from '../../controllers/mentor/mentorConcern.controller';
import { IMentorConcernService } from '../interfaces/services/mentor/IMentorConcern.Service';
import { MentorConcernService } from '../../services/mentor/mentorConcern.Service';
import { IUserDonationController } from '../interfaces/controllers/user/IUserDonationController';
import { UserDonationController } from '../../controllers/user/UserDonation.Controller';
import { IUserDonationServices } from '../interfaces/services/user/IUserDonationServices';
import { UserDonationServices } from '../../services/user/UserDonation.service';
import { IDonationRepoitory } from '../interfaces/repositories/donation/IDonationRepoitory';
import { DonationRepoitory } from '../../repositories/user/DonationRepository';
import { IAdminDonationServices } from '../interfaces/services/admin/IAdminDonationService';
import { AdminDonationService } from '../../services/admin/AdminDonation.Service';
import { IAdminDonationController } from '../interfaces/controllers/admin/IAdminDonation.Controller';
import { AdminDonationController } from '../../controllers/admin/AdminDonation.Controller';
import { IUserCourseProgressRepository } from '../interfaces/repositories/user/IUserCourseProgressRepository';
import { UserCourseProgressRepository } from '../../repositories/user/UserCourseProgressRepository';
import { INotificationRepository } from '../interfaces/repositories/notifications/INotificationsRepository';
import { NotificationRepository } from '../../repositories/notifications/NotificationsRepository';
import { INotificationService } from '../interfaces/services/notifications/INotificationService';
import { NotificationService } from '../../services/notifications/notifications.Service';
import { INotificationController } from '../interfaces/controllers/notifications/INotifications.Controller';
import { NotificationController } from '../../controllers/notifications/notifications.Controller';
import { IMentorCommentsController } from '../interfaces/controllers/mentor/IMentorComments.controller';
import { MentorCommentController } from '../../controllers/mentor/MentorCOmments.controller';
import { IMentorCommentsService } from '../interfaces/services/mentor/IMentorComments.Service';
import { MentorCommentsService } from '../../services/mentor/MentorComments.Service';
import { IUserLessonProgressRepository } from '../interfaces/repositories/course/IUserLessonProgressRepo';
import { UserLessonProgresssRepository } from '../../repositories/course/LessonProgressRepository';
import { ICertificateRepository } from '../interfaces/repositories/course/ICertificateRepository';
import { CertificateRepository } from '../../repositories/course/CertificateRepository';
import { IUserCertificateService } from '../interfaces/services/user/IUserCertificateService';
import { UserCertificateService } from '../../services/user/userCertificate.service';
import { IUserCertificateController } from '../interfaces/controllers/user/IUserCertificateController';
import { UserCertificateController } from '../../controllers/user/userCertificate.controller';
import { ISharedController } from '../interfaces/controllers/shared/ISharedController';
import { SharedController } from '../../controllers/shared/Shared.Controller';
import { IMentorCourseService } from '../interfaces/services/mentor/IMentorCourse.Service';
import { MentorCourseService } from '../../services/mentor/MentorCourse.service';
import { IMentorCourseController } from '../interfaces/controllers/mentor/IMentorCourse.controller';
import { MentorCourseController } from '../../controllers/mentor/MentorCourse.Controller';
import { IAdminCategoryController } from '../interfaces/controllers/admin/IAdminCategory.Controller';
import AdminCategoryController from '../../controllers/admin/AdminCategory.Controller';
import { IAdminConcernController } from '../interfaces/controllers/admin/IAdminConcern.Controller';
import AdminConcernController from '../../controllers/admin/AdminConcern.Controller';
import { IAdminCategoryService } from '../interfaces/services/admin/IAdminCategoryService';
import { IAdminConcernService } from '../interfaces/services/admin/IAdminConcernService';
import { AdminCategoryService } from '../../services/admin/AdminCategory.Service';
import { AdminConcernService } from '../../services/admin/AdminConcern.Service';

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
container.bind<IMentorStreamController>(TYPES.MentorStreamController).to(MentorStreamController)
container.bind<IUserCourseController>(TYPES.UserCourseController).to(UserCourseController);
container.bind<IUserLiveController>(TYPES.UserLiveCOntroller).to(UserLiveCallController);
container.bind<IMentorLessonsController>(TYPES.MentorLessonsController).to(MentorLessonsController)
container.bind<IUserLessonsController>(TYPES.UserLessonsController).to(UserLessonsController)
container.bind<IMentorStudentsController>(TYPES.MentorStudentsController).to(MentorStudentsController);
container.bind<IMentorConcernController>(TYPES.mentorConcernController).to(MentorConcernController),
container.bind<IUserDonationController>(TYPES.UserDonationController).to(UserDonationController),
container.bind<IAdminDonationController>(TYPES.AdminDonationCOntroller).to(AdminDonationController),
container.bind<INotificationController>(TYPES.NotificationController).to(NotificationController),
container.bind<IMentorCommentsController>(TYPES.MentorCommentController).to(MentorCommentController),    
container.bind<IUserCertificateController>(TYPES.UserCertificateController).to(UserCertificateController)   
container.bind<ISharedController>(TYPES.SharedController).to(SharedController) 
container.bind<IMentorCourseController>(TYPES.MentorCourseController).to(MentorCourseController),
container.bind<IAdminCategoryController>(TYPES.AdminCategoryController).to(AdminCategoryController)
container.bind<IAdminConcernController>(TYPES.AdminConcernController).to(AdminConcernController)
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
container.bind<IMentorStreamService>(TYPES.MentorStreamService).to(MentorStreamService);
container.bind<IUserCourseService>(TYPES.UserCourseService).to(UserCourseService),
container.bind<IUserLiveService>(TYPES.UserLiveService).to(LiveUserService)
container.bind<IMentorLessonService>(TYPES.MentorLessonsService).to(MentorLessonService),
container.bind<IUserLessonsService>(TYPES.UserLessonsService).to(UserLessonsService)
container.bind<IMentorStudentService>(TYPES.MentorStudentsService).to(MentorStudentService);
container.bind<IMentorConcernService>(TYPES.mentorConcernService).to(MentorConcernService);
container.bind<IUserDonationServices>(TYPES.UserDonationServices).to(UserDonationServices)
container.bind<IAdminDonationServices>(TYPES.AdminDonationService).to(AdminDonationService);
container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService),
container.bind<IMentorCommentsService>(TYPES.MentorCommentsService).to(MentorCommentsService),
container.bind<IUserCertificateService>(TYPES.UserCertificateService).to(UserCertificateService),   
container.bind<IMentorCourseService>(TYPES.MentorCourseService).to(MentorCourseService),
container.bind<IAdminCategoryService>(TYPES.AdminCategoryService).to(AdminCategoryService);
container.bind<IAdminConcernService>(TYPES.AdminConcernService).to(AdminConcernService);
    
// Repository Bindings
container.bind<IMentorRepository>(TYPES.MentorRepository).to(MentorRepository);
container.bind<IMentorOtpRepository>(TYPES.MentorOtpRepository).to(MentorOtpRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<ICourseRepository>(TYPES.CourseRepository).to(CourseRepository)
container.bind<ILiveRepository>(TYPES.LiveRepository).to(LiveRepository);
container.bind<ISessionRepository>(TYPES.SessionRepository).to(SessionRepository);
container.bind<ILessonsRepository>(TYPES.LessonsRepository).to(LessonsRepository)
container.bind<IQuestionsRepository>(TYPES.QuestionsRepository).to(QuestionsRepository);
container.bind<ILessonReportRepository>(TYPES.LessonReportRepository).to(LessonReportRepository);
container.bind<ICommentstRepository>(TYPES.CommentsRepository).to(CommentsRepository);
container.bind<ICategoriesRepository>(TYPES.CategoriesRepository).to(CategoriesRepository)
container.bind<IConcernRepository>(TYPES.ConcernRepository).to(ConcernRepository)
container.bind<IDonationRepoitory>(TYPES.DonationRepository).to(DonationRepoitory)
container.bind<IUserCourseProgressRepository>(TYPES.UserCourseProgressRepository).to(UserCourseProgressRepository)
container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
container.bind<IUserLessonProgressRepository>(TYPES.UserLessonProgressRepository).to(UserLessonProgresssRepository)
container.bind<ICertificateRepository>(TYPES.CertificateRepository).to(CertificateRepository)

export default container;
