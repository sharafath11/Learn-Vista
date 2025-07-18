
import { useState } from 'react';
import { AdminAPIMethods } from '../services/APImethods';
import { showInfoToast } from '../utils/Toast';
import { IUser } from '../types/userTypes';

type PaginationState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  filters: Record<string, unknown>;
  sort: Record<string, 1 | -1>;
};

type FetchUsersParams = Partial<Pick<PaginationState, 'page' | 'limit' | 'search' | 'filters' | 'sort'>>;

type UseUserPaginationReturn = {
  users: IUser[];
  pagination: PaginationState;
  loading: boolean;
  fetchUsers: (params: FetchUsersParams) => Promise<void>;
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
};

export const useUserPagination = (): UseUserPaginationReturn => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    search: '',
    filters: {},
    sort: { createdAt: -1 }
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async (params: FetchUsersParams = {}): Promise<void> => {
    try {
      setLoading(true);
      
     
      const queryParams = {
        page: params.page ?? pagination.page,
        limit: params.limit ?? pagination.limit,
        search: params.search ?? pagination.search,
        filters: params.filters ?? pagination.filters,
        sort: params.sort ?? pagination.sort
      };
      const res = await AdminAPIMethods.fetchUsers(queryParams);
      if (res.ok) {
        setUsers(res.data.data);
        setPagination(prev => ({
          ...prev,
          ...queryParams,
          total: res.data.total,
          totalPages: res.data.totalPages,
        }));
      } else {
        throw new Error(res.msg || 'Failed to fetch users');
      }
    } catch (error: unknown) {
      console.error("Failed to fetch users:", error);
      showInfoToast(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    pagination,
    loading,
    fetchUsers,
    setUsers
  };
};