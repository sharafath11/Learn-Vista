
export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface IReson {
  courseId: string;
  message: string;
}

export interface IRes {
  data: any;
  msg: string;
  ok: boolean;
}




export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export type AllStatusFilter ='All'|'Active' | 'Blocked' |'Approved' | 'Pending' | 'Rejected';
