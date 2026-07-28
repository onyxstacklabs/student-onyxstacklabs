export type UserRole = 
  | 'STUDENT'
  | 'PARENT'
  | 'TEACHER'
  | 'INSTITUTION'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type Permission = 
  | 'read:dashboard'
  | 'write:profile'
  | 'manage:students'
  | 'manage:institution'
  | 'access:admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phoneNumber?: string;
  education?: {
    institutionName: string;
    gradeLevel: string;
    studentId?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}
