'use client';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import ProductCard from './ProductCard';
import ProductListError from './ProductListError';
import ProductListLoadMore from './ProductListLoadMore';
import toast from 'react-hot-toast';

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
      toast.error('Please sign in to add items to your cart.');
      return;
    }

    dispatch(addItem({ product, quantity: 1 }));
    toast.success(`${product.name} added to your cart.`);
  };

  if (error) return <ProductListError />;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
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
    </>
  );
}
