import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
    getUser: builder.query({
      query: () => '/v1/user',
    }),

    getProducts: builder.query({
      query: () => '/v1/products',
      providesTags: ['Products'],
    }),

    getCart: builder.query({
      query: () => '/v1/cart',
      providesTags: ['Cart'],
    }),

    syncCart: builder.mutation({
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
    }),
  }),
});

export const { useGetUserQuery, useGetProductsQuery, useGetCartQuery, useSyncCartMutation } = api;