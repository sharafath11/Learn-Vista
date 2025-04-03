const categories = [
    { name: "Frontend Development", progress: 75 },
    // ... other categories
  ]
  
  export default function ProgressOverview() {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Progress</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Overall Progress */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Overall Progress</h3>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">65% Complete</span>
              <span className="text-gray-500">26/40 lessons</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Advanced</span>
            </div>
          </div>
          
          {/* Weekly Activity */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Weekly Activity</h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const activity = Math.floor(Math.random() * 4)
                return (
                  <div
                    key={index}
                    className={`h-8 rounded ${
                      activity === 0
                        ? "bg-gray-200"
                        : activity === 1
                          ? "bg-indigo-300"
                          : activity === 2
                            ? "bg-indigo-500"
                            : "bg-indigo-700"
                    }`}
                    title={`${activity} hours on day ${index + 1}`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>
        </div>
        
        {/* Progress by Category */}
        <h3 className="font-medium text-gray-900 mt-8 mb-4">Progress by Category</h3>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{category.name}</span>
                <span className="font-medium">{category.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${category.progress}%`,
                    backgroundColor: index === 0 ? '#6366F1' : 
                                   index === 1 ? '#EC4899' : 
                                   index === 2 ? '#10B981' : '#F59E0B'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }