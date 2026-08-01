import { collection, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TeacherInvite {
  code: string;
  institutionId: string;
  institutionName: string;
  assignedClasses: string[];
  subjects: string[];
  used: boolean;
}

const INVITES_COLLECTION = 'teacherInvites';

function generateCode(): string {
  // Human-friendly 6-character code, unambiguous characters only.
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createTeacherInvite(
  institutionId: string,
  institutionName: string,
  assignedClasses: string[],
  subjects: string[]
): Promise<TeacherInvite> {
  const code = generateCode();
  const inviteRef = doc(db, INVITES_COLLECTION, code);

  const invite: TeacherInvite = {
    code,
    institutionId,
    institutionName,
    assignedClasses,
    subjects,
    used: false,
  };

  await setDoc(inviteRef, { ...invite, createdAt: serverTimestamp() });
  return invite;
}

export async function getTeacherInvite(code: string): Promise<TeacherInvite | null> {
  const inviteRef = doc(db, INVITES_COLLECTION, code.toUpperCase());
  const snap = await getDoc(inviteRef);
  if (!snap.exists()) return null;
  return snap.data() as TeacherInvite;
}

export async function consumeTeacherInvite(code: string): Promise<void> {
  const inviteRef = doc(db, INVITES_COLLECTION, code.toUpperCase());
  await deleteDoc(inviteRef);
}
