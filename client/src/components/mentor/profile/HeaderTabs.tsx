export default function HeaderTabs() {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-gray-400 mb-4">
          Manage your mentor profile and account settings.
        </p>
        <div className="flex border-b border-gray-800">
          <button className="px-4 py-2 text-sm font-medium text-white border-b-2 border-blue-500">
            Profile Information
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
            Account Settings
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
            Notifications
          </button>
        </div>
      </div>
    );
  }
  