export interface IUserFilterParams {
    isActive?: boolean;
    role?: string;
    createdAt?: {
      $gte?: Date;
      $lte?: Date;
    };
  }