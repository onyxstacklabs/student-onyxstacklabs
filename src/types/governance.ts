export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentCategory = 
  | 'medical' 
  | 'fire' 
  | 'security' 
  | 'facility' 
  | 'cybersecurity' 
  | 'unauthorized_access';

export type IncidentStatus = 'reported' | 'acknowledged' | 'dispatching' | 'resolved' | 'dismissed';

export interface EmergencyAlert {
  id: string;
  userId: string;
  userName: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  timestamp: string;
  notes?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'allowed' | 'denied' | 'flagged';
}

export interface DigitalIDVerification {
  studentId: string;
  fullName: string;
  clearanceLevel: 'Standard' | 'Elevated' | 'Admin' | 'Emergency First Responder';
  isBiometricVerified: boolean;
  rfidCardStatus: 'active' | 'suspended' | 'lost';
  accessZonesPermitted: string[];
}
