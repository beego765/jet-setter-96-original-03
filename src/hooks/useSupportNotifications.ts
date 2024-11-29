import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSupportNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial unread count for messages that need attention
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from('support_messages')
        .select('*', { count: 'exact', head: true })
        .in('status', ['new', 'in_progress'])
        .not('admin_notes', 'is', null);
      
      setUnreadCount(count || 0);
    };

    fetchUnreadCount();
  }, []);

  // Subscribe to changes
  useEffect(() => {
    const channel = supabase
      .channel('support_messages_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'support_messages' },
        async (payload) => {
          // Update count when:
          // 1. New message is inserted
          // 2. Status changes to 'new' or 'in_progress'
          // 3. Admin notes are added/removed
          if (
            payload.eventType === 'INSERT' || 
            payload.eventType === 'UPDATE'
          ) {
            const { count } = await supabase
              .from('support_messages')
              .select('*', { count: 'exact', head: true })
              .in('status', ['new', 'in_progress'])
              .not('admin_notes', 'is', null);
            
            setUnreadCount(count || 0);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const resetUnreadCount = async () => {
    // Update all new messages to in_progress status
    await supabase
      .from('support_messages')
      .update({ status: 'in_progress' })
      .eq('status', 'new');
    
    setUnreadCount(0);
  };

  return { unreadCount, resetUnreadCount };
};