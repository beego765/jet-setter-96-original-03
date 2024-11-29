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

export type SupportChatMessage = {
  id: string;
  support_message_id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
  updated_at: string;
};