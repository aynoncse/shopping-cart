import { useEffect, useCallback, useRef, useState } from 'react';
import { useLazyGetProductsQuery } from '../store/api';

export const useInfiniteProducts = (perPage = 12) => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const [trigger, { data, isFetching, error }] = useLazyGetProductsQuery();

  useEffect(() => {
    trigger({ page, per_page: perPage });
  }, [page, perPage, trigger]);

  useEffect(() => {
    if (!data) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllProducts((prev) => {
      if (page === 1) return data.data || [];

      const merged = [...prev, ...(data.data || [])];
      const ids = new Set();
      return merged.filter((item) => {
        if (ids.has(item.id)) return false;
        ids.add(item.id);
        return true;
      });
    });

    setHasMore(data.current_page < data.last_page);
  }, [data, page]);

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
    setPage(1);
    setAllProducts([]);
    setHasMore(true);
  }, []);

  return {
    products: allProducts,
    isLoading: isFetching && page === 1,
    isLoadingMore: isFetching && page > 1,
    error,
    hasMore,
    loaderRef,
    reset,
  };
};
