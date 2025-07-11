"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { AdminAPIMethods, NotificationAPIMethods } from "../services/APImethods";
import { showErrorToast, showInfoToast } from "../utils/Toast";
import { AdminContextType } from "../types/adminTypes";
import { IMentor } from "../types/mentorTypes";
import { IPopulatedCourse } from "../types/courseTypes";
import { ICategory } from "../types/categoryTypes";
import { useUserPagination } from "../hooks/useUserPagination";
import { IConcern } from "../types/concernTypes";
import { INotification } from "../types/notificationsTypes";

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
  }, []);

  async function getCategories(params?: {
    page?: number ;
    limit?: number;
    search?: string;
    sort?: Record<string, 1 | -1>;
    filters?: Record<string, any>;
  }) {
    const res = await AdminAPIMethods.getGetegories( params|| {});
    console.log("categ",res)
    if (res.ok) setCat(res.data.data);
    else showInfoToast(res.msg);
  }
  const fetchAdminNotifications = async () => {
  const res = await NotificationAPIMethods.getMyNotifications();
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
    filters?: Record<string, any>;
  }) {
    const res = await AdminAPIMethods.fetchMentor(params || {});
    console.log("angi inki ponki", res)
    
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
    console.log("acdgreghregre",res)
    if (res.ok) {
       setCMentors(res.data.data)
       const mentor = res.data.data.filter((i: IMentor) => {
        console.log("abcd",i)
        return i.isVerified && !i.isBlock && i.status == "approved"
      });
      console.log("adfff",mentor)
     setAvilbleMentors(mentor)
    }
  }

  async function getCourse(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: Record<string, 1 | -1>;
    filters?: Record<string, any>;
  }) {
    const res = await AdminAPIMethods.getCourses(params || {});
    console.log("course",res)
    if (res.ok) setCourses(res.data.data);
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
