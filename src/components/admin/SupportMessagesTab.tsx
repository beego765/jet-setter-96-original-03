import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MessageList } from "./support/MessageList";
import { MessageDetails } from "./support/MessageDetails";
import { SupportMessage } from "../../types/support";

export const SupportMessagesTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['support-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportMessage[];
    }
  });

  const updateMessageStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: SupportMessage['status']; notes?: string }) => {
      const { error } = await supabase
        .from('support_messages')
        .update({ 
          status,
          ...(notes && { admin_notes: notes })
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-messages'] });
      toast({
        title: "Message updated successfully",
        duration: 2000,
      });
      setSelectedMessage(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error updating message",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleStatusChange = (newStatus: SupportMessage['status']) => {
    if (!selectedMessage) return;
    
    updateMessageStatus.mutateAsync({
      id: selectedMessage.id,
      status: newStatus,
      notes: adminNotes || undefined
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-100">Support Messages</h2>
        
        <MessageList 
          messages={messages}
          onViewDetails={(message) => {
            setSelectedMessage(message);
            setAdminNotes(message.admin_notes || "");
          }}
        />

        {selectedMessage && (
          <MessageDetails
            message={selectedMessage}
            adminNotes={adminNotes}
            onAdminNotesChange={setAdminNotes}
            onClose={() => setSelectedMessage(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </Card>
  );
};