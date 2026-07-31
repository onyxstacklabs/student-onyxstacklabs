import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TripSession, CampusCoordinate } from '@/types/mobility';

const TRIPS_COLLECTION = 'evTrips';

export async function createTrip(
  studentUid: string,
  studentName: string,
  institutionId: string | undefined,
  batteryPercentage?: number
): Promise<TripSession> {
  const tripsRef = collection(db, TRIPS_COLLECTION);
  const newDocRef = doc(tripsRef);

  const trip: TripSession = {
    id: newDocRef.id,
    studentUid,
    studentName,
    institutionId,
    startTime: new Date().toISOString(),
    distanceCoveredKm: 0,
    status: 'active',
    averageSpeedKmh: 0,
    currentSpeedKmh: 0,
    waypoints: [],
    batteryPercentage,
  };

  await setDoc(newDocRef, { ...trip, updatedAt: serverTimestamp() });
  return trip;
}

export async function updateTripProgress(
  tripId: string,
  distanceCoveredKm: number,
  averageSpeedKmh: number,
  currentSpeedKmh: number,
  waypoints: CampusCoordinate[]
): Promise<void> {
  const tripRef = doc(db, TRIPS_COLLECTION, tripId);
  await updateDoc(tripRef, {
    distanceCoveredKm,
    averageSpeedKmh,
    currentSpeedKmh,
    waypoints,
    updatedAt: serverTimestamp(),
  });
}

export async function endTrip(tripId: string): Promise<void> {
  const tripRef = doc(db, TRIPS_COLLECTION, tripId);
  await updateDoc(tripRef, {
    status: 'completed',
    endTime: new Date().toISOString(),
    updatedAt: serverTimestamp(),
  });
}

export async function getTripHistoryForStudent(studentUid: string): Promise<TripSession[]> {
  const tripsRef = collection(db, TRIPS_COLLECTION);
  const q = query(
    tripsRef,
    where('studentUid', '==', studentUid),
    orderBy('startTime', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data() as TripSession);
}

export async function getActiveTripsForInstitution(institutionId: string): Promise<TripSession[]> {
  const tripsRef = collection(db, TRIPS_COLLECTION);
  const q = query(
    tripsRef,
    where('institutionId', '==', institutionId),
    where('status', '==', 'active')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data() as TripSession);
}
