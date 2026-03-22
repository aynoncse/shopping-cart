import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

/**
 * The main Redux store configuration combining the RTK Query API, auth, and cart reducers.
 */
export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        cart: cartReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});