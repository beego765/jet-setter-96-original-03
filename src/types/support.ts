export type SupportMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  admin_notes: string | null;
  created_at: string;
};