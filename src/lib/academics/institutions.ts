import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface InstitutionOption {
  uid: string;
  institutionName: string;
}

export interface InstitutionContact {
  institutionName: string;
  contactEmail: string;
  contactNumber: string;
  address: string;
}

export async function listInstitutions(): Promise<InstitutionOption[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', 'INSTITUTION'));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        institutionName: data?.institutionDetails?.institutionName || 'Unnamed Institution',
      };
    })
    .sort((a, b) => a.institutionName.localeCompare(b.institutionName));
}

export async function getInstitutionContact(institutionId: string): Promise<InstitutionContact | null> {
  const docRef = doc(db, 'users', institutionId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;

  const details = docSnap.data()?.institutionDetails;
  if (!details) return null;

  return {
    institutionName: details.institutionName || '',
    contactEmail: details.contactEmail || '',
    contactNumber: details.contactNumber || '',
    address: details.address || '',
  };
}
