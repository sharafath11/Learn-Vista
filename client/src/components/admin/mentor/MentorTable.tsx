//connetcyt new hookls mentor hooks

import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MentorRow from './MentorRow';
import { AdminAPIMethods } from '@/src/services/APImethods';
import { useAdminContext } from '@/src/context/adminContext';
import { SearchAndFilterBar } from '../users/SearchAndFilterBar';

interface MentorTableProps {
  theme: string;
}

const MentorTable: FC<MentorTableProps> = ({ theme }) => {
  const { mentors, setMentors } = useAdminContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');

  const mentorsPerPage = 1;
  const [totalMentors, setTotalMentors] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchMentors();
  }, [debouncedSearchTerm, sortOrder, currentPage, statusFilter]);

  const fetchMentors = async () => {
    const filters: any = {};
    if (statusFilter !== 'All') {
      filters.status = statusFilter;
    }

    const res = await AdminAPIMethods.fetchMentor({
      page: currentPage,
      search: debouncedSearchTerm,
      sort: { username: sortOrder === 'asc' ? 1 : -1 },
      filters
    });

    if (res.ok) {
      setMentors(res.data.data);
      setTotalMentors(res.data.total);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const totalPages = Math.ceil(totalMentors / mentorsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          sortOrder={sortOrder}
          setSortOrder={(val) => {
            setSortOrder(val);
            setCurrentPage(1);
          }}
        />
      </div>

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
                <th className="p-4">Block</th>
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border text-sm font-medium ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MentorTable;
