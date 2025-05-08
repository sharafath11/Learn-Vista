import { useState } from 'react';
import { AdminAPIMethods } from '../services/APImethods';
import { showInfoToast } from '../utils/Toast';
import { IMentor } from '../types/mentorTypes';

type PaginationState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  filters: Record<string, unknown>;
  sort: Record<string, 1 | -1>;
};

type FetchMentorsParams = Partial<Pick<PaginationState, 'page' | 'limit' | 'search' | 'filters' | 'sort'>>;

type UseMentorPaginationReturn = {
  mentors: IMentor[];
  pagination: PaginationState;
  loading: boolean;
  fetchMentors: (params?: FetchMentorsParams) => Promise<void>;
  setMentors: React.Dispatch<React.SetStateAction<IMentor[]>>;
};

export const useMentorPagination = (): UseMentorPaginationReturn => {
  const [mentors, setMentors] = useState<IMentor[]>([]);
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

  const fetchMentors = async (params: FetchMentorsParams = {}): Promise<void> => {
    try {
      setLoading(true);

      const queryParams = {
        page: params.page ?? pagination.page,
        limit: params.limit ?? pagination.limit,
        search: params.search ?? pagination.search,
        filters: params.filters ?? pagination.filters,
        sort: params.sort ?? pagination.sort
      };

      const res = await AdminAPIMethods.fetchMentor(queryParams);

      if (res.ok) {
        setMentors(res.data.data);
        setPagination(prev => ({
          ...prev,
          ...queryParams,
          total: res.data.total,
          totalPages: res.data.totalPages,
        }));
      } else {
        throw new Error(res.msg || 'Failed to fetch mentors');
      }
    } catch (error: unknown) {
      console.error("Failed to fetch mentors:", error);
      showInfoToast(error instanceof Error ? error.message : 'Failed to fetch mentors');
    } finally {
      setLoading(false);
    }
  };

  return {
    mentors,
    pagination,
    loading,
    fetchMentors,
    setMentors
  };
};
