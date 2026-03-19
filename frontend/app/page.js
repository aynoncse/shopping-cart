'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductList from '@/components/ProductList';
import Cart from '@/components/Cart';
import { useGetCartQuery } from '@/store/api';
import { setCart } from '@/store/cartSlice';
import useCartSync from '@/hooks/useCartSync';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <>
      {user ? (
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <div className="flex-1">
            <ProductList />
          </div>
          <div className="md:w-1/3">
            <Cart />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 mt-8">
            <ProductList />
        </div>
      )}
    </>
  );
}
