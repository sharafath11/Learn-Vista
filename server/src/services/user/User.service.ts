import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { ISafeUser } from "../../types/userTypes";
export class UserService {
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
}