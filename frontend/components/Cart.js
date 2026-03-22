'use client';
import { useSelector, useDispatch } from 'react-redux';
import {
  increment,
  decrement,
  removeItem,
  setQuantity,
} from '../store/cartSlice';
import Image from 'next/image';

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleQuantityChange = (productId, value) => {
    const quantity = Number.parseInt(value, 10);

    if (Number.isNaN(quantity)) {
      return;
    }

    dispatch(setQuantity({ productId, quantity }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="w-20 h-20 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="text-gray-500 font-medium">Your cart is empty</p>
        <p className="text-sm text-gray-400 mt-1">
          Add some products to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <div
          key={item.product_id}
          className="flex items-start gap-3 border-b border-gray-100 pb-4 last:border-0">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-16 sm:w-16">
            {item.product?.image ? (
              <Image
                src={item.product.image}
                alt={item.product?.name || 'Cart item'}
                fill
                sizes="(max-width: 640px) 56px, 64px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                No image
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-800 truncate">
              {item.product?.name}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              ${item.product?.price?.toFixed(2)} each
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => dispatch(decrement(item.product_id))}
                className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition"
                aria-label="Decrease quantity">
                -
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={item.quantity}
                onChange={(event) =>
                  handleQuantityChange(item.product_id, event.target.value)
                }
                className="h-8 w-14 rounded border border-gray-300 px-2 text-center text-sm font-medium text-gray-800 sm:w-16"
                aria-label={`Quantity for ${item.product?.name || 'cart item'}`}
              />
              <button
                onClick={() => dispatch(increment(item.product_id))}
                className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition"
                aria-label="Increase quantity">
                +
              </button>
              <button
                onClick={() => dispatch(removeItem(item.product_id))}
                className="text-sm font-medium text-red-500 hover:text-red-700 sm:ml-auto"
                aria-label="Remove item">
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
