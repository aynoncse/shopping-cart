import { useEffect, useCallback, useRef, useState } from 'react';
import { useLazyGetProductsQuery } from '../store/api';

const dedupeProducts = (products) => {
  const ids = new Set();

  return products.filter((item) => {
    if (ids.has(item.id)) return false;
    ids.add(item.id);
    return true;
  });
};

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

  const [trigger, { isFetching, error }] = useLazyGetProductsQuery();

  const loadNextPage = useCallback(async () => {
    if (isFetching || !hasMore) {
      return;
    }

    const nextPage = page + 1;
    setPage(nextPage);

    try {
      const nextData = await trigger({ page: nextPage, per_page: perPage }).unwrap();
      setAllProducts((prev) => dedupeProducts([...prev, ...(nextData.data || [])]));
      setHasMore((nextData.meta?.current_page || 1) < (nextData.meta?.last_page || 1));
    } catch {
      setPage((prev) => prev - 1);
    }
  }, [hasMore, isFetching, page, perPage, trigger]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadNextPage]);

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
