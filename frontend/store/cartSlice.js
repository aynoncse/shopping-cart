import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
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

export const { setCart, addItem, increment, decrement, removeItem } = cartSlice.actions;
export default cartSlice.reducer;