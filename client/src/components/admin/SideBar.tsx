import Link from 'next/link';
import { FiHome, FiUsers, FiBook, FiSettings, FiLogOut, FiX } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { SideBarProps } from '@/src/types/adminTypes';
import { usePathname } from 'next/navigation';

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, href: '/admin/dashboard' },
    { name: 'Users', icon: <FiUsers />, href: '/admin/dashboard/users' },
    { name: 'Mentors', icon: <FaChalkboardTeacher />, href: '/admin/dashboard/mentor' },
    { name: 'Courses', icon: <FiBook />, href: '/admin/courses' },
    { name: 'Settings', icon: <FiSettings />, href: '/admin/settings' },
    
  ];

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:static z-30 w-64 h-full transition-all duration-300 ease-in-out transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
        bg-white text-gray-900 shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <h1 className="text-xl font-bold">LV admin</h1>
          </div>
          <button 
            className="lg:hidden p-1 rounded-md hover:bg-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} legacyBehavior>
                  <a
                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
