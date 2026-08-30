import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB raw upload limit (before compression)
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const TARGET_DIMENSION = 200; // resize to 200x200 max before storing

/** Resizes and compresses an image in the browser, returning a base64 data URI. */
function compressImageToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > TARGET_DIMENSION) {
            height = Math.round((height * TARGET_DIMENSION) / width);
            width = TARGET_DIMENSION;
          }
        } else {
          if (height > TARGET_DIMENSION) {
            width = Math.round((width * TARGET_DIMENSION) / height);
            height = TARGET_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not process image.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // JPEG compression at 80% quality keeps small logos well under Firestore's 1MB doc limit.
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('Could not read image file.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}

export async function uploadInstitutionLogo(institutionUid: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please upload a PNG, JPG, WEBP, or SVG image.');
  }
  if (file.size > MAX_LOGO_SIZE_BYTES) {
    throw new Error('Logo must be smaller than 5MB.');
  }

  const dataUri = await compressImageToDataUri(file);

  if (dataUri.length > 900 * 1024) {
    throw new Error('Logo is too large even after compression. Please try a simpler image.');
  }

  await updateDoc(doc(db, 'users', institutionUid), {
    'institutionDetails.logoUrl': dataUri,
    updatedAt: new Date().toISOString(),
  });

  return dataUri;
}

export async function setInstitutionAccentColor(institutionUid: string, hexColor: string): Promise<void> {
  await updateDoc(doc(db, 'users', institutionUid), {
    'institutionDetails.accentColor': hexColor,
    updatedAt: new Date().toISOString(),
  });
}
