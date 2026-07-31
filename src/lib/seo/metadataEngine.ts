import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PageSeoMetadata {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  noIndex: boolean;
}

const SEO_COLLECTION = 'seoMetadata';

export async function getSeoMetadata(slug: string): Promise<PageSeoMetadata | null> {
  const docRef = doc(db, SEO_COLLECTION, slug);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as PageSeoMetadata;
}

export async function saveSeoMetadata(data: PageSeoMetadata): Promise<void> {
  const docRef = doc(db, SEO_COLLECTION, data.slug);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
