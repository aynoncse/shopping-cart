'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetWishlistQuery } from '@/store/api';
import { resetWishlist, setWishlist } from '@/store/wishlistSlice';

export default function WishlistInitializer({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    data: initialWishlist,
    isSuccess,
    isError,
  } = useGetWishlistQuery(undefined, {
    skip: !user,
  });

  useEffect(() => {
    if (!user) {
      dispatch(resetWishlist());
      return;
    }

    if (isSuccess) {
      dispatch(setWishlist(initialWishlist || []));
      return;
    }

    if (isError) {
      dispatch(setWishlist([]));
    }
  }, [user, isSuccess, isError, initialWishlist, dispatch]);

  return children;
}
