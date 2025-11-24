"use client"
import { useState, useEffect, ChangeEvent, useContext } from 'react';
import { useTheme } from 'next-themes';
import { FiMail, FiLock, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { postRequest } from '@/src/services/api';
import { showErrorToast, showSuccessToast } from '@/src/utils/Toast';
import { AdminContext } from '@/src/context/adminContext';
import { useRouter } from 'next/navigation';
import { IData } from '@/src/types/adminTypes';

const AdminLogin = () => {

  const [data, setData] = useState<IData>({ email: "", password: "" })
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const admin = useContext(AdminContext);
  const route = useRouter()

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null;
  function onchangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setData({ ...data, [e.target.id]: e.target.value });
  }
  async function handleSubmit() {
    const res = await postRequest("/admin/login", data);
    if (res.ok) {
      showSuccessToast(res.msg);
      admin?.refreshAdminNotification()
      admin?.setAdmin(true);
      route.push("/admin/dashboard")
    }
    else showErrorToast(res.msg)
  }
  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md mx-4 p-8 rounded-2xl shadow-xl backdrop-blur-lg ${theme === 'dark' ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 border border-white/20'}`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <FiUser className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Admin Portal</h1>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
          >
            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <motion.div
              animate={{
                y: data.email ? -12 : 0,
                scale: data.email ? 0.8 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`absolute left-3 px-1 ${theme === 'dark' ? 'bg-gray-800/80 text-gray-300' : 'bg-white/80 text-gray-500'}`}
            >
              <label htmlFor="email" className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </label>
            </motion.div>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onchangeHandler(e)}
              className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-400' : 'bg-white/50 border-gray-300 text-gray-800 focus:border-purple-500'} focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-purple-500/30' : 'focus:ring-purple-300'} transition-all duration-200`}
            />
          </div>


          <div className="relative">
            <motion.div
              animate={{
                y: data.password ? -12 : 0,
                scale: data.password ? 0.8 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`absolute left-3 px-1 ${theme === 'dark' ? 'bg-gray-800/80 text-gray-300' : 'bg-white/80 text-gray-500'}`}
            >
              <label htmlFor="password" className="flex items-center space-x-2">
                <FiLock className="w-4 h-4" />
                <span className="text-sm">Password</span>
              </label>
            </motion.div>
            <input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => onchangeHandler(e)}
              className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-400' : 'bg-white/50 border-gray-300 text-gray-800 focus:border-purple-500'} focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-purple-500/30' : 'focus:ring-purple-300'} transition-all duration-200`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl ${theme === 'dark' ? 'hover:shadow-purple-500/20' : 'hover:shadow-purple-400/30'} transition-all duration-300`}
            onClick={handleSubmit}
          >
            Sign In
          </motion.button>
        </div>

        <div className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;