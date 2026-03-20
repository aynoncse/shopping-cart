'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductList from '@/components/ProductList';
import { useGetCartQuery } from '@/store/api';
import { setCart } from '@/store/cartSlice';
import useCartSync from '@/hooks/useCartSync';

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Fetch initial cart from backend only if user is logged in
  const { data: initialCart, isSuccess } = useGetCartQuery(undefined, {
    skip: !user,
  });

  // Load initial cart into Redux store
  useEffect(() => {
    if (isSuccess && initialCart) {
      dispatch(setCart(initialCart));
    }
  }, [isSuccess, initialCart, dispatch]);

  useCartSync();

  return (
    <div className="mt-8">
      <ProductList />
    </div>
  );
}
