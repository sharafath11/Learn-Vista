import { UserTableProps } from "@/src/types/adminTypes";
import { FiEye, FiLock, FiUnlock } from "react-icons/fi";

export const UserTable = ({ 
  currentUsers, 
  getRoleColor,
  onBlockToggle 
}: UserTableProps) => {
 
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-4">User</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Joined</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              
              <tr key={user._id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
                      <img 
                        src={user?.profilePicture ?? ""} 
                        alt={user?.username} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="font-medium">{user.username}</span>
                  </div>
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor(user?.role??undefined)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">{new Date(user.createdAt ?? "").toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.isBlocked 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200"
                      title="View"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onBlockToggle?.(user?.id, !user.isBlocked)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        user.isBlocked 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-yellow-600 hover:bg-yellow-50'
                      }`}
                      title={user.isBlocked ? "Unblock User" : "Block User"}
                    >
                      {user.isBlocked ? (
                         <FiLock className="w-5 h-5" />
                       
                      ) : (
                        <FiUnlock className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-8 text-center">
                No users found matching your criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
