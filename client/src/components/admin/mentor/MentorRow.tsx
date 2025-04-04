import { FC } from 'react';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';

interface MentorRowProps {
  mentor: any;
  theme: string;
  getStatusColor: (status: string) => string;
}

const MentorRow: FC<MentorRowProps> = ({ mentor, theme, getStatusColor }) => {
  return (
    <motion.tr 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`border-t ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
    >
      <td className="p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
            {mentor.avatar ? (
              <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
            ) : (
              <FiUser className="w-full h-full p-2 text-gray-500" />
            )}
          </div>
          <span className="font-medium">{mentor.name}</span>
        </div>
      </td>
      <td className="p-4">{mentor.expertise}</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(mentor.status)}`}>{mentor.status}</span>
      </td>
      <td className="p-4">{mentor.students}</td>
      <td className="p-4">{mentor.courses}</td>
      <td className="p-4 text-right">
        <button className="text-sm px-4 py-1 rounded bg-gray-600 text-white hover:bg-gray-700">
          {mentor.blocked ? 'Unblock' : 'Block'}
        </button>
      </td>
    </motion.tr>
  );
};

export default MentorRow;