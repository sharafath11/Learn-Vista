import bcrypt from "bcryptjs";
import userRepository from "../repositories/userRepository";
import { IUser } from "../types/userTypes";

class AuthService {
  async registerUser(userData: IUser): Promise<IUser> {
    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    userData.password = await bcrypt.hash(userData.password, 10);
    return await userRepository.createUser(userData);
  }
   async loginUser(email: string, password: string) {
       const existingUser = await userRepository.findUserByEmail(email);
       if (!existingUser) {
        throw new Error("User not found");
       }
       console.log("user found")
  }
}

export default new AuthService();
