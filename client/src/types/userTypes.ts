export type UserRole = 'admin' | 'mentor' | 'user';
export type UserStatus = 'All'|'Active' | 'Blocked';

export interface IUser {
  id: string;
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
  googleId: string;
}

export interface UserContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export interface UserProviderProps {
  children: React.ReactNode;
}

export interface EditProfilePayload {
  username: string;
  image: File | null;
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