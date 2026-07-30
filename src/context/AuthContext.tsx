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

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} operational window exceeded (${ms}ms)`)), ms)
    ),
  ]);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Hard fallback: Safety window to prevent indefinite UI lock
    const hardTimeout = setTimeout(() => {
      if (mounted) {
        setLoading((currentLoading) => {
          if (currentLoading) {
            console.warn('[AuthContext] Session synchronization safety window closed.');
          }
          return false;
        });
      }
    }, 2500);

    // Attach Auth Listener
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!mounted) return;

        setUser(firebaseUser);
        setError(null);

        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await withTimeout(getDoc(userDocRef), 2500, 'Firestore Profile Fetch');

            if (userDoc.exists()) {
              if (mounted) setProfile(userDoc.data() as UserProfile);
            } else {
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'Student',
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
              await withTimeout(setDoc(userDocRef, newProfile), 2500, 'Firestore Profile Initialization');
              if (mounted) setProfile(newProfile);
            }
          } catch (err: unknown) {
            console.error('[AuthContext] Profile verification error:', err);
            if (mounted) {
              setProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'Student',
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
          }
        } else {
          if (mounted) setProfile(null);
        }

        clearTimeout(hardTimeout);
        if (mounted) setLoading(false);
      },
      (err) => {
        console.error('[AuthContext] Authentication state handler failure:', err);
        clearTimeout(hardTimeout);
        if (mounted) {
          setError(err.message || 'Identity service unavailable');
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(hardTimeout);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err: unknown) {
      console.error('[AuthContext] Logout failed:', err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const authErr = err as { message?: string };
      console.error('[AuthContext] Google sign-in failed:', authErr);
      setError(authErr.message || 'Google sign-in procedure interrupted');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
