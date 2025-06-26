"use client"
import { useMentorContext } from "@/src/context/mentorContext";
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Code,
  FileText,
  Search,
  Settings,
  Star,
  Users,
  Film, // For live streaming
  GraduationCap, // For total students
  ClipboardList, // For course requests/registrations
  PlusCircle, // For adding new content
  MessageSquare, // For community/engagement
} from "lucide-react";
import { useEffect } from "react";

export default function MentorDashboard() {
 
  
 
  const { courses } = useMentorContext();
  let totelStudent = 0
  let totelLessons=0
  courses.forEach((course) => {
    totelStudent += course.enrolledUsers?.length ?? 0;
    
    // totelLessons += course?.lessons.length ?? 0
    console.log(totelLessons)
    
  });  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-950 text-white p-6 md:p-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Mentor Hub</h1>
          <p className="text-lg text-blue-200 mt-2">
            Empowering positive change through mentorship and community.
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Button variant="ghost" size="icon" className="text-blue-300 hover:bg-blue-800/20">
            <Bell className="h-6 w-6" />
            <span className="sr-only">Notifications</span>
          </Button>
          
        </div>
      </header>

      {/* --- */}

      {/* Key Metrics for Impact */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-5">Your Impact At A Glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Total Students */}
          <div className="bg-gradient-to-br from-blue-800/30 to-purple-800/30 border border-blue-700/50 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-blue-200 uppercase">Total Students</div>
                <GraduationCap className="h-6 w-6 text-blue-300" />
              </div>
              <div className="text-5xl font-bold text-white leading-tight">{ totelStudent}</div>
            </div>
            <p className="text-sm text-blue-100 mt-3">Engaged across all your courses.</p>
          </div>

          {/* Active Courses */}
          <div className="bg-gradient-to-br from-green-800/30 to-teal-800/30 border border-green-700/50 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-green-200 uppercase">Active Courses</div>
                <BookOpen className="h-6 w-6 text-green-300" />
              </div>
              <div className="text-5xl font-bold text-white leading-tight">{courses.length}</div>
            </div>
            <p className="text-sm text-green-100 mt-3">Currently delivering valuable content.</p>
          </div>

          {/* Course Registrations */}
          <div className="bg-gradient-to-br from-yellow-800/30 to-orange-800/30 border border-yellow-700/50 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-yellow-200 uppercase">Totel Lessons</div>
                <ClipboardList className="h-6 w-6 text-yellow-300" />
              </div>
              <div className="text-5xl font-bold text-white leading-tight">48</div>
            </div>
            <p className="text-sm text-yellow-100 mt-3">Pending enrollment requests.</p>
          </div>

          {/* Community Engagement */}
          <div className="bg-gradient-to-br from-red-800/30 to-pink-800/30 border border-red-700/50 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-red-200 uppercase">Community Reach</div>
                <MessageSquare className="h-6 w-6 text-red-300" />
              </div>
              <div className="text-5xl font-bold text-white leading-tight">8.5k</div>
            </div>
            <p className="text-sm text-red-100 mt-3">Total interactions this month.</p>
          </div>
        </div>
      </section>

      {/* --- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions for Mentors */}
        <section className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden shadow-xl lg:col-span-1">
          <div className="p-6 border-b border-gray-700/60">
            <h2 className="font-bold text-2xl text-white">Mentor Toolkit</h2>
            <p className="text-sm text-gray-300 mt-1">Direct access to your essential tasks.</p>
          </div>
          <div className="p-6 space-y-4">
            <ActionCard
              icon={Film}
              title="Start Live Stream"
              description="Connect with your audience instantly."
              color="text-red-400"
              bgColor="bg-red-900/30"
            />
            <ActionCard
              icon={BookOpen}
              title="Add New Lesson"
              description="Expand your course content."
              color="text-green-400"
              bgColor="bg-green-900/30"
            />
            <ActionCard
              icon={Calendar}
              title="Schedule Session"
              description="Plan your upcoming live events."
              color="text-purple-400"
              bgColor="bg-purple-900/30"
            />
            <ActionCard
              icon={Settings}
              title="Manage Profile"
              description="Update your mentor details."
              color="text-yellow-400"
              bgColor="bg-yellow-900/30"
            />
          </div>
          <div className="p-4 border-t border-gray-700/60">
            <button className="text-blue-400 w-full flex items-center justify-center text-sm font-medium hover:underline">
              View All Tools <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </section>

        {/* --- */}

        {/* My Courses & Lessons */}
        <section className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden shadow-xl lg:col-span-2">
          <div className="p-6 border-b border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-2xl text-white">Your Courses</h2>
              <p className="text-sm text-gray-300 mt-1">Overview of your contributions.</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-700 text-blue-100">
                Live
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                Drafts
              </span>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Example Course Card 1 */}
            <CourseCard
              title="Empowering Community Leaders"
              description="Strategies for grassroots social work."
              progress={75}
              status="Active"
              students={180}
            />

            {/* Example Course Card 2 */}
            <CourseCard
              title="Digital Literacy for All"
              description="Basic computer skills for underserved communities."
              progress={30}
              status="New"
              students={65}
            />

            {/* Example Course Card 3 (could be an upcoming live session) */}
            <CourseCard
              title="Mental Health First Aid (Live)"
              description="Immediate support techniques."
              date="June 20, 2025 • 3:00 PM"
              status="Upcoming Live"
              students={210}
            />
          </div>
          <div className="p-4 border-t border-gray-700/60">
            <button className="text-blue-400 w-full flex items-center justify-center text-sm font-medium hover:underline">
              View All Your Courses <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </section>

        {/* --- */}

        {/* Latest Community Interactions */}
        <section className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden shadow-xl lg:col-span-1">
          <div className="p-6 border-b border-gray-700/60">
            <h2 className="font-bold text-2xl text-white">Latest Community Interactions</h2>
            <p className="text-sm text-gray-300 mt-1">Recent questions and feedback.</p>
          </div>
          <div className="p-6 space-y-5">
            <InteractionCard
              type="Question"
              title="Question on 'Digital Literacy'"
              content="How can we help students without internet access at home?"
              author="Aisha Sharma"
              time="1 hour ago"
            />
            <InteractionCard
              type="Feedback"
              title="Feedback on 'Community Leaders' Course"
              content="The role-playing exercises were incredibly insightful!"
              author="Rajesh Kumar"
              time="5 hours ago"
            />
            <InteractionCard
              type="Discussion"
              title="New Topic: 'Volunteer Recruitment'"
              content="Best practices for engaging new volunteers."
              author="Sita Devi"
              time="Yesterday"
            />
          </div>
          <div className="p-4 border-t border-gray-700/60">
            <button className="text-blue-400 w-full flex items-center justify-center text-sm font-medium hover:underline">
              View All Interactions <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </section>
      </div>

      {/* --- */}

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Social Impact Platform. Empowering Mentors, Building Communities.</p>
      </div>
    </div>
  );
}

