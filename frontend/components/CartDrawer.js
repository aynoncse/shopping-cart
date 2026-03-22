'use client';
import { useCartDrawer } from '@/context/CartDrawerContext';
import Cart from './Cart';
import { useSelector } from 'react-redux';

export default function CartDrawer() {
  const { isOpen, closeCart } = useCartDrawer();

  return (
    <>
      {/* Backdrop*/}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full bg-white shadow-2xl transition-transform duration-300 ease-out sm:w-96 ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:p-5">
            <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">Your Cart</h2>
            <button
              onClick={closeCart}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Close cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cart items*/}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:p-5">
            <Cart />
          </div>

          <div className="border-t border-gray-200 px-4 py-4 sm:p-5">
            <div className="mb-4 flex justify-between text-base font-semibold text-gray-800 sm:text-lg">
              <span>Total</span>
              <CartTotal />
            </div>
            <button
              className="site-bg site-bg-hover site-ring w-full rounded-lg py-3 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              disabled 
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Shipping and taxes calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function CartTotal() {
  const cartItems = useSelector((state) => state.cart.items);
  const total = cartItems.reduce((sum, item) => {
    const price = item.product?.price;
    return price ? sum + price * item.quantity : sum;
  }, 0);
  return <span>${total.toFixed(2)}</span>;
}
