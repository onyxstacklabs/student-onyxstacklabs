'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/types/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  logout: async () => {},
  signInWithGoogle: async () => {},
});

// Helper: race any promise against a timeout so a slow/hung Firestore call can never freeze UI
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure execution happens strictly on the client side
    if (typeof window === 'undefined') return;

    // Hard limit safety net: 3 seconds maximum loading time
    const safetyTimeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.warn('Auth check taking longer than expected — forcing loading to false.');
        }
        return false;
      });
    }, 3000);

    let unsubscribe: () => void = () => {};

    try {
      unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          clearTimeout(safetyTimeout);
          setUser(firebaseUser);
          setError(null);

          if (firebaseUser) {
            try {
              const userDocRef = doc(db, 'users', firebaseUser.uid);
              const userDoc = await withTimeout(getDoc(userDocRef), 4000, 'Firestore getDoc');

              if (userDoc.exists()) {
                setProfile(userDoc.data() as UserProfile);
              } else {
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || 'User',
                  photoURL: firebaseUser.photoURL || '',
                  role: 'STUDENT',
                  preferences: {
                    theme: 'system',
                    language: 'en',
                    timezone: 'UTC',
                    notifications: { email: true, push: true },
                  },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                await withTimeout(setDoc(userDocRef, newProfile), 4000, 'Firestore setDoc');
                setProfile(newProfile);
              }
            } catch (err: any) {
              console.error('Firestore fallback engaged:', err);
              // Fallback local profile state if Firestore fetch fails/hangs
              setProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                photoURL: firebaseUser.photoURL || '',
                role: 'STUDENT',
                preferences: {
                  theme: 'system',
                  language: 'en',
                  timezone: 'UTC',
                  notifications: { email: true, push: true },
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }
          } else {
            setProfile(null);
          }

          setLoading(false);
        },
        (err) => {
          console.error('Auth Listener Error:', err);
          clearTimeout(safetyTimeout);
          setError(err.message || 'Authentication error');
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.error('Failed to attach auth listener:', err);
      clearTimeout(safetyTimeout);
      setLoading(false);
    }

    return () => {
      clearTimeout(safetyTimeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
