

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
  // Services
  MentorAuthService: Symbol.for('MentorAuthService'),
  MentorService: Symbol.for('MentorService'),
  AdminMentorService: Symbol.for('AdminMentorService'),
  AdminUsersService: Symbol.for('AdminUsersService'),
  AdminAuthService: Symbol.for('AdminAuthService'),
  AuthService: Symbol.for('AuthService'),
  ProfileService: Symbol.for('ProfileService'),
  UserService:Symbol.for('UserService'),
  
  // Repositories
  MentorRepository: Symbol.for('MentorRepository'),
  MentorOtpRepository: Symbol.for('MentorOtpRepository'),
  AdminMentorRepository: Symbol.for('AdminMentorRepository'),
  AdminUsersRepository: Symbol.for('AdminUsersRepository'),
  UserRepository: Symbol.for('UserRepository'),
  OtpRepository: Symbol.for('OtpRepository'),
  
  
};