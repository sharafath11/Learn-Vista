"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { showErrorToast, showInfoToast } from "../utils/Toast";
import { AdminContextType, ICategoryFilters } from "../types/adminTypes";
import { IMentor, MentorFilters } from "../types/mentorTypes";
import { IAdminCourseFilters, IPopulatedCourse } from "../types/courseTypes";
import { ICategory } from "../types/categoryTypes";
import { useUserPagination } from "../hooks/useUserPagination";
import { IConcern } from "../types/concernTypes";
import { INotification } from "../types/notificationsTypes";
import { AdminAPIMethods } from "../services/methods/admin.api";
import { SharedAPIMethods } from "../services/methods/shared.api";

export const AdminContext = createContext<AdminContextType | null>(null);

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState(false);
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [avilbleMentors,setAvilbleMentors]=useState<IMentor[]>([])
  const [cat, setCat] = useState<ICategory[]>([]);
  const [categories,setCategories]=useState<ICategory[]>([])
  const [courses, setCourses] = useState<IPopulatedCourse[]>([]);
  const [concern, setConcerns] = useState<IConcern[]>([])
  const [cMentors, setCMentors] = useState<IMentor[]>([])
  const [adminNotifications, setAdminNotifications] = useState<INotification[]>([]);
const [adminUnreadNotification, setAdminUnreadNotification] = useState<number>(0);
  useEffect(() => {
  localStorage.removeItem("role")
  localStorage.setItem("role","admin")
},[])
  const [mentorPagination, setMentorPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [allConcerns,setAllConcerns]=useState<IConcern[]>([])

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
    availvleMentorGet()
    fetchALlCategories()
    fetchConcernsData()
    fetchAdminNotifications()
  },[fetchUsers]);

  async function getCategories(params?: {
    page?: number ;
    limit?: number;
    search?: string;
    sort?: Record<string, 1 | -1>;
    filters?: ICategoryFilters;
  }) {
    const res = await AdminAPIMethods.getGetegories( params|| {limit:2});
    if (res.ok) setCat(res.data.data);
    else showInfoToast(res.msg);
  }
  const fetchAdminNotifications = async () => {
  const res = await SharedAPIMethods.getMyNotifications();
  if (res.ok) {
    setAdminNotifications(res.data);
    const unreadCount = res.data.filter((n: INotification) => !n.isRead).length;
    setAdminUnreadNotification(unreadCount);
  } else {
    showInfoToast(res.msg);
  }
};

  async function getAllMentors(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: Record<string, 1 | -1>;
    filters?: MentorFilters;
  }) {
    const res = await AdminAPIMethods.fetchMentor(params || {limit:2});
    
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
   const fetchALlCategories = async () => {
      const res = await AdminAPIMethods.getAllCategories();
     
      if (res.ok) {
        
        setCategories(res.data)
        return
      }
      showInfoToast(res.msg)
    }
  const availvleMentorGet = async () => {
    const res = await AdminAPIMethods.fetchMentor({});
    if (res.ok) {
       setCMentors(res.data.data)
       const mentor = res.data.data.filter((i: IMentor) => {
        return i.isVerified && !i.isBlock && i.status == "approved"
      });
     setAvilbleMentors(mentor)
    }
  }

  async function getCourse(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: Record<string, 1 | -1>;
    filters?: IAdminCourseFilters;
  }) {
    const res = await AdminAPIMethods.getCourses(params || {});
    if (res.ok) setCourses(res.data.data);
    else showInfoToast(res.msg);
  }

  const getAllUsers = async (params?: {
    page?: number;
    search?: string;
    filters?: Record<string, unknown>;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }) => {
    await fetchUsers(params ?? {});
  };
  const fetchConcernsData = async () => {
    const res = await AdminAPIMethods.getConcern();
    if (res.ok) {
      setConcerns(res.data);
      return
    }
    else showErrorToast(res.msg)
  }

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
        getCategories,
        avilbleMentors,
        categories: categories.filter((ca) => !ca.isBlock),
        concern,
        setConcerns,
        allConcerns,
        setAllConcerns,
        cMentors,
        adminNotifications,
    setAdminNotifications,
    adminUnreadNotification,
        setAdminUnreadNotification,
    refreshAdminNotification:fetchAdminNotifications
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
