import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SupportChatMessage, SenderType } from "../../../types/support";

interface ChatSectionProps {
  messageId: string;
}

export const ChatSection = ({ messageId }: ChatSectionProps) => {
  const [chatMessages, setChatMessages] = useState<SupportChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('support_chat_messages')
        .select('*')
        .eq('support_message_id', messageId)
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setChatMessages(data as SupportChatMessage[]);
    };

    fetchMessages();

    const channel = supabase
      .channel(`support_message_${messageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_chat_messages',
          filter: `support_message_id=eq.${messageId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as SupportChatMessage;
            setChatMessages(prev => [...prev, newMessage]);
            if (newMessage.sender_type !== 'admin') {
              setShowNewMessageAlert(true);
              setTimeout(() => setShowNewMessageAlert(false), 5000); // Hide alert after 5 seconds
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messageId, toast]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('support_chat_messages')
        .insert([
          {
            support_message_id: messageId,
            message: newMessage.trim(),
            sender_type: 'admin' as SenderType
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
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-100">Chat History</h4>
      {showNewMessageAlert && (
        <Alert className="bg-blue-500/20 border-blue-500/50 text-blue-200">
          <AlertDescription>
            New message received from user
          </AlertDescription>
        </Alert>
      )}
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
  );
};