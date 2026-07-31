import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type SOSStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface SOSAlert {
  id: string;
  institutionId: string;
  studentUid: string;
  studentName: string;
  className: string;
  rollNumber: string;
  status: SOSStatus;
  message?: string;
  createdAt?: Timestamp;
}

const SOS_COLLECTION = 'emergencyAlerts';

export async function triggerSOS(
  institutionId: string,
  studentUid: string,
  studentName: string,
  className: string,
  rollNumber: string,
  message?: string
): Promise<SOSAlert> {
  const sosRef = collection(db, SOS_COLLECTION);
  const newDocRef = doc(sosRef);

  const alert = {
    institutionId,
    studentUid,
    studentName,
    className,
    rollNumber,
    status: 'ACTIVE' as SOSStatus,
    message: message || undefined,
    createdAt: serverTimestamp(),
  };

  await setDoc(newDocRef, alert);

  return { id: newDocRef.id, ...alert, createdAt: Timestamp.now() };
}

export async function getActiveSOSForInstitution(institutionId: string): Promise<SOSAlert[]> {
  const sosRef = collection(db, SOS_COLLECTION);
  const q = query(
    sosRef,
    where('institutionId', '==', institutionId),
    where('status', 'in', ['ACTIVE', 'ACKNOWLEDGED']),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<SOSAlert, 'id'>),
  }));
}

export async function updateSOSStatus(alertId: string, status: SOSStatus): Promise<void> {
  const alertRef = doc(db, SOS_COLLECTION, alertId);
  await updateDoc(alertRef, { status });
}
