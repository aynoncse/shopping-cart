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
          <div className="site-bg h-4 w-4 rounded-full animate-bounce"></div>
          <div className="site-bg h-4 w-4 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="site-bg h-4 w-4 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
      ) : (
        <span className="text-gray-400">Scroll for more</span>
      )}
    </div>
  );
}
