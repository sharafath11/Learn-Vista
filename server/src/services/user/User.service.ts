import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { ISafeUser } from "../../types/userTypes";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { sendPasswordResetEmail } from "../../utils/emailService";
import { generateAccessToken } from "../../utils/JWTtoken";
import dotenv from "dotenv"
import { throwError } from "../../utils/ResANDError";
import bcrypt from "bcrypt"
dotenv.config()

export class UserService implements IUserService{
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    ) { }

    async getUser(id: string): Promise<ISafeUser> {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isBlocked) throw new Error("User was blocked")
        // console.log("andi")
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
      
        if (!user) throw new Error("User not found");
      
        const token = generateAccessToken(user.id, "user");
      
        const resetLink = `${process.env.CLIENT_URL}/user/reset-password/${token}`;
      
        const result = await sendPasswordResetEmail(user.email, resetLink);
      
        if (!result.success) {
          throw new Error("Failed to send reset email. Try again later.");
        }
    }
    async resetPassword(id: string, password: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) throwError("User not found");
        const hashedPassword = await bcrypt.hash(password, 10)
        await this.userRepository.update(id,{password:hashedPassword})
    }
    
}