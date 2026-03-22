'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, googleProvider } from '../lib/firebase';
import { onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';
import { setUser, logout } from '../store/authSlice';

export default function LoginButton() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
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
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden text-sm text-gray-400 sm:inline">
          Welcome, {user.name}
        </span>
        <button
          onClick={handleSignOut}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-red-500 hover:text-white transition sm:px-4">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="site-bg site-bg-hover rounded-md px-3 py-2 text-sm text-white transition sm:px-6">
      Sign in with Google
    </button>
  );
}
