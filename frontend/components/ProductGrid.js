'use client';

import ProductList from './ProductList';
import ProductListError from './ProductListError';
import { useGetProductsQuery } from '@/store/api';

export default function ProductGrid() {
  const { data, isLoading, isError } = useGetProductsQuery({
    page: 1,
    per_page: 12,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden border border-gray-100 bg-white shadow-sm"
          >
            <div className="aspect-square animate-pulse bg-gray-100" />
            <div className="space-y-3 p-3 sm:p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ProductListError message="Failed to load products right now. Please try again shortly." />
    );
  }

  const productIds = data.data.map((product) => product.id).join('-');

  return (
    <ProductList
      key={`${data.meta?.current_page}-${data.meta?.last_page}-${productIds}`}
      initialProducts={data.data}
      initialMeta={data.meta}
    />
  );
}
