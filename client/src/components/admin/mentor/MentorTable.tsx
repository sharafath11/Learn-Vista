import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MentorRow from './MentorRow';
import { useAdminContext } from '@/src/context/adminContext';
import { SearchAndFilterBar } from '../SearchAndFilterBar';
import { User } from 'lucide-react';
import { AdminAPIMethods } from '@/src/services/methods/admin.api';
import { MentorFilters, MentorStatus } from '@/src/types/mentorTypes';

interface MentorTableProps {
  theme: string;
}

const MentorTable: FC<MentorTableProps> = ({ theme }) => {
  const { mentors, setMentors } = useAdminContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked' | 'Approved' | 'Pending' | 'Rejected'>('All');

  const mentorsPerPage = 2;
  const [totalMentors, setTotalMentors] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchMentors();
  },[debouncedSearchTerm, sortOrder, currentPage, statusFilter]);

  const fetchMentors = async () => {
    const filters: MentorFilters = {};
  
    if (statusFilter !== 'All') {
      filters.status = statusFilter.toLowerCase() as MentorStatus;
    }
  
    const res = await AdminAPIMethods.fetchMentor({
      limit:2,
      page: currentPage,
      search: debouncedSearchTerm,
      sort: { username: sortOrder === 'asc' ? 1 : -1 },
      filters,
    });
  
    if (res.ok) {
      setMentors(res.data.data);
      setTotalMentors(res.data.total);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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
          roleFilter={'Mentor'}
        />
      </div>

      {mentors && mentors.length > 0 ? (
        <>
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
                    <th className="p-4">Live class</th>
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

          {totalPages > 0 && (
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
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Mentors Available</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            {debouncedSearchTerm || statusFilter !== 'All'
              ? "No mentors match your current filters. Try adjusting your search criteria."
              : "There are currently no mentors in the system."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MentorTable;