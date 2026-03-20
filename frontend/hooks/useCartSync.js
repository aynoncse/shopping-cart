import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSyncCartMutation } from '@/store/api';
import { markSyncFailed, markSyncStarted, markSyncSuccess } from '@/store/cartSlice';

export default function useCartSync() {
  const cartItems = useSelector((state) => state.cart.items);
  const isHydrated = useSelector((state) => state.cart.isHydrated);
  const syncStatus = useSelector((state) => state.cart.syncStatus);
  const token = useSelector((state) => state.auth.token);
  const [syncCart] = useSyncCartMutation();
  const dispatch = useDispatch();
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

    if (syncStatus !== 'dirty') {
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
        dispatch(markSyncStarted());
        const syncedItems = await syncCart(cartItems).unwrap();
        dispatch(markSyncSuccess(syncedItems));
      } catch (error) {
        dispatch(markSyncFailed(error?.data?.message || 'Cart sync failed.'));
        console.error('Cart sync failed:', error);
      }
    }, 500);

    return () => {
      // Clear timeout on component unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cartItems, dispatch, isHydrated, syncCart, syncStatus, token]);
}
