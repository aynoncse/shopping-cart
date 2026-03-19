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
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
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
          <div className="flex-1 overflow-y-auto p-5">
            <Cart />
          </div>

          <div className="border-t border-gray-200 p-5">
            <div className="flex justify-between text-lg font-semibold text-gray-800 mb-4">
              <span>Total</span>
              <CartTotal />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
