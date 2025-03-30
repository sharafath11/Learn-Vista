export type UserRole = "user" | "mentor";

export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  isVerified: boolean;
  otp?: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser {
  _id?: string; // Simplified to just string type
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isBlocked?: boolean;
  isVerified: boolean;
  createdAt?: Date | string; // Can handle both Date object or ISO string
  updatedAt?: Date | string;
  enrolledCourses?: string[]; // Simplified to string array
}

export interface UserContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export interface UserProviderProps {
  children: React.ReactNode;
}