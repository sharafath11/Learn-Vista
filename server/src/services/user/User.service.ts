import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { ISafeUser } from "../../types/userTypes";
import { decodeToken } from "../../utils/tokenDecode";

export class UserService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    ) { }

    async getUser(token: string): Promise<ISafeUser> {
        const userDetiels=decodeToken(token)
        const user = await this.userRepository.findById(userDetiels.id);
        
        if (!user) {
            throw new Error("User not found");
        }
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