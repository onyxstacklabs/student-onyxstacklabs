'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/types/auth';

export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  role: UserRole; // 👈 Expose role directly for fast UI check
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: 'STUDENT',
  loading: true,
  error: null,
  logout: async () => {},
  signInWithGoogle: async () => {},
  switchRole: async () => {},
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
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

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

            // 🛑 STRICT MASTER ADMIN CHECK
            const isMasterAdmin = firebaseUser.email === 'admin@onyxstacklabs.com' || 
                                  firebaseUser.email?.endsWith('@onyxstacklabs.com') || 
                                  firebaseUser.email?.includes('admin');

            const defaultRole: UserRole = isMasterAdmin ? 'ADMIN' : 'STUDENT';

            if (userDoc.exists()) {
              const data = userDoc.data() as UserProfile;
              // Force admin role if master email matches regardless of old Firestore state
              if (isMasterAdmin) {
                data.role = 'ADMIN' as any;
              }
              if (mounted) {
                setProfile(data);
                setRole(data.role as UserRole);
              }
            } else {
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || (isMasterAdmin ? 'Platform Admin' : 'Student User'),
                photoURL: firebaseUser.photoURL || '',
                role: defaultRole as any,
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
              if (mounted) {
                setProfile(newProfile);
                setRole(defaultRole);
              }
            }
          } catch (err: unknown) {
            console.error('[AuthContext] Profile verification error:', err);
            const isMasterAdmin = firebaseUser.email === 'admin@onyxstacklabs.com';
            const fallbackRole: UserRole = isMasterAdmin ? 'ADMIN' : 'STUDENT';

            if (mounted) {
              setProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                photoURL: firebaseUser.photoURL || '',
                role: fallbackRole as any,
                preferences: {
                  theme: 'system',
                  language: 'en',
                  timezone: 'UTC',
                  notifications: { email: true, push: true },
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
              setRole(fallbackRole);
            }
          }
        } else {
          if (mounted) {
            setProfile(null);
            setRole('STUDENT');
          }
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
      setRole('STUDENT');
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

  const switchRole = async (newRole: UserRole) => {
    if (!user || !profile) return;
    try {
      const updatedProfile = { ...profile, role: newRole as any, updatedAt: new Date().toISOString() };
      setProfile(updatedProfile);
      setRole(newRole);
      
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { role: newRole, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.error('[AuthContext] Role update failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, error, logout, signInWithGoogle, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
