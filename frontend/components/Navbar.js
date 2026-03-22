'use client';

import LoginButton from './LoginButton';
import { useSelector } from 'react-redux';
import { useCartDrawer } from '@/context/CartDrawerContext';
import Link from 'next/link';

export default function Navbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { toggleCart } = useCartDrawer();

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex min-h-16 items-center justify-between gap-3 py-2">
          {/* Logo / Brand */}
          <h1 className="site-text text-xl font-bold sm:text-2xl">
            <Link href="/">ShopCart</Link>
          </h1>

          {/* Right side: cart icon + login */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleCart}
              className="site-hover-text relative p-2 text-gray-700 focus:outline-none transition-colors"
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
                strokeLinejoin="round"
                className="w-6 h-6">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
                  {itemCount}
                </span>
              )}
            </button>
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
