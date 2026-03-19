'use client';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, removeItem } from '../store/cartSlice';

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items) || [];
  const dispatch = useDispatch();

  // Calculate total price
  const total = cartItems.reduce((sum, item) => {
    const price = item.product?.price;
    return price ? sum + price * item.quantity : sum;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-500">Your cart is empty.</p>
        <p className="text-sm text-gray-400 mt-2">
          Add some products from the list!
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.product_id}
            className="flex justify-between items-center border-b pb-2">
            <div className="flex-1">
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-sm text-gray-600">
                ${item.product.price} x {item.quantity}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => dispatch(decrement(item.product_id))}
                className="border px-2 py-1 rounded hover:bg-gray-100"
                aria-label="Decrease quantity">
                -
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => dispatch(increment(item.product_id))}
                className="border px-2 py-1 rounded hover:bg-gray-100"
                aria-label="Increase quantity">
                +
              </button>
              <button
                onClick={() => dispatch(removeItem(item.product_id))}
                className="text-red-500 ml-2 hover:text-red-700"
                aria-label="Remove item">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-2 border-t font-bold flex justify-between">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
