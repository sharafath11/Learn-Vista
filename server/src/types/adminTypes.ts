export interface IUserFilterParams {
    isActive?: boolean;
    role?: string;
    createdAt?: {
      $gte?: Date;
      $lte?: Date;
    };
}
export interface IMentorFilterParams {
  status?: 'pending' |'approved'| 'rejected';
    role?: string;
    createdAt?: {
      $gte?: Date;
      $lte?: Date;
    };
}

type Role = "admin" | "user" | "mentor";

export interface IDecodedToken {
  id: string;
  role: Role;
}
