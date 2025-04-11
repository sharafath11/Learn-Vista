export const TYPES = {
  // Controllers
  MentorAuthController: Symbol.for('MentorAuthController'),
  MentorController: Symbol.for('MentorController'),
  AdminMentorController: Symbol.for('AdminMentorController'),
  AdminUserController: Symbol.for('AdminUserController'), // Singular "User"
  AdminAuthController: Symbol.for('AdminAuthController'),
  
  // Services
  MentorAuthService: Symbol.for('MentorAuthService'),
  MentorService: Symbol.for('MentorService'),
  AdminMentorService: Symbol.for('AdminMentorService'),
  AdminUsersService: Symbol.for('AdminUsersService'), // Plural "Users" for service
  AdminAuthService: Symbol.for('AdminAuthService'),
  
  // Repositories
  MentorRepository: Symbol.for('MentorRepository'),
  MentorOtpRepository: Symbol.for('MentorOtpRepository'),
  AdminMentorRepository: Symbol.for('AdminMentorRepository'),
  AdminUsersRepository: Symbol.for('AdminUsersRepository') // Plural "Users" for repository
};