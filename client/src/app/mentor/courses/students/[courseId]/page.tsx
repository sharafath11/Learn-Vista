import StudentCard from "./studentsCard"

export default function Page() {
  const handleViewStudent = (id: string) => {
    console.log("Viewing student profile:", id)
    
  }
   
  const handleToggleBlock = (id: string, shouldBlock: boolean) => {
    console.log(`${shouldBlock ? "Blocking" : "Unblocking"} student:`, id)
    
  }

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Student Management</h1>
          <p className="text-gray-400">Manage your students and their enrollment status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onView={handleViewStudent}
              onToggleBlock={handleToggleBlock}
            />
          ))}
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>Showing {sampleStudents.length} students</p>
        </div>
      </div>
    </main>
  )
}
