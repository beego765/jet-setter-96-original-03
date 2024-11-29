import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SupportMessage } from "@/types/support";

interface ChatInterfaceProps {
  supportMessage: SupportMessage;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  message: string;
  sender_type: 'user' | 'admin';
  created_at: string;
}

export const ChatInterface = ({ supportMessage, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch existing chat messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('support_chat_messages')
        .select('*')
        .eq('support_message_id', supportMessage.id)
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`support_message_${supportMessage.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_chat_messages',
          filter: `support_message_id=eq.${supportMessage.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as ChatMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supportMessage.id, toast]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('support_chat_messages')
        .insert([
          {
            support_message_id: supportMessage.id,
            message: newMessage.trim(),
            sender_type: 'user'
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
      <div className="bg-gray-800/95 backdrop-blur-lg border border-gray-700 rounded-lg p-6 max-w-2xl w-full space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-100">Support Chat</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-gray-700 hover:bg-gray-700"
          >
            Close
          </Button>
        </div>

        <ScrollArea className="h-[400px] border border-gray-700 rounded-lg p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender_type === 'user'
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
  );
};