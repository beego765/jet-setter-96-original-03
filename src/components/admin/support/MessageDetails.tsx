import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SupportMessage, SupportChatMessage } from "../../../types/support";

interface MessageDetailsProps {
  message: SupportMessage;
  adminNotes: string;
  onAdminNotesChange: (notes: string) => void;
  onClose: () => void;
  onStatusChange: (status: SupportMessage['status']) => void;
}

export const MessageDetails = ({
  message,
  adminNotes,
  onAdminNotesChange,
  onClose,
  onStatusChange,
}: MessageDetailsProps) => {
  const [chatMessages, setChatMessages] = useState<SupportChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch existing chat messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('support_chat_messages')
        .select('*')
        .eq('support_message_id', message.id)
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setChatMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`support_message_${message.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_chat_messages',
          filter: `support_message_id=eq.${message.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setChatMessages(prev => [...prev, payload.new as SupportChatMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [message.id, toast]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('support_chat_messages')
        .insert([
          {
            support_message_id: message.id,
            message: newMessage.trim(),
            sender_type: 'admin'
          }
        ]);

      if (error) throw error;

      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="bg-gray-800/95 backdrop-blur-lg border-gray-700 p-6 max-w-4xl w-full space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">Message Details</h3>
            <p className="text-sm text-gray-400">From: {message.name}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-gray-700 hover:bg-gray-700"
          >
            Close
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Message:</label>
              <p className="text-gray-100 bg-gray-700/50 p-3 rounded-md">{message.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Contact Information:</label>
              <p className="text-gray-100">Email: {message.email}</p>
              {message.phone && <p className="text-gray-100">Phone: {message.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Admin Notes:</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => onAdminNotesChange(e.target.value)}
                placeholder="Add notes about this support request..."
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="flex gap-2">
              {message.status !== 'in_progress' && (
                <Button
                  onClick={() => onStatusChange('in_progress')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Mark In Progress
                </Button>
              )}
              {message.status !== 'resolved' && (
                <Button
                  onClick={() => onStatusChange('resolved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark Resolved
                </Button>
              )}
              {message.status !== 'closed' && (
                <Button
                  onClick={() => onStatusChange('closed')}
                  variant="destructive"
                >
                  Close Request
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-100">Chat History</h4>
            <ScrollArea className="h-[400px] border border-gray-700 rounded-lg p-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender_type === 'admin'
                          ? 'bg-blue-500/20 text-blue-100'
                          : 'bg-gray-700/50 text-gray-100'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700/50 border-gray-600 text-white"
              />
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Send
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};