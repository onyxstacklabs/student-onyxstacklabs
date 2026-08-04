import { collection, doc, getDocs, updateDoc, setDoc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  UserProfile,
  InstitutionAccountStatus,
  InstitutionSubscriptionTier,
  BillingCycle,
  BillingCurrency,
} from '@/types/auth';

export interface AdminInstitutionView {
  uid: string;
  institutionName: string;
  contactEmail: string;
  accountStatus: InstitutionAccountStatus;
  subscriptionTier: InstitutionSubscriptionTier;
  billingCycle: BillingCycle;
  billingCurrency: BillingCurrency;
  customPriceAmount?: number;
}

export async function listAllInstitutionsForAdmin(): Promise<AdminInstitutionView[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', 'INSTITUTION'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as UserProfile;
    return {
      uid: docSnap.id,
      institutionName: data.institutionDetails?.institutionName || 'Unnamed Institution',
      contactEmail: data.institutionDetails?.contactEmail || data.email,
      accountStatus: data.institutionDetails?.accountStatus || 'ACTIVE',
      subscriptionTier: data.institutionDetails?.subscriptionTier || 'free',
      billingCycle: data.institutionDetails?.billingCycle || 'monthly',
      billingCurrency: data.institutionDetails?.billingCurrency || 'PKR',
      customPriceAmount: data.institutionDetails?.customPriceAmount,
    };
  });
}

export async function renameInstitution(institutionUid: string, newName: string): Promise<void> {
  await updateDoc(doc(db, 'users', institutionUid), {
    'institutionDetails.institutionName': newName,
    updatedAt: new Date().toISOString(),
  });
}

export async function setInstitutionStatus(
  institutionUid: string,
  status: InstitutionAccountStatus
): Promise<void> {
  await updateDoc(doc(db, 'users', institutionUid), {
    'institutionDetails.accountStatus': status,
    updatedAt: new Date().toISOString(),
  });
}

export async function setInstitutionTier(
  institutionUid: string,
  tier: InstitutionSubscriptionTier
): Promise<void> {
  await updateDoc(doc(db, 'users', institutionUid), {
    'institutionDetails.subscriptionTier': tier,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Sets billing terms for an institution — cycle, currency, and an optional
 * custom negotiated price. Pass customPriceAmount as null to clear an
 * override and fall back to default tier pricing.
 */
export async function setInstitutionBilling(
  institutionUid: string,
  billingCycle: BillingCycle,
  billingCurrency: BillingCurrency,
  customPriceAmount: number | null
): Promise<void> {
  await updateDoc(doc(db, 'users', institutionUid), {
    'institutionDetails.billingCycle': billingCycle,
    'institutionDetails.billingCurrency': billingCurrency,
    'institutionDetails.customPriceAmount': customPriceAmount,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Super Admin manually onboards an institution (e.g., for orgs that don't self-register).
 * Note: this creates the Firebase Auth account too — the temporary password
 * must be shared with the institution securely so they can log in and change it.
 */
export async function createInstitutionByAdmin(
  displayName: string,
  email: string,
  temporaryPassword: string,
  institutionName: string,
  address: string,
  contactEmail: string,
  contactNumber: string
): Promise<void> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, temporaryPassword);
  const user = userCredential.user;

  const newProfile: UserProfile = {
    uid: user.uid,
    email: user.email || email,
    displayName,
    role: 'INSTITUTION',
    institutionDetails: {
      institutionName,
      address,
      contactEmail,
      contactNumber,
      classes: [],
      semesters: [],
      accountStatus: 'ACTIVE',
      subscriptionTier: 'free',
      billingCycle: 'monthly',
      billingCurrency: 'PKR',
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      notifications: { email: true, push: true },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', user.uid), newProfile);
}
