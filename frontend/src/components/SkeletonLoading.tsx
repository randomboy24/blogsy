export function SkeletonLoading({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 mb-4 animate-pulse bg-gray-100"
        >
          {/* Title placeholder */}
          <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>

          {/* Content placeholder */}
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded mb-4"></div>

          {/* Author & date placeholder */}
          <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </>
  );
}
