import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export interface TimetableEntry {
  id: string;
  institutionId: string;
  className: string;
  day: DayOfWeek;
  startTime: string; // 'HH:MM' 24-hour
  endTime: string;
  subject: string;
  teacherName?: string;
  room?: string;
}

const TIMETABLE_COLLECTION = 'timetable';

export async function addTimetableEntry(
  institutionId: string,
  className: string,
  day: DayOfWeek,
  startTime: string,
  endTime: string,
  subject: string,
  teacherName?: string,
  room?: string
): Promise<TimetableEntry> {
  const timetableRef = collection(db, TIMETABLE_COLLECTION);
  const newDocRef = doc(timetableRef);

  const entry: Omit<TimetableEntry, 'id'> = {
    institutionId,
    className,
    day,
    startTime,
    endTime,
    subject,
    teacherName: teacherName || undefined,
    room: room || undefined,
  };

  await setDoc(newDocRef, entry);
  return { id: newDocRef.id, ...entry };
}

export async function getTimetableForClass(
  institutionId: string,
  className: string
): Promise<TimetableEntry[]> {
  const timetableRef = collection(db, TIMETABLE_COLLECTION);
  const q = query(
    timetableRef,
    where('institutionId', '==', institutionId),
    where('className', '==', className)
  );
  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<TimetableEntry, 'id'>),
  }));

  return entries.sort((a, b) => {
    const dayDiff = DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });
}

export async function deleteTimetableEntry(entryId: string): Promise<void> {
  const entryRef = doc(db, TIMETABLE_COLLECTION, entryId);
  await deleteDoc(entryRef);
}
