'use client';

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSyncCartMutation } from '@/store/api';

export default function useCartSync() {
  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.token);
  const [syncCart] = useSyncCartMutation();
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Check if token exists
    if (!token) return;

    // Cancel previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async() => {
      try {
        await syncCart(cartItems).unwrap();
      } catch (error) {
        console.error('Cart sync failed:', error);
      }
    }, 500);

    return () => {
      // Clear timeout on component unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [cartItems, token, syncCart, dispatch]);
}
