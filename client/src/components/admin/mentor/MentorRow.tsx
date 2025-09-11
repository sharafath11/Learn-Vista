"use client"
import { FC, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiEye, FiLock, FiUnlock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { showInfoToast, showSuccessToast } from '@/src/utils/Toast';
import { AdminContext } from '@/src/context/adminContext';
import { AdminAPIMethods } from '@/src/services/methods/admin.api';
import { CustomAlertDialog } from '@/src/components/Custom-alert-dialog';
import Image from 'next/image';
import { IAdminMentorRowProps } from '@/src/types/adminProps';



const MentorRow: FC<IAdminMentorRowProps> = ({ mentor, theme, getStatusColor }) => {
  const route = useRouter();
  const adminDetil = useContext(AdminContext);

  function onView(id: string): void {
    route.push(`/admin/dashboard/mentor/${id}`);
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function openConfirmDialog() {
    setIsDialogOpen(true);
  }

  async function confirmBlockToggle() {
    const res = await AdminAPIMethods.blockMentor(mentor.id, !mentor.isBlock);

    if (res.ok) {
      if (res.msg.includes("Unblocked")) showSuccessToast(res.msg);
      else showInfoToast(res.msg);

      if (adminDetil?.mentors && adminDetil?.setMentors) {
        const updatedMentors = adminDetil.mentors.map((m) =>
          m.id === mentor.id ? { ...m, isBlock: !mentor.isBlock } : m
        );
        adminDetil.setMentors(updatedMentors);
      }
    }

    setIsDialogOpen(false);
  }

  return (
    <>
      <motion.tr 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`border-t ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
      >
        <td className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
              {mentor?.profilePicture ? (
                <Image src={mentor?.profilePicture} alt={mentor.username} className="w-full h-full object-cover" />
              ) : (
                <FiUser className="w-full h-full p-2 text-gray-500" />
              )}
            </div>
            <span className="font-medium">{mentor?.username}</span>
          </div>
        </td>
        <td className="p-4">{mentor.expertise[0]}</td>
        <td className="p-4">
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(mentor.status)}`}>{mentor.status}</span>
        </td>
        <td className="p-4">{mentor.liveClasses.length}</td>
        <td className="p-4">{mentor.students}</td>
        <td className="p-4">{mentor.isBlock ? "Block" : "Active"}</td>
        <td className="p-4 text-right space-x-2">
          {/* View button */}
          <button
            onClick={() => onView?.(mentor?.id)}
            className="p-2 rounded-lg transition-all duration-200 text-blue-600 hover:bg-blue-50"
            title="View Mentor"
          >
            <FiEye className="w-5 h-5" />
          </button>

          {/* Block / Unblock button */}
          <button 
            className={`p-2 rounded-lg transition-all duration-200 ${
              mentor.isBlock 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-yellow-600 hover:bg-yellow-50'
            }`}
            title={mentor.isBlock ? "Unblock Mentor" : "Block Mentor"}
            onClick={openConfirmDialog} // ✅ updated
          >
            {mentor.isBlock ? (
              <FiLock className="w-5 h-5" />
            ) : (
              <FiUnlock className="w-5 h-5" />
            )}
          </button>
        </td>
      </motion.tr>

      {/* ✅ Confirmation dialog */}
      <CustomAlertDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={mentor.isBlock ? "Unblock Mentor" : "Block Mentor"}
        description={
          mentor.isBlock
            ? "Are you sure you want to unblock this mentor? They will regain access immediately."
            : "Are you sure you want to block this mentor? They will lose access immediately."
        }
        variant={mentor.isBlock ? "info" : "warning"}
        onConfirm={confirmBlockToggle}
        onCancel={() => setIsDialogOpen(false)}
        confirmText={mentor.isBlock ? "Yes, Unblock" : "Yes, Block"}
        cancelText="Cancel"
      />
    </>
  );
};

export default MentorRow;
