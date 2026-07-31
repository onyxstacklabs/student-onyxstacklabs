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

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface ElectricVehicleDetails {
  hasVehicle: boolean;
  vehicleName?: string;
  distanceFromHomeKm?: number;
  route?: string;
}

export interface StudentDetails {
  institutionId?: string;
  className: string;
  collegeName: string;
  rollNumber: string;
  subjects: string[];
  whatsappNumber?: string;
  parentContactNumber?: string;
  bloodGroup?: BloodGroup;
  electricVehicle?: ElectricVehicleDetails;
}

export interface InstitutionDetails {
  institutionName: string;
  address: string;
  contactEmail: string;
  contactNumber: string;
  classes: string[];
  semesters: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phoneNumber?: string;
  studentDetails?: StudentDetails;
  institutionDetails?: InstitutionDetails;
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
