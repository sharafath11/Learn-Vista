export type UserRole = "user" | "mentor";

export interface IUserRegistration {
  username: string;
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
  googleId: string,
  
}

export interface IUser {
  id:string
  
  _id: string;
  username: string;
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
export interface MentorApplyFormData {
  username: string;
  email: string;
  phoneNumber: string;
  expertise: string[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

export interface MentorApplyFormErrors {
  name: string;
  email: string;
  phoneNumber: string;
  file: string;
  socialLink:string
}
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends IUser {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}