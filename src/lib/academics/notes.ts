import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Note {
  id: string;
  ownerUid: string;
  title: string;
  category: string;
  content: string;
  createdAt?: Timestamp;
}

const NOTES_COLLECTION = 'notes';

export async function getNotesForUser(uid: string): Promise<Note[]> {
  const notesRef = collection(db, NOTES_COLLECTION);
  const q = query(
    notesRef,
    where('ownerUid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Note, 'id'>),
  }));
}

export async function createNote(
  uid: string,
  title: string,
  category: string,
  content: string
): Promise<Note> {
  const notesRef = collection(db, NOTES_COLLECTION);
  const newDocRef = doc(notesRef);

  const newNote = {
    ownerUid: uid,
    title,
    category,
    content,
    createdAt: serverTimestamp(),
  };

  await setDoc(newDocRef, newNote);

  return {
    id: newDocRef.id,
    ...newNote,
    createdAt: Timestamp.now(), // local optimistic value until refetch
  };
}

export async function deleteNote(noteId: string): Promise<void> {
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  await deleteDoc(noteRef);
}
