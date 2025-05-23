

// src/core/di/types.ts
export const TYPES = {
 
  MentorAuthController: Symbol.for('MentorAuthController'),
  MentorController: Symbol.for('MentorController'),
  AdminMentorController: Symbol.for('AdminMentorController'),
  AdminUserController: Symbol.for('AdminUserController'),
  AdminAuthController: Symbol.for('AdminAuthController'),
  AuthController: Symbol.for('AuthController'),
  ProfileController: Symbol.for('ProfileController'),
  UserController: Symbol.for("UserController"),  
  MentorProfileController: Symbol.for("MentroProfileController"),
  AdminCourseController: Symbol.for("AdminCourseController"),
  MentorStreamController: Symbol.for("MentorStreamController"),
  UserCourseController: Symbol.for("UserCourseController"),
  UserLiveCOntroller:Symbol.for("UserLiveController"),
  // Services
  MentorAuthService: Symbol.for('MentorAuthService'),
  MentorService: Symbol.for('MentorService'),
  AdminMentorService: Symbol.for('AdminMentorService'),
  AdminUsersService: Symbol.for('AdminUsersService'),
  AdminAuthService: Symbol.for('AdminAuthService'),
  AuthService: Symbol.for('AuthService'),
  ProfileService: Symbol.for('ProfileService'),
  UserService: Symbol.for('UserService'),
  MentorProfileService: Symbol.for("MentorProfileService"),
  AdminCourseService: Symbol.for("AdminCourseService"),
  MentorStreamService: Symbol.for("MentorStreamServices"),
  UserCourseService: Symbol.for("UserCourseService"),
  UserLiveService:Symbol.for("UserLiveService"),
  // Repositories
  MentorRepository: Symbol.for('MentorRepository'),
  MentorOtpRepository: Symbol.for('MentorOtpRepository'),
  AdminMentorRepository: Symbol.for('AdminMentorRepository'),
  AdminUsersRepository: Symbol.for('AdminUsersRepository'),
  UserRepository: Symbol.for('UserRepository'),
  OtpRepository: Symbol.for('OtpRepository'),
  AdminCourseRepository: Symbol.for("AdminCourseRepository"),
  AdminCategoriesRepository: Symbol.for("AdminCategoriesRepository"),
  MentorCourseRepository: Symbol.for("MentorCourseRepository"),
  CourseRepository: Symbol.for("CourseRepository"),
  LiveRepository: Symbol.for("LiveRespository"),
  SessionRepository: Symbol.for("SessionRepository"),
  LessonsRepository:Symbol.for("LessonRepository")
  
};