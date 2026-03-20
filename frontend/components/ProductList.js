'use client';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import ProductCard from './ProductCard';
import ProductGridSkeleton from './ProductGridSkeleton';
import ProductListError from './ProductListError';
import ProductListLoadMore from './ProductListLoadMore';

export default function ProductList({
  initialProducts,
  initialMeta,
}) {
  const { products, isLoadingMore, error, hasMore, loaderRef } =
    useInfiniteProducts({
      initialProducts,
      initialMeta,
    });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please sign in to add items to your cart.');
      return;
    }
    dispatch(addItem({ product, quantity: 1 }));
  };

  if (error) return <ProductListError />;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <ProductListLoadMore
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        loaderRef={loaderRef}
      />
    </div>
  );
}
