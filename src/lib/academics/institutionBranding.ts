import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

export async function uploadInstitutionLogo(institutionUid: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please upload a PNG, JPG, WEBP, or SVG image.');
  }
  if (file.size > MAX_LOGO_SIZE_BYTES) {
    throw new Error('Logo must be smaller than 2MB.');
  }

  const fileExt = file.name.split('.').pop();
  const logoRef = ref(storage, `institution-logos/${institutionUid}/logo.${fileExt}`);

  await uploadBytes(logoRef, file);
  const downloadUrl = await getDownloadURL(logoRef);

  await updateDoc(doc(db, 'users', institutionUid), {
    'institutionDetails.logoUrl': downloadUrl,
    updatedAt: new Date().toISOString(),
  });

  return downloadUrl;
}

export async function setInstitutionAccentColor(institutionUid: string, hexColor: string): Promise<void> {
  await updateDoc(doc(db, 'users', institutionUid), {
    'institutionDetails.accentColor': hexColor,
    updatedAt: new Date().toISOString(),
  });
}
