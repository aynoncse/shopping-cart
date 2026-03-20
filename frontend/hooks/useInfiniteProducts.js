import { useEffect, useCallback, useRef, useState } from 'react';
import { useLazyGetProductsQuery } from '../store/api';

export const useInfiniteProducts = ({
  initialProducts = [],
  initialMeta = null,
  perPage = 12,
}) => {
  const [page, setPage] = useState(initialMeta?.current_page || 1);
  const [allProducts, setAllProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(
    !!(initialMeta && page < initialMeta.last_page),
  );
  const loaderRef = useRef(null);

  const [trigger, { data, isFetching, error }] = useLazyGetProductsQuery();

  useEffect(() => {
    if (page === 1 && initialMeta) return;
    if (page > 1) {
      trigger({ page, per_page: perPage });
    }
  }, [page, perPage, trigger, initialMeta]);

 useEffect(() => {
   if (!data) return;
   // eslint-disable-next-line react-hooks/set-state-in-effect
   setAllProducts((prev) => {
     const merged = [...prev, ...(data.data || [])];
     const ids = new Set();
     return merged.filter((item) => {
       if (ids.has(item.id)) return false;
       ids.add(item.id);
       return true;
     });
   });
   setHasMore(data.current_page < data.last_page);
 }, [data]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isFetching, hasMore]);

  const reset = useCallback(() => {
    setPage(initialMeta?.current_page || 1);
    setAllProducts(initialProducts);
    setHasMore(
      !!(
        initialMeta && (initialMeta.current_page || 1) < initialMeta.last_page
      ),
    );
  }, [initialProducts, initialMeta]);

  return {
    products: allProducts,
    isLoading: false, // initial load is handled by server component
    isLoadingMore: isFetching && page > 1,
    error,
    hasMore,
    loaderRef,
    reset,
  };
};
