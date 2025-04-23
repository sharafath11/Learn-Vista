import { Bell, BookOpen, Calendar, ChevronRight, Code, FileText, Search, Settings, Star, Users } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-400">Manage your courses, progress, and activities.</p>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#131a2b] border border-[#1e2a45] rounded-lg overflow-hidden">
          <div className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-400">Total Users</div>
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">14.2</div>
          </div>
        </div>

        <div className="bg-[#131a2b] border border-[#1e2a45] rounded-lg overflow-hidden">
          <div className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-400">Available Jobs</div>
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">25</div>
          </div>
        </div>

        <div className="bg-[#131a2b] border border-[#1e2a45] rounded-lg overflow-hidden">
          <div className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-400">Pending Requests</div>
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">8</div>
          </div>
        </div>

        <div className="bg-[#131a2b] border border-[#1e2a45] rounded-lg overflow-hidden">
          <div className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-400">Total Earnings</div>
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">$1,254.89</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#131a2b] border border-[#1e2a45] rounded-lg overflow-hidden lg:col-span-1 row-span-2">
          <div className="p-4 border-b border-[#1e2a45]">
            <div className="font-semibold text-lg">Quick Actions</div>
            <div className="text-sm text-gray-400">Shortcuts to your most used features</div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1c2539] p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 hover:bg-[#232e4a] transition-colors cursor-pointer">
                <div className="bg-[#2a3655] p-2 rounded-full">
                  <FileText className="h-5 w-5 text-[#4d78cc]" />
                </div>
                <span className="text-sm font-medium">New Document</span>
                <span className="text-xs text-gray-400">Create and edit documents</span>
              </div>

              <div className="bg-[#1c2539] p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 hover:bg-[#232e4a] transition-colors cursor-pointer">
                <div className="bg-[#2a3655] p-2 rounded-full">
                  <Code className="h-5 w-5 text-[#4d78cc]" />
                </div>
                <span className="text-sm font-medium">Start Code Review</span>
                <span className="text-xs text-gray-400">Review and analyze code</span>
              </div>

              <div className="bg-[#1c2539] p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 hover:bg-[#232e4a] transition-colors cursor-pointer">
                <div className="bg-[#2a3655] p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-[#4d78cc]" />
                </div>
                <span className="text-sm font-medium">Manage Schedule</span>
                <span className="text-xs text-gray-400">View and edit your calendar</span>
              </div>

              <div className="bg-[#1c2539] p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 hover:bg-[#232e4a] transition-colors cursor-pointer">
                <div className="bg-[#2a3655] p-2 rounded-full">
                  <Settings className="h-5 w-5 text-[#4d78cc]" />
                </div>
                <span className="text-sm font-medium">Update Profile</span>
                <span className="text-xs text-gray-400">Edit your personal information</span>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-[#1e2a45]">
            <button className="text-[#4d78cc] w-full flex items-center justify-center text-sm hover:underline">
              View All Actions <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-[#131a2b] border border-[#1e2a45] rounded-lg overflow-hidden lg:col-span-2 row-span-2">
          <div className="p-4 border-b border-[#1e2a45]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-semibold text-lg">Upcoming Courses</div>
                <div className="text-sm text-gray-400">Continue where you left off</div>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1c2539] text-white">
                  Ongoing Progress
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#232e4a] text-white">
                  Upcoming Sessions
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-6">
            {/* Course 1 */}
            <div className="bg-[#1c2539] rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">Web Development Basics</h3>
                  <p className="text-sm text-gray-400">HTML, CSS, and JavaScript fundamentals</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4d78cc] text-white">
                  In Progress
                </span>
              </div>
              <div className="w-full bg-[#2a3655] rounded-full h-2 mb-2">
                <div className="bg-[#4d78cc] h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>65% Complete</span>
                <span>4 hours remaining</span>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="px-3 py-1 text-xs h-8 bg-transparent border border-[#2a3655] text-white rounded hover:bg-[#2a3655]">
                  View Course
                </button>
                <button className="px-3 py-1 text-xs h-8 bg-[#4d78cc] hover:bg-[#3a67bb] text-white rounded">
                  Continue Learning
                </button>
              </div>
            </div>

            {/* Course 2 */}
            <div className="bg-[#1c2539] rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">JavaScript: Advanced Concepts</h3>
                  <p className="text-sm text-gray-400">Closures, Promises, and Async/Await</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#9333ea] text-white">
                  New
                </span>
              </div>
              <div className="w-full bg-[#2a3655] rounded-full h-2 mb-2">
                <div className="bg-[#4d78cc] h-2 rounded-full" style={{ width: "25%" }}></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>25% Complete</span>
                <span>6 hours remaining</span>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="px-3 py-1 text-xs h-8 bg-transparent border border-[#2a3655] text-white rounded hover:bg-[#2a3655]">
                  View Course
                </button>
                <button className="px-3 py-1 text-xs h-8 bg-[#4d78cc] hover:bg-[#3a67bb] text-white rounded">
                  Continue Learning
                </button>
              </div>
            </div>

            {/* Course 3 */}
            <div className="bg-[#1c2539] rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">Career Guidance Session</h3>
                  <p className="text-sm text-gray-400">Resume Review</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4d78cc] text-white">
                  Upcoming
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                <span>April 15, 2025 • 2:00 PM</span>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="px-3 py-1 text-xs h-8 bg-transparent border border-[#2a3655] text-white rounded hover:bg-[#2a3655]">
                  View Details
                </button>
                <button className="px-3 py-1 text-xs h-8 bg-[#4d78cc] hover:bg-[#3a67bb] text-white rounded">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-[#1e2a45]">
            <button className="text-[#4d78cc] w-full flex items-center justify-center text-sm hover:underline">
              View All Courses <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-[#131a2b] border border-[#1e2a45] rounded-lg overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-[#1e2a45]">
            <div className="font-semibold text-lg">Recent Reviews</div>
            <div className="text-sm text-gray-400">What others are saying about your courses</div>
          </div>
          <div className="p-4 space-y-4">
            <div className="border-b border-[#1e2a45] pb-4">
              <div className="flex justify-between mb-1">
                <h4 className="font-medium">React JS Masterclass</h4>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                "This course was incredibly helpful. The instructor explained complex concepts in an easy-to-understand
                way."
              </p>
              <div className="text-xs text-gray-500">John Doe • 2 days ago</div>
            </div>

            <div className="border-b border-[#1e2a45] pb-4">
              <div className="flex justify-between mb-1">
                <h4 className="font-medium">UI/UX Design Principles</h4>
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                "Great content, but could use more practical examples. Overall very informative."
              </p>
              <div className="text-xs text-gray-500">Jane Smith • 5 days ago</div>
            </div>

            <div className="pb-2">
              <div className="flex justify-between mb-1">
                <h4 className="font-medium">Data Structures & Algorithms</h4>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                "Excellent course! The practice problems really helped solidify my understanding. Highly recommended for
                anyone looking to improve their coding skills."
              </p>
              <div className="text-xs text-gray-500">Alex Johnson • 1 week ago</div>
            </div>
          </div>
          <div className="p-4 border-t border-[#1e2a45]">
            <button className="text-[#4d78cc] w-full flex items-center justify-center text-sm hover:underline">
              View All Reviews <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-[#131a2b] border border-[#1e2a45] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#1e2a45]">
            <div className="font-semibold text-lg">Recent Messages</div>
            <div className="text-sm text-gray-400">Your latest conversations</div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b border-[#1e2a45]">
              <div className="w-10 h-10 rounded-full bg-[#2a3655] flex items-center justify-center">
                <Users className="h-5 w-5 text-[#4d78cc]" />
              </div>
              <div>
                <div className="flex justify-between">
                  <h4 className="font-medium">Support Team</h4>
                  <span className="text-xs text-gray-400">2h ago</span>
                </div>
                <p className="text-sm text-gray-400">
                  "We've processed your refund request. Please allow 3-5 business days..."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-[#1e2a45]">
              <div className="w-10 h-10 rounded-full bg-[#2a3655] flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-[#4d78cc]" />
              </div>
              <div>
                <div className="flex justify-between">
                  <h4 className="font-medium">Michael Owen</h4>
                  <span className="text-xs text-gray-400">1d ago</span>
                </div>
                <p className="text-sm text-gray-400">
                  "Thanks for your feedback on my project! I've made the suggested changes..."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2a3655] flex items-center justify-center">
                <Bell className="h-5 w-5 text-[#4d78cc]" />
              </div>
              <div>
                <div className="flex justify-between">
                  <h4 className="font-medium">Emily Rodriguez</h4>
                  <span className="text-xs text-gray-400">3d ago</span>
                </div>
                <p className="text-sm text-gray-400">
                  "Are you available for a quick call to discuss the upcoming project deadline?"
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-[#1e2a45]">
            <button className="text-[#4d78cc] w-full flex items-center justify-center text-sm hover:underline">
              View All Messages <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>© 2025 Learning Dashboard. All rights reserved.</p>
      </div>
    </div>
  )
}

