'use client';
import { useCartDrawer } from '@/context/CartDrawerContext';
import Cart from './Cart';

export default function CartDrawer() {
  const { isOpen, closeCart } = useCartDrawer();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-100 bg-opacity-75 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close cart">
              &times;
            </button>
          </div>
          <div className="grow overflow-y-auto">
            <Cart />
          </div>
        </div>
      </div>
    </>
  );
}
