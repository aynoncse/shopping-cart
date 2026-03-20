import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSyncCartMutation } from '@/store/api';

export default function useCartSync() {
  const cartItems = useSelector((state) => state.cart.items);
  const isHydrated = useSelector((state) => state.cart.isHydrated);
  const token = useSelector((state) => state.auth.token);
  const [syncCart] = useSyncCartMutation();
  const timeoutRef = useRef(null);
  const skipNextSyncRef = useRef(false);

  useEffect(() => {
    if (!token || !isHydrated) {
      skipNextSyncRef.current = false;
      return;
    }

    skipNextSyncRef.current = true;
  }, [token, isHydrated]);

  useEffect(() => {
    if (!token || !isHydrated) {
      return;
    }

    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
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
    };
  }, [cartItems, isHydrated, token, syncCart]);
}
