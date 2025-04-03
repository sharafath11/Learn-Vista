import Image from "next/image"
import { Settings } from "lucide-react"

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg">
            <Image
              src="/placeholder.svg?height=128&width=128"
              alt="User Avatar"
              width={128}
              height={128}
              className="object-cover rounded-full"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-white">
              <div className="h-4 w-4"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-20 pb-6 px-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">Sarah Johnson</h2>
        <p className="text-sm text-gray-500 mt-1">Web Development Student</p>
        
        <div className="mt-4 flex justify-center space-x-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500">Courses</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">4</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">124</p>
            <p className="text-xs text-gray-500">Hours</p>
          </div>
        </div>
        
        <button className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors">
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>
    </div>
  )
}