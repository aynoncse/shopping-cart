import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the cart slice.
 * @type {{items: Array, isHydrated: boolean, lastSyncedItems: Array, syncStatus: 'idle'|'syncing'|'dirty'|'error', syncError: string|null}}
 */
const initialState = {
  items: [],
  isHydrated: false,
  lastSyncedItems: [],
  syncStatus: 'idle',
  syncError: null,
};

/**
 * Redux slice for managing the shopping cart state.
 * Supports optimistic updates and debounced synchronization.
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Sets the cart items from the given payload and marks the cart as hydrated.
     * Resets the last synced items, sync status, and sync error.
     * @param {Array} payload The new cart items.
     */
    setCart: (state, action) => {
      state.items = action.payload;
      state.isHydrated = true;
      state.lastSyncedItems = action.payload;
      state.syncStatus = 'idle';
      state.syncError = null;
    },

    /**
     * Resets the cart state to its initial values.
     * This action is useful when the user logs out and we want to clear their cart state.
     */
    resetCart: (state) => {
      state.items = [];
      state.isHydrated = false;
      state.lastSyncedItems = [];
      state.syncStatus = 'idle';
      state.syncError = null;
    },

    /**
     * Sets the isHydrated flag to the given payload value.
     * This flag is used to track whether the cart state has been hydrated from the server.
     * @param {boolean} payload The new value for the isHydrated flag.
     */
    setHydrated: (state, action) => {
      state.isHydrated = action.payload;
    },

    /**
     * Marks the cart state as syncing by setting the syncStatus to 'syncing' and clearing the syncError.
     * This action is used to track the synchronization process of the cart state with the server.
     */
    markSyncStarted: (state) => {
      state.syncStatus = 'syncing';
      state.syncError = null;
    },

    /**
     * Marks the cart state as synchronized successfully by setting the syncStatus to 'idle',
     * updating the cart items and last synced items with the given payload,
     * and clearing the syncError.
     * This action is used to track the successful synchronization of the cart state with the server.
     * @param {Array} payload The new cart items.
     */
    markSyncSuccess: (state, action) => {
      state.items = action.payload;
      state.lastSyncedItems = action.payload;
      state.syncStatus = 'idle';
      state.syncError = null;
    },

    /**
     * Marks the cart state as an error by setting the syncStatus to 'error'
     * and updating the syncError with the given payload.
     * This action is used to track the failed synchronization of the cart state with the server.
     * @param {string|null} payload The error message or null.
     */
    markSyncFailed: (state, action) => {
      state.syncStatus = 'error';
      state.syncError = action.payload;
    },

    /**
     * Rollback the cart state to the last successfully synchronized state.
     * Resets the cart items to the last synced items and marks the cart as idle.
     */
    rollbackToLastSynced: (state) => {
      state.items = state.lastSyncedItems;
      state.syncStatus = 'idle';
    },

    /**
     * Adds a product to the cart with the given quantity.
     * If the product already exists in the cart, increments its quantity.
     * Otherwise, adds a new item to the cart with the given product and quantity.
     * Marks the cart state as "dirty" and clears the sync error.
     * @param {{product: Product, quantity?: number}} payload The product to add and its quantity (default: 1).
     */
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

    /**
     * Increments the quantity of a product in the cart by 1.
     * Marks the cart state as "dirty" and clears the sync error.
     * @param {number} payload The product ID to increment.
     */
    increment: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.product_id === productId);
      if (item) {
        item.quantity += 1;
        state.syncStatus = 'dirty';
        state.syncError = null;
      }
    },

    /**
     * Sets the quantity of a product in the cart.
     * If the quantity is 0 or less, removes the product from the cart.
     * Marks the cart state as "dirty" and clears the sync error.
     * @param {{productId: number, quantity: number}} payload The product ID and its new quantity.
     */
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

    /**
     * Decrements the quantity of a product in the cart by 1.
     * If the quantity is 1, removes the product from the cart.
     * Marks the cart state as "dirty" and clears the sync error.
     * @param {number} payload The product ID to decrement.
     */
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

/*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Removes a product from the cart.
     * Marks the cart state as "dirty" and clears the sync error.
     * @param {number} payload The product ID to remove.
     */
/*******  abbecc33-7655-489d-b34d-18692dc6f598  *******/
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
