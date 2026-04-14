import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isHydrated: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
      state.isHydrated = true;
    },
    addItem: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item.product?.id === product.id);

      if (!exists) {
        state.items.push({
          id: -Date.now(),
          product_id: product.id,
          product,
        });
      }
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product?.id !== productId);
    },
    resetWishlist: (state) => {
      state.items = [];
      state.isHydrated = false;
    },
  },
});

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((item) => item.product?.id === productId);
export const selectWishlistCount = (state) => state.wishlist.items.length;

export const { setWishlist, addItem, removeItem, resetWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
