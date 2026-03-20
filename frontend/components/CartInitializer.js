'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCartQuery } from '@/store/api';
import { setCart } from '@/store/cartSlice';
import useCartSync from '@/hooks/useCartSync';

export default function CartInitializer({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data: initialCart, isSuccess } = useGetCartQuery(undefined, {
    skip: !user,
  });
  useCartSync();

  useEffect(() => {
    if (isSuccess && initialCart) {
      dispatch(setCart(initialCart));
    }
  }, [isSuccess, initialCart, dispatch]);

  return children;
}
