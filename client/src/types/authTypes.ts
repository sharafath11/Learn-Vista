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
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  profilePicture?: string | null;
  isBlocked: boolean;
  isVerified: boolean;
  enrolledCourses?: string[]; 
  createdAt?: string;
  updatedAt?: string;
}



export interface UserContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export interface UserProviderProps {
  children: React.ReactNode;
}