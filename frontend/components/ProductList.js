'use client';

import Image from 'next/image';
import { useGetProductsQuery } from '../store/api';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/cartSlice';

export default function ProductList() {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    };
    dispatch(addItem({ product, quantity: 1 }));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg shadow p-4 animate-pulse">
            <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg shadow hover:shadow-lg transition p-4">
          <Image
            width={300}
            height={300}
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-48 object-cover mb-4 rounded"
            loading="lazy"
            unoptimized
          />
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600 mb-4">
            ${product.price}
          </p>
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            onClick={() => handleAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
