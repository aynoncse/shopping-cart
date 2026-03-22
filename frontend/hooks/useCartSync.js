import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSyncCartMutation } from '@/store/api';
import {
  markSyncFailed,
  markSyncStarted,
  markSyncSuccess,
  rollbackToLastSynced,
} from '@/store/cartSlice';

/**
 * Custom hook to synchronize the Redux cart state with the backend API.
 * Uses debouncing for efficient network requests and handles page unload events.
 */
export default function useCartSync() {
  const cartItems = useSelector((state) => state.cart.items);
  const isHydrated = useSelector((state) => state.cart.isHydrated);
  const syncStatus = useSelector((state) => state.cart.syncStatus);
  const token = useSelector((state) => state.auth.token);
  const [syncCart] = useSyncCartMutation();
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);
  const latestCartItemsRef = useRef(cartItems);
  const latestTokenRef = useRef(token);
  const latestHydratedRef = useRef(isHydrated);
  const latestSyncStatusRef = useRef(syncStatus);

  useEffect(() => {
    latestCartItemsRef.current = cartItems;
    latestTokenRef.current = token;
    latestHydratedRef.current = isHydrated;
    latestSyncStatusRef.current = syncStatus;
  }, [cartItems, isHydrated, syncStatus, token]);

  useEffect(() => {
    const flushPendingSync = () => {
      if (
        latestSyncStatusRef.current !== 'dirty' ||
        !latestHydratedRef.current ||
        !latestTokenRef.current
      ) {
        return;
      }

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/cart/sync`,
        {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${latestTokenRef.current}`,
          },
          body: JSON.stringify({
            items: latestCartItemsRef.current.map(
              ({ product_id, quantity }) => ({
                product_id,
                quantity,
              }),
            ),
          }),
        },
      ).catch(() => {});
    };

    window.addEventListener('pagehide', flushPendingSync);
    window.addEventListener('beforeunload', flushPendingSync);

    return () => {
      window.removeEventListener('pagehide', flushPendingSync);
      window.removeEventListener('beforeunload', flushPendingSync);
    };
  }, []);

  useEffect(() => {
    if (!token || !isHydrated) {
      return;
    }

    if (syncStatus !== 'dirty') {
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
        dispatch(rollbackToLastSynced());
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
