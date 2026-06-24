export default function Loader() {
  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden animate-pulse">
      {/* Sidebar Skeleton (hidden on mobile) */}
      <div className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-white/10 p-6 space-y-6 h-screen">
        {/* Logo/Brand placeholder */}
        <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
        
        {/* Navigation items placeholders */}
        <div className="space-y-4 pt-8">
          <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg w-full"></div>
          <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg w-full"></div>
          <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg w-full"></div>
          <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg w-full"></div>
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar Skeleton */}
        <div className="h-16 border-b border-gray-200 dark:border-white/10 px-6 flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 dark:bg-white/10 rounded"></div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 dark:bg-white/10 rounded-full"></div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Page Header/Title Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
              <div className="h-4 w-32 bg-gray-100 dark:bg-white/5 rounded"></div>
            </div>
            <div className="h-10 w-28 bg-gray-200 dark:bg-white/10 rounded-full"></div>
          </div>

          {/* Cards/Content Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 space-y-4 flex flex-col"
                style={{ 
                  height: i % 3 === 0 ? '380px' : i % 2 === 0 ? '320px' : '350px' 
                }}
              >
                {/* Image Placeholder */}
                <div className="flex-1 bg-gray-200 dark:bg-white/10 rounded-xl relative overflow-hidden">
                  {/* Subtle shimmer effect line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
                </div>

                {/* Footer Info Placeholder */}
                <div className="flex items-center space-x-3 pt-2">
                  <div className="h-9 w-9 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
