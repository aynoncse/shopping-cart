export default function ProductListLoadMore({
  hasMore,
  isLoadingMore,
  loaderRef,
}) {
  if (!hasMore) {
    return null;
  }

  return (
    <div ref={loaderRef} className="flex justify-center py-8">
      {isLoadingMore ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
      ) : (
        <span className="text-gray-400">Scroll for more</span>
      )}
    </div>
  );
}
