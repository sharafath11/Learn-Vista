import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

const Cheader = () => {
    const route=useRouter()
  return (
    <header className="bg-white shadow-sm">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
        <button
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => route.push("/admin/dashboard/courses/create-course")}
        >
          <Plus className="mr-1 h-5 w-5" />
          Add Course
        </button>
      </div>
    </div>
  </header>
  )
}

export default Cheader