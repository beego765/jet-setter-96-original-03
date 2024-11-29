export type UserRole = 'user' | 'admin';

export type UserProfile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  status: string | null;
  last_login: string | null;
  role?: UserRole;
};