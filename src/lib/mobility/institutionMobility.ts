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
import { CampusLocation, LocationCategory, CampusCoordinate } from '@/types/mobility';

const LOCATIONS_COLLECTION = 'campusLocations';

export interface InstitutionLocation extends CampusLocation {
  institutionId: string;
}

export async function addCampusLocation(
  institutionId: string,
  name: string,
  category: LocationCategory,
  coordinates: CampusCoordinate,
  address: string
): Promise<InstitutionLocation> {
  const locationsRef = collection(db, LOCATIONS_COLLECTION);
  const newDocRef = doc(locationsRef);

  const location: InstitutionLocation = {
    id: newDocRef.id,
    institutionId,
    name,
    category,
    coordinates,
    address,
  };

  await setDoc(newDocRef, location);
  return location;
}

export async function getCampusLocationsForInstitution(
  institutionId: string
): Promise<InstitutionLocation[]> {
  const locationsRef = collection(db, LOCATIONS_COLLECTION);
  const q = query(locationsRef, where('institutionId', '==', institutionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data() as InstitutionLocation);
}

export async function deleteCampusLocation(locationId: string): Promise<void> {
  const locationRef = doc(db, LOCATIONS_COLLECTION, locationId);
  await deleteDoc(locationRef);
}
