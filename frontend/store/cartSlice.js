import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isHydrated: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      state.isHydrated = true;
    },

    resetCart: (state) => {
      state.items = [];
      state.isHydrated = false;
    },

    setHydrated: (state, action) => {
      state.isHydrated = action.payload;
    },

    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: -Date.now(), // temporary
          product_id: product.id,
          quantity,
          product,
        });
      }
    },

    increment: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.product_id === productId);
      if (item) {
        item.quantity += 1;
      }
    },

    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product_id === productId);

      if (!item) {
        return;
      }

      if (quantity <= 0) {
        state.items = state.items.filter((cartItem) => cartItem.product_id !== productId);
        return;
      }

      item.quantity = quantity;
    },

    decrement: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.product_id === productId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.product_id !== productId);
        }
      }
    },

    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product_id !== productId);
    },
  },
});

export const { setCart, resetCart, setHydrated, addItem, increment, setQuantity, decrement, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
