export function SkeletonLoader({ type }: { type: 'hero' | 'featured' | 'compact' | 'detail' | 'card' | 'news-package' }) {
  const baseClasses = "bg-gray-200 animate-pulse rounded";

  if (type === 'detail') {
    return (
      <div className="w-full px-5 py-10 space-y-8">
        <div className={`h-4 w-32 ${baseClasses}`}></div>
        <div className="space-y-4">
          <div className={`h-12 w-full ${baseClasses}`}></div>
          <div className={`h-12 w-3/4 ${baseClasses}`}></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full ${baseClasses}`}></div>
          <div className="space-y-2">
            <div className={`h-4 w-32 ${baseClasses}`}></div>
            <div className={`h-3 w-24 ${baseClasses}`}></div>
          </div>
        </div>
        <div className={`w-full aspect-video ${baseClasses}`}></div>
        <div className="space-y-4">
          <div className={`h-4 w-full ${baseClasses}`}></div>
          <div className={`h-4 w-full ${baseClasses}`}></div>
          <div className={`h-4 w-5/6 ${baseClasses}`}></div>
        </div>
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className="py-2 px-4 w-full">
        <div className="w-full rounded-lg bg-gray-300 animate-pulse" style={{ aspectRatio: '2 / 1' }}></div>
      </div>
    );
  }

  if (type === 'featured') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-5">
        <div className={`w-full h-48 ${baseClasses}`}></div>
        <div className="p-4 space-y-3">
          <div className={`h-6 w-3/4 ${baseClasses}`}></div>
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full ${baseClasses}`}></div>
            <div className={`h-4 w-24 ${baseClasses}`}></div>
          </div>
          <div className="space-y-2">
            <div className={`h-4 w-full ${baseClasses}`}></div>
            <div className={`h-4 w-5/6 ${baseClasses}`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="flex flex-col">
        {/* Image skeleton */}
        <div className={`mb-4 h-40 w-full ${baseClasses} rounded`}></div>
        {/* Quote skeleton */}
        <div className="space-y-2 mb-3 flex-grow">
          <div className={`h-3 w-full ${baseClasses}`}></div>
          <div className={`h-3 w-5/6 ${baseClasses}`}></div>
          <div className={`h-3 w-4/6 ${baseClasses}`}></div>
        </div>
        {/* Author skeleton */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${baseClasses}`}></div>
          <div className="space-y-1 flex-grow">
            <div className={`h-2 w-24 ${baseClasses}`}></div>
            <div className={`h-2 w-20 ${baseClasses}`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'news-package') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex gap-4 p-4">
          {/* Image skeleton */}
          <div className={`w-24 h-24 rounded ${baseClasses} flex-shrink-0`}></div>
          {/* Text skeleton */}
          <div className="flex-1 space-y-2">
            <div className={`h-4 w-5/6 ${baseClasses}`}></div>
            <div className={`h-3 w-3/4 ${baseClasses}`}></div>
            <div className="space-y-1">
              <div className={`h-3 w-full ${baseClasses}`}></div>
              <div className={`h-3 w-4/5 ${baseClasses}`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      <div className="flex-1 space-y-3">
        <div className={`h-5 w-5/6 ${baseClasses}`}></div>
        <div className="flex items-center space-x-2">
          <div className={`w-5 h-5 rounded-full ${baseClasses}`}></div>
          <div className={`h-3 w-20 ${baseClasses}`}></div>
        </div>
        <div className={`h-4 w-full ${baseClasses}`}></div>
      </div>
      <div className={`w-30 h-20 flex-shrink-0 ${baseClasses}`}></div>
    </div>
  );
}
