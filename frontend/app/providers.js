'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { CartDrawerProvider } from '@/context/CartDrawerContext';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <CartDrawerProvider>{children}</CartDrawerProvider>
    </Provider>
  );
}
