'use client';
import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function LoginButton() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get the Firebase ID token
      const idToken = await user.getIdToken();

      setUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      });
      setToken(idToken);

      console.log('Token:', idToken); // You'll see this in the console
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  useEffect(() => {
    if (token) {
      // Example fetch to your Laravel backend
      fetch('http://localhost:8000/api/v1/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => console.log('User from backend:', data))
        .catch((err) => console.error('API error:', err));
    }
  }, [token]);

  // Inside the component:
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        });
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
  };

  if (user) {
    return (
      <div>
        <p className='mb-1'>Welcome, {user.name}</p>
        <button onClick={handleSignOut} className='border rounded-md px-3 py-1'>Sign Out</button>
      </div>
    );
  }

  return (
    <button onClick={handleSignIn} className="border rounded-md px-3 py-1">
      Sign in with Google
    </button>
  );
}
