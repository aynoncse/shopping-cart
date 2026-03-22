import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query API service for communicating with the backend API.
 * Handles fetching products, retrieving the cart, and synchronizing the cart.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Cart', 'Products'],
  endpoints: (builder) => ({
    /**
     * Fetches a paginated list of products from the backend API.
     */
    getProducts: builder.query({
      query: ({ page = 1, per_page = 12 } = {}) => `/v1/products?page=${page}&per_page=${per_page}`,
      
      /**
       * Transforms the response from the backend API into a format that is
       * usable by the application.
       */
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ['Products'],
    }),

    /**
     * Retrieves the cart from the backend API.
     */
    getCart: builder.query({
      query: () => '/v1/cart',
      transformResponse: (response) => response.data,
      providesTags: ['Cart'],
    }),

    /**
     * Synchronizes the cart with the backend API.
     *
     * @param {Array<{ product_id: number, quantity: number }>} cartItems - The cart items to synchronize.
     * @returns {Object} - The response from the backend API.
     */
    syncCart: builder.mutation({
      /**
       * The query options for synchronizing the cart with the backend API.
       */
      query: (cartItems) => ({
        url: '/v1/cart/sync',
        method: 'POST',
        body: {
          items: cartItems.map(({ product_id, quantity }) => ({
            product_id,
            quantity,
          })),
        },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetCartQuery,
  useSyncCartMutation,
} = api;
