'use client';
import { useGetProductsQuery } from '../store/api';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/cartSlice';
import Image from 'next/image';

export default function ProductList() {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please sign in to add items to your cart.');
      return;
    }
    dispatch(addItem({ product, quantity: 1 }));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
            <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">
          Failed to load products. Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products?.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
          <div className="aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.image || 'https://via.placeholder.com/400'}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <button
                onClick={() => handleAddToCart(product)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
