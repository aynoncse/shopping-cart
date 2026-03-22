'use client';
import { createContext, useContext, useState } from 'react';

/**
 * Context for managing the visibility state of the cart side-drawer.
 */
const CartDrawerContext = createContext();

/**
 * Provider component that wraps the application and exposes cart drawer state.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function CartDrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  return (
    <CartDrawerContext.Provider
      value={{ isOpen, openCart, closeCart, toggleCart }}>
      {children}
    </CartDrawerContext.Provider>
  );
}

/**
 * Custom hook to access the cart drawer context.
 * @returns {{isOpen: boolean, openCart: function, closeCart: function, toggleCart: function}}
 * @throws {Error} If used outside of a CartDrawerProvider.
 */
export function useCartDrawer() {
  const context = useContext(CartDrawerContext);
  if (context === undefined) {
    throw new Error('useCartDrawer must be used within a CartDrawerProvider');
  }
  return context;
}
