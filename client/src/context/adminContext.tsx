"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { AdminAPIMethods } from "../services/APImethods";
import { showInfoToast } from "../utils/Toast";
import { AdminContextType } from "../types/adminTypes";
import { IMentor } from "../types/mentorTypes";
import { IPopulatedCourse } from "../types/courseTypes";
import { ICategory } from "../types/categoryTypes";
import { useUserPagination } from "../hooks/useUserPagination";

export const AdminContext = createContext<AdminContextType | null>(null);

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState(false);
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [cat, setCat] = useState<ICategory[]>([]);
  const [courses, setCourses] = useState<IPopulatedCourse[]>([]);
  const [mentorPagination, setMentorPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const {
    users,
    pagination: usersPagination,
    loading: loadingUsers,
    fetchUsers,
    setUsers,
  } = useUserPagination();

  useEffect(() => {
    getAllMentors();
    getCategories();
    getCourse();
    fetchUsers({});
  }, []);

  async function getCategories() {
    const res = await AdminAPIMethods.getGetegories();
    if (res.ok) setCat(res.data);
    else showInfoToast(res.msg);
  }

  async function getAllMentors(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: Record<string, 1 | -1>;
    filters?: Record<string, any>;
  }) {
    const res = await AdminAPIMethods.fetchMentor(params || {});
    if (res.ok) {
      setMentors(res.data.data);
      setMentorPagination({
        page: res.data.page,
        limit: res.data.limit,
        total: res.data.total,
      });
    } else {
      showInfoToast(res.msg);
    }
  }

  async function getCourse(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: Record<string, 1 | -1>;
    filters?: Record<string, any>;
  }) {
    const res = await AdminAPIMethods.getCourses(params||{});
    if (res.ok) setCourses(res.data);
    else showInfoToast(res.msg);
  }

  const getAllUsers = async (params?: {
    page?: number;
    search?: string;
    filters?: Record<string, unknown>;
    sort?: Record<string, 1 | -1>;
  }) => {
    await fetchUsers(params ?? {});
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
        mentors,
        setMentors,
        refreshMentors: getAllMentors,
        users,
        setUsers,
        cat,
        setCat,
        getAllUsers,
        courses,
        setCourses,
        usersPagination,
        loadingUsers,
        totalUsersCount: usersPagination.total,
        mentorPagination,
        getCourse,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminContext must be used within AdminProvider");
  return context;
};
