'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
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

// 🔒 Single source of truth for master admin identity.
// Exact match only — no domain-wide or substring grants.
const MASTER_ADMIN_EMAIL = 'admin@onyxstacklabs.com';

function isMasterAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase() === MASTER_ADMIN_EMAIL;
}

function buildDefaultProfile(firebaseUser: FirebaseUser): UserProfile {
  const admin = isMasterAdminEmail(firebaseUser.email);
  const now = new Date().toISOString();
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || (admin ? 'Platform Admin' : 'Student User'),
    photoURL: firebaseUser.photoURL || '',
    role: (admin ? 'ADMIN' : 'STUDENT') as any,
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      notifications: { email: true, push: true },
    },
    createdAt: now,
    updatedAt: now,
  };
}

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

  // Catch the result (and any errors) of a signInWithRedirect flow once,
  // after Google redirects back to the app.
  useEffect(() => {
    getRedirectResult(auth).catch((err: unknown) => {
      const redirectErr = err as { message?: string };
      console.error('[AuthContext] Google redirect sign-in failed:', redirectErr);
      setError(redirectErr.message || 'Google sign-in procedure interrupted');
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    const FIRESTORE_TIMEOUT_MS = 2500;
    const HARD_TIMEOUT_MS = 3500; // stays comfortably above FIRESTORE_TIMEOUT_MS so it never races it

    const hardTimeout = setTimeout(() => {
      if (mounted) {
        setLoading((currentLoading) => {
          if (currentLoading) {
            console.warn('[AuthContext] Session synchronization safety window closed.');
          }
          return false;
        });
      }
    }, HARD_TIMEOUT_MS);

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!mounted) return;

        setUser(firebaseUser);
        setError(null);

        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await withTimeout(
              getDoc(userDocRef),
              FIRESTORE_TIMEOUT_MS,
              'Firestore Profile Fetch'
            );

            if (userDoc.exists()) {
              const data = userDoc.data() as UserProfile;
              // Master admin identity always wins over stale Firestore state,
              // but only for the exact admin account — never by domain or substring.
              if (isMasterAdminEmail(firebaseUser.email)) {
                data.role = 'ADMIN' as any;
              }
              if (mounted) {
                setProfile(data);
                setRole(data.role as UserRole);
              }
            } else {
              const newProfile = buildDefaultProfile(firebaseUser);
              await withTimeout(
                setDoc(userDocRef, newProfile),
                FIRESTORE_TIMEOUT_MS,
                'Firestore Profile Initialization'
              );
              if (mounted) {
                setProfile(newProfile);
                setRole(newProfile.role as UserRole);
              }
            }
          } catch (err: unknown) {
            console.error('[AuthContext] Profile verification error:', err);
            const fallbackProfile = buildDefaultProfile(firebaseUser);
            if (mounted) {
              setProfile(fallbackProfile);
              setRole(fallbackProfile.role as UserRole);
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
      await signInWithRedirect(auth, provider);
      // Execution pauses here — the browser navigates away to Google.
      // Control resumes via getRedirectResult() on the next page load.
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
