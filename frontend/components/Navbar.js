'use client';

import LoginButton from './LoginButton';
import { useSelector } from 'react-redux';
import { useCartDrawer } from '@/context/CartDrawerContext';

export default function Navbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { toggleCart } = useCartDrawer();

  return (
    <nav className=" mb-6">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">ShopCart</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleCart}
            className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            aria-label="Open cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}
