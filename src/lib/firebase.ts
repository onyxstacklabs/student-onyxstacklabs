import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  browserLocalPersistence, 
  browserSessionPersistence, 
  indexedDBLocalPersistence 
} from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// App Initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth Initialization with Safe Fallback & Hot-Reload Prevention
const auth = (() => {
  if (typeof window === 'undefined') {
    return getAuth(app);
  }
  
  // Mobile / Browser persistence fix
  try {
    return initializeAuth(app, {
      persistence: [browserLocalPersistence, browserSessionPersistence, indexedDBLocalPersistence],
    });
  } catch (e) {
    // Agar auth pehle se initialize ho chuka ho (Next.js re-render/HMR)
    return getAuth(app);
  }
})();

// Firestore Initialization
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

const storage = getStorage(app);

export { app, auth, db, storage };
