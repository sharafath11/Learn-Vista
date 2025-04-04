import { FC } from 'react';
import { FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MentorRow from './MentorRow';


interface MentorTableProps {
  mentors: any[];
  theme: string;
}

const MentorTable: FC<MentorTableProps> = ({ mentors, theme }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-xl shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-left ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <th className="p-4">Mentor</th>
              <th className="p-4">Expertise</th>
              <th className="p-4">Status</th>
              <th className="p-4">Students</th>
              <th className="p-4">Courses</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor) => (
              <MentorRow key={mentor.id} mentor={mentor} theme={theme} getStatusColor={getStatusColor} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default MentorTable;
