'use client';

import LoginButton from './LoginButton';

export default function Navbar() {
  return (
    <nav className="shadow mb-6">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">ShopCart</h1>
        <LoginButton />
      </div>
    </nav>
  );
}