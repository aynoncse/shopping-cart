'use client';

import Image from 'next/image';
import { useGetProductsQuery } from '../store/api';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';

export default function ProductList() {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const dispatch = useDispatch();

  if (isLoading)
    return <div className="text-center py-8">Loading products...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error loading products
      </div>
    );

  const handleAddToCart = (product) => {
    dispatch(addItem({ product, quantity: 1 }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product) => (
        <div key={product.id} className="border rounded-lg shadow p-4">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            unoptimized
          />
          <h3 className="text-xl font-semibold mt-3">{product.name}</h3>
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
