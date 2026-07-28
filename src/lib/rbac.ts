import { UserRole, Permission } from '@/types/auth';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  STUDENT: ['read:dashboard', 'write:profile'],
  PARENT: ['read:dashboard', 'write:profile'],
  TEACHER: ['read:dashboard', 'write:profile', 'manage:students'],
  INSTITUTION: ['read:dashboard', 'write:profile', 'manage:students', 'manage:institution'],
  ADMIN: ['read:dashboard', 'write:profile', 'manage:students', 'manage:institution', 'access:admin'],
  SUPER_ADMIN: ['read:dashboard', 'write:profile', 'manage:students', 'manage:institution', 'access:admin'],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const DEFAULT_ROLE_REDIRECTS: Record<UserRole, string> = {
  STUDENT: '/dashboard',
  PARENT: '/dashboard',
  TEACHER: '/dashboard',
  INSTITUTION: '/dashboard',
  ADMIN: '/dashboard',
  SUPER_ADMIN: '/dashboard',
};
