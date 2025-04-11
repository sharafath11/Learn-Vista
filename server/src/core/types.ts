export const TYPES = {
  // Controllers
  MentorAuthController: Symbol.for('MentorAuthController'),
  MentorController: Symbol.for('MentorController'),
  AdminMentorController: Symbol.for('AdminMentorController'), // Add this line
  
  // Services
  MentorAuthService: Symbol.for('MentorAuthService'),
  MentorService: Symbol.for('MentorService'),
  AdminMentorService: Symbol.for('AdminMentorService'),
  
  // Repositories
  MentorRepository: Symbol.for('MentorRepository'),
  MentorOtpRepository: Symbol.for('MentorOtpRepository'),
  AdminMentorRepository: Symbol.for('AdminMentorRepository')
};