// Helper Components (can be moved to their own files if preferred)

// ActionCard Component
interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

function ActionCard({ icon: Icon, title, description, color, bgColor }: ActionCardProps) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:bg-white/5 ${bgColor}`}>
      <div className={`p-3 rounded-full ${bgColor} bg-opacity-70 flex-shrink-0`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-white">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </div>
  );
}

// CourseCard Component
interface CourseCardProps {
  title: string;
  description: string;
  progress?: number; // Optional for ongoing courses
  status: string;
  students: number; // Total students enrolled
  date?: string; // For upcoming live sessions
}

function CourseCard({ title, description, progress, status, students, date }: CourseCardProps) {
  const statusColors: { [key: string]: string } = {
    "Active": "bg-blue-600 text-blue-100",
    "New": "bg-green-600 text-green-100",
    "Upcoming Live": "bg-purple-600 text-purple-100",
    "Draft": "bg-gray-600 text-gray-100",
  };

  return (
    <div className="bg-gray-800/60 border border-gray-700/70 rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-xl text-white">{title}</h3>
          <p className="text-sm text-gray-300 mt-1">{description}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {progress !== undefined && (
        <>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{progress}% Lessons Covered</span>
            <span>{students} Students Enrolled</span>
          </div>
        </>
      )}

      {date && (
        <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-purple-300" />
            {date}
          </span>
          <span>{students} Registered</span>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <Button variant="outline" className="px-4 py-2 bg-transparent border border-blue-500 text-blue-300 rounded-md hover:bg-blue-900/30 transition-colors">
          View Details
        </Button>
        {status === "Upcoming Live" ? (
          <Button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
            Manage Live Session
          </Button>
        ) : (
          <Button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            Manage Lessons
          </Button>
        )}
      </div>
    </div>
  );
}

// InteractionCard Component
interface InteractionCardProps {
  type: "Question" | "Feedback" | "Discussion";
  title: string;
  content: string;
  author: string;
  time: string;
}

function InteractionCard({ type, title, content, author, time }: InteractionCardProps) {
  const typeIcons: { [key: string]: React.ElementType } = {
    Question: MessageSquare,
    Feedback: Star, // Using star for feedback
    Discussion: Users,
  };
  const Icon = typeIcons[type];

  return (
    <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/60">
      <div className="flex-shrink-0 p-2 rounded-full bg-blue-900/50">
        {Icon && <Icon className="h-5 w-5 text-blue-400" />}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium text-white">{title}</h4>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className="text-sm text-gray-300 mb-2 line-clamp-2">{content}</p>
        <div className="text-xs text-gray-500">By {author}</div>
      </div>
    </div>
  );
}

// Dummy Button component for styling (replace with your actual UI library's Button)
function Button({ children, className = "", variant = "default", size = "default", onClick, ...props }: any) {
  let baseClasses = "flex items-center justify-center font-medium rounded-md transition-colors duration-200 ease-in-out";
  let variantClasses = "";
  let sizeClasses = "";

  switch (variant) {
    case "default":
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
      break;
    case "ghost":
      variantClasses = "bg-transparent text-gray-400 hover:bg-gray-800/50";
      break;
    case "outline":
      variantClasses = "bg-transparent border border-gray-600 text-gray-200 hover:bg-gray-700/50";
      break;
    // Add other variants you might have
  }

  switch (size) {
    case "default":
      sizeClasses = "px-4 py-2";
      break;
    case "sm":
      sizeClasses = "px-3 py-1.5 text-sm";
      break;
    case "icon":
      sizeClasses = "p-2";
      break;
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}