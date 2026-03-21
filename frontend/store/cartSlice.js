import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isHydrated: false,
  lastSyncedItems: [],
  syncStatus: 'idle',
  syncError: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      state.isHydrated = true;
      state.lastSyncedItems = action.payload;
      state.syncStatus = 'idle';
      state.syncError = null;
    },

    resetCart: (state) => {
      state.items = [];
      state.isHydrated = false;
      state.lastSyncedItems = [];
      state.syncStatus = 'idle';
      state.syncError = null;
    },

    setHydrated: (state, action) => {
      state.isHydrated = action.payload;
    },

    markSyncStarted: (state) => {
      state.syncStatus = 'syncing';
      state.syncError = null;
    },

    markSyncSuccess: (state, action) => {
      state.items = action.payload;
      state.lastSyncedItems = action.payload;
      state.syncStatus = 'idle';
      state.syncError = null;
    },

    markSyncFailed: (state, action) => {
      state.syncStatus = 'error';
      state.syncError = action.payload;
    },

    rollbackToLastSynced: (state) => {
      state.items = state.lastSyncedItems;
      state.syncStatus = 'idle';
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

      state.syncStatus = 'dirty';
      state.syncError = null;
    },

    increment: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.product_id === productId);
      if (item) {
        item.quantity += 1;
        state.syncStatus = 'dirty';
        state.syncError = null;
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
        state.syncStatus = 'dirty';
        state.syncError = null;
        return;
      }

      item.quantity = quantity;
      state.syncStatus = 'dirty';
      state.syncError = null;
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

        state.syncStatus = 'dirty';
        state.syncError = null;
      }
    },

    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product_id !== productId);
      state.syncStatus = 'dirty';
      state.syncError = null;
    },
  },
});

export const {
  setCart,
  resetCart,
  setHydrated,
  markSyncStarted,
  markSyncSuccess,
  markSyncFailed,
  rollbackToLastSynced,
  addItem,
  increment,
  setQuantity,
  decrement,
  removeItem,
} = cartSlice.actions;
export default cartSlice.reducer;
