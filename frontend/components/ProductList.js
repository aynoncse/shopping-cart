'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import ProductCard from './ProductCard';
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
  const [notice, setNotice] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleAddToCart = (product) => {
    if (!user) {
      setNotice('Please sign in to add items to your cart.');
      return;
    }

    setNotice('');
    dispatch(addItem({ product, quantity: 1 }));
  };

  if (error) return <ProductListError />;

  return (
    <div>
      {notice ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
