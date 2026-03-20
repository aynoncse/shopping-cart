'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCartQuery } from '@/store/api';
import { resetCart, setCart, setHydrated } from '@/store/cartSlice';
import useCartSync from '@/hooks/useCartSync';

export default function CartInitializer({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data: initialCart, isSuccess, isError, isFetching } = useGetCartQuery(undefined, {
    skip: !user,
  });
  useCartSync();

  useEffect(() => {
    if (!user) {
      dispatch(resetCart());
      return;
    }

    if (isFetching) {
      dispatch(setHydrated(false));
      return;
    }

    if (isSuccess && initialCart) {
      dispatch(setCart(initialCart));
      return;
    }

    if (isError) {
      dispatch(setHydrated(true));
    }
  }, [user, isSuccess, isError, isFetching, initialCart, dispatch]);

  return children;
}
