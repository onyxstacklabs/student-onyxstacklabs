import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface AttendanceRecord {
  id: string;
  institutionId: string;
  studentUid: string;
  className: string;
  subject: string;
  status: AttendanceStatus;
  date: string; // 'YYYY-MM-DD'
  markedAt?: Timestamp;
}

const ATTENDANCE_COLLECTION = 'attendance';

export async function markAttendance(
  institutionId: string,
  studentUid: string,
  className: string,
  subject: string,
  status: AttendanceStatus,
  date: string
): Promise<void> {
  // One record per student+subject+date — deterministic doc id prevents duplicates.
  const docId = `${institutionId}_${studentUid}_${subject}_${date}`;
  const recordRef = doc(db, ATTENDANCE_COLLECTION, docId);

  await setDoc(recordRef, {
    institutionId,
    studentUid,
    className,
    subject,
    status,
    date,
    markedAt: serverTimestamp(),
  });
}

export async function getAttendanceForStudent(
  studentUid: string
): Promise<AttendanceRecord[]> {
  const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
  const q = query(
    attendanceRef,
    where('studentUid', '==', studentUid),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<AttendanceRecord, 'id'>),
  }));
}

export async function getAttendanceForClass(
  institutionId: string,
  className: string,
  date: string
): Promise<AttendanceRecord[]> {
  const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
  const q = query(
    attendanceRef,
    where('institutionId', '==', institutionId),
    where('className', '==', className),
    where('date', '==', date)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<AttendanceRecord, 'id'>),
  }));
}

export function calculateAttendancePercentage(records: AttendanceRecord[]): number {
  if (records.length === 0) return 0;
  const presentCount = records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
  return Math.round((presentCount / records.length) * 100);
}
