import { Calendar, Award } from "lucide-react"

export default function BioCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <h3 className="font-medium text-gray-900 mb-3">About Me</h3>
      <p className="text-sm text-gray-600">
        Passionate about learning new technologies and building web applications. Currently focused on mastering React and Next.js.
      </p>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Member since January 2023</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Award className="h-4 w-4 mr-2" />
          <span>Intermediate level</span>
        </div>
      </div>
    </div>
  )
}