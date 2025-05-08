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