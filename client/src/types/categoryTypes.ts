export interface ICategory {
    id: string;
    _id?: string;
    title: string;
    description: string;
    isBlock: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }