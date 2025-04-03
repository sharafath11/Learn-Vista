export default function StatsCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <h3 className="font-medium text-gray-900 mb-4">Learning Stats</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Weekly Goal</span>
            <span className="font-medium">3/5 days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Current Streak</span>
            <span className="font-medium">12 days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}