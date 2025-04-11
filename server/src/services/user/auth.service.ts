import { inject, injectable } from "inversify";
import { IAuthService } from "../../core/interfaces/services/user/IAuthService";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { TYPES } from "../../core/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../../types/userTypes";
import { generateTokens } from "../../utils/generateToken";
import { decodeToken } from "../../utils/tokenDecode";
import { validateUserSignupInput } from "../../utils/userValidation";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.OtpRepository) private otpRepository: typeof OtpRepository
  ) {}

  async registerUser(userData: IUser): Promise<Partial<IUser>> {
    const { username, email, password, role } = userData;
    
    validateUserSignupInput(username, email, password, role);
    const existingUser = await this.userRepository.findByEmail(email);
    const existOtp = await this.otpRepository.findOne({ email });
    
    if(!existOtp) throw new Error("OTP Expired");
    if (existingUser) throw new Error("User already exists");
    
    userData.password = await bcrypt.hash(userData.password, 10);
    return this.userRepository.create(userData);
  }

  async loginUser(email: string, password: string, googleId?: string): Promise<{
    token: string;
    refreshToken: string;
    user: any;
  }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.isBlocked) throw new Error("This account is blocked");
    
    if (googleId && user.googleId === googleId) {
      return generateTokens(user);
    }
    
    if (!user.password) throw new Error("Password not set for this account");
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");
    
    return generateTokens(user);
  }

  async googleAuth(profile: any): Promise<any> {
    let user = await this.userRepository.findByGoogleId(profile.id);
    
    if (!user) {
      user = await this.userRepository.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        profilePicture: profile.photos[0]?.value,
        role: "user",
        googleUser: true,
        isVerified: true
      });
    }
    
    return generateTokens(user);
  }

  // ... (other methods remain similar to previous implementation)
}