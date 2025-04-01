

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90">
      <div className="relative flex flex-col items-center">
        {/* Modern gradient spinner */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-500 border-t-transparent"></div>
        
        {/* Optional loading text with fade animation */}
        <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          Loading...
        </p>
        
        {/* Subtle background pattern (optimized) */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;