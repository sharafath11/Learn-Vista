import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { ISafeUser } from "../../types/userTypes";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { sendPasswordResetEmail } from "../../utils/emailService";
import { generateAccessToken } from "../../utils/JWTtoken";
import dotenv from "dotenv";

import bcrypt from "bcrypt";
import { throwError } from "../../utils/ResANDError";
dotenv.config();

export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    ) { }

    async getUser(id: string): Promise<ISafeUser> {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
          return throwError("User not found", 404);
        }
        if (user.isBlocked) throwError("User was blocked", 403);
        
        return {
            username: user.username,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture || null,
            isBlocked: user.isBlocked,
            enrolledCourses: user.enrolledCourses || [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    async forgetPassword(email: string): Promise<void> {
        const user = await this.userRepository.findOne({ email });
      
        if (!user) return throwError("User not found", 404);
        if(user.isBlocked) return throwError("This account was blocked",403)
      
        const token = generateAccessToken(user.id, "user");
      
        const resetLink = `${process.env.CLIENT_URL}/user/reset-password/${token}`;
      
        const result = await sendPasswordResetEmail(user.email, resetLink);
      
        if (!result.success) {
            throwError("Failed to send reset email. Try again later.", 500);
        }
    }

    async resetPassword(id: string, password: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) throwError("User not found", 404);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userRepository.update(id, { password: hashedPassword });
    }
}