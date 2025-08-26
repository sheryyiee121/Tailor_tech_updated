import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Store user info in localStorage for persistence
      if (user) {
        localStorage.setItem('authToken', user.uid);
        localStorage.setItem('userInfo', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign-out error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOutUser
  };
};
