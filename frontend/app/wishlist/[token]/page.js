'use client';

import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';
import {
  removeItem,
  selectWishlistItems,
  setWishlist,
} from '@/store/wishlistSlice';
import {
  useLazyGetWishlistShareLinkQuery,
  useToggleWishlistMutation,
} from '@/store/api';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const [toggleWishlist] = useToggleWishlistMutation();
  const [fetchShareLink, { isFetching: isFetchingShareLink }] =
    useLazyGetWishlistShareLinkQuery();

  const handleRemove = async (productId) => {
    const previousItems = wishlistItems;
    const item = wishlistItems.find(
      (wishlistItem) => wishlistItem.product?.id === productId,
    );

    dispatch(removeItem(productId));

    try {
      const result = await toggleWishlist(productId).unwrap();
      dispatch(setWishlist(result.items));
      toast.success(
        `${item?.product?.name || 'Item'} removed from your wishlist.`,
      );
    } catch (error) {
      dispatch(setWishlist(previousItems));
      toast.error(error?.data?.message || 'Failed to update wishlist.');
    }
  };

  const handleShare = async () => {
    try {
      const result = await fetchShareLink().unwrap();
      await navigator.clipboard.writeText(result.share_url);
      toast.success('Wishlist share link copied to clipboard.');
    } catch (error) {
      toast.error(
        error?.data?.message || 'Failed to copy wishlist share link.',
      );
    }
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Your Wishlist
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Save products here and share the list with anyone.
          </p>
        </div>
        <button
          type="button"
          onClick={handleShare}
          disabled={isFetchingShareLink}
          className="animated-border rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-60">
          {isFetchingShareLink ? 'Generating link...' : 'Share Wishlist'}
        </button>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="rounded-sm border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Tap the heart on any product to save it for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {wishlistItems.map((item) => (
            <div key={item.product_id} className="space-y-3">
              <ProductCard product={item.product} showAddToCart={false} />
              <button
                type="button"
                onClick={() => handleRemove(item.product_id)}
                className="w-full rounded-sm border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
