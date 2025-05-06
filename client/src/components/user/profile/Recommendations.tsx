import { BookOpen, ChevronRight } from "lucide-react"

const recommendations = [
  {
    title: "Complete 'Advanced React Patterns'",
    description: "You're 75% through - finish to earn your certificate",
    icon: <BookOpen className="h-5 w-5" />,
  },
  // ... other recommendations
]

export default function Recommendations() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended Next Steps</h2>
      
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className={`p-2 rounded-lg mr-4 ${
              index === 0 ? 'bg-indigo-100 text-indigo-600' :
              index === 1 ? 'bg-purple-100 text-purple-600' :
              'bg-green-100 text-green-600'
            }`}>
              {recommendation.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}