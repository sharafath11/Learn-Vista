import Link from 'next/link';
import { FiHome, FiUsers, FiBook, FiLogOut, FiX, FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { SideBarProps } from '@/src/types/adminTypes';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { postRequest } from '@/src/services/api';

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <FiHome className="text-white" />, href: '/admin/dashboard' },
    { name: 'Users', icon: <FiUsers className="text-white" />, href: '/admin/dashboard/users' },
    { name: 'Mentors', icon: <FaChalkboardTeacher className="text-white" />, href: '/admin/dashboard/mentor' },
    { name: 'Courses', icon: <FiBook className="text-white" />, href: '/admin/dashboard/courses' },
    { name: 'Category', icon: <FiBook className="text-white" />, href: '/admin/dashboard/categories' },
    { name: 'Concern', icon: <FiAlertCircle className="text-white" />, href: '/admin/dashboard/concern' },
  ];
  const route=useRouter()
  async function handleLogout() {
      await postRequest("/admin/logout", {})
      route.push("/admin")
    }
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:relative z-30 h-full transition-all duration-300 ease-in-out transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
        bg-gradient-to-b from-[#053c5c] to-[#053c5c] text-white shadow-xl
        ${isCollapsed ? 'w-20' : 'w-64'}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#053c5c] border-1 flex items-center justify-center">
                <span className="font-bold text-white">LV</span>
              </div>
              <h1 className="text-xl font-bold text-white bg-clip-text text-transparent">
                LV Admin
              </h1>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 mx-auto flex items-center justify-center">
              <span className="font-bold text-white text-xs">LV</span>
            </div>
          )}
          <button 
            className={`p-1 rounded-md hover:bg-white/10 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="text-white" />
          </button>
        </div>

        {/* Collapse button */}
        <div className={`absolute -right-3 top-20 hidden lg:block ${hovering || isCollapsed ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 bg-[#053c5c] border-2 border-white/20 rounded-full shadow-lg hover:bg-[#053c5c] transition-all"
          >
            {isCollapsed ? (
              <FiChevronRight className="text-white" />
            ) : (
              <FiChevronLeft className="text-white" />
            )}
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} legacyBehavior>
                  <a
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-white/20 text-white shadow-md'
                        : 'hover:bg-white/10'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <span className={`${isCollapsed ? '' : 'mr-3'}`}>{item.icon}</span>
                    {!isCollapsed && (
                      <span className={`font-medium ${pathname === item.href ? 'font-semibold' : ''}`}>
                        {item.name}
                      </span>
                    )}
                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-[#7a0244] text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className={`absolute bottom-0 w-full p-4 border-t border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button className="flex items-center hover:bg-white/10 p-3 rounded-lg transition-colors w-full justify-center" onClick={handleLogout}>
            <FiLogOut className="text-white" />
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;