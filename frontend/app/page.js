'use client';
import LoginButton from '@/components/LoginButton';
import { useGetUserQuery } from '@/store/api';
import { useSelector } from 'react-redux';

export default function Home() {
  const { user, token } = useSelector((state) => state.auth);
  const {
    data: userData,
    error,
    isLoading,
  } = useGetUserQuery(undefined, {
    skip: !token,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart System</h1>
      <LoginButton />

      {token && (
        <div className="mt-4">
          <h2>Backend User Info:</h2>
          {isLoading && <p>Loading...</p>}
          {error && (
            <p className="text-red-500">Error: {JSON.stringify(error)}</p>
          )}
          {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
}
