'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { setUser, logout } from '../store/authSlice';

export default function LoginButton() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get the Firebase ID token
      const idToken = await user.getIdToken();

      dispatch(
        setUser({
          user: {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
          },
          token: idToken,
        }),
      );
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();

        dispatch(
          setUser({
            user: {
              uid: user.uid,
              email: user.email,
              name: user.displayName,
            },
            token: idToken,
          }),
        );
      } else {
        dispatch(logout());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-400">Welcome, {user.name}</span>
        <button
          onClick={handleSignOut}
          className="border border-gray-300 rounded-md px-4 py-2 hover:bg-red-500 hover:text-white transition">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
      Sign in with Google
    </button>
  );
}
