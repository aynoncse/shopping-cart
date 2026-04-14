'use client';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import ProductCard from './ProductCard';
import ProductListError from './ProductListError';
import ProductListLoadMore from './ProductListLoadMore';
import toast from 'react-hot-toast';
import {
  addItem as addWishlistItem,
  removeItem as removeWishlistItem,
  selectIsWishlisted,
  setWishlist,
} from '@/store/wishlistSlice';
import { useToggleWishlistMutation } from '@/store/api';

export default function ProductList({ initialProducts, initialMeta }) {
  const { products, isLoadingMore, error, hasMore, loaderRef } =
    useInfiniteProducts({
      initialProducts,
      initialMeta,
    });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [toggleWishlist] = useToggleWishlistMutation();

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('Please sign in to add items to your cart.');
      return;
    }

    dispatch(addItem({ product, quantity: 1 }));
    toast.success(`${product.name} added to your cart.`);
  };

  const handleWishlistToggle = async (product) => {
    if (!user) {
      toast.error('Please sign in to manage your wishlist.');
      return;
    }

    const isWishlisted = wishlistItems.some(
      (item) => item.product?.id === product.id,
    );

    if (isWishlisted) {
      dispatch(removeWishlistItem(product.id));
    } else {
      dispatch(addWishlistItem(product));
    }

    try {
      const result = await toggleWishlist(product.id).unwrap();
      dispatch(setWishlist(result.items));
      toast.success(
        result.added
          ? `${product.name} added to your wishlist.`
          : `${product.name} removed from your wishlist.`,
      );
    } catch (error) {
      if (isWishlisted) {
        dispatch(addWishlistItem(product));
      } else {
        dispatch(removeWishlistItem(product.id));
      }

      toast.error(error?.data?.message || 'Wishlist update failed.');
    }
  };

  if (error) return <ProductListError />;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
          />
        ))}
      </div>

      <ProductListLoadMore
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        loaderRef={loaderRef}
      />
    </>
  );
}

function ProductListItem({ product, onAddToCart, onWishlistToggle }) {
  const isWishlisted = useSelector(selectIsWishlisted(product.id));

  return (
    <ProductCard
      product={product}
      onAddToCart={onAddToCart}
      onWishlistToggle={onWishlistToggle}
      isWishlisted={isWishlisted}
    />
  );
}
