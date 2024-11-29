import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone, Mail, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SupportMessage } from "@/types/support";

const Support = () => {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Subscribe to real-time updates for support messages
    if (session?.user?.id) {
      const channel = supabase
        .channel('support_messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'support_messages',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setMessages(prev => [...prev, payload.new as SupportMessage]);
            } else if (payload.eventType === 'UPDATE') {
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === payload.new.id ? payload.new as SupportMessage : msg
                )
              );
            }
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
        subscription.unsubscribe();
      };
    }

    return () => subscription.unsubscribe();
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch existing messages
      supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            toast({
              title: "Error fetching messages",
              description: error.message,
              variant: "destructive",
            });
          } else {
            setMessages(data);
          }
        });
    }
  }, [session?.user?.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to send messages",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert([
          {
            ...formData,
            user_id: session.user.id,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Support Center
          </h1>
          <p className="text-gray-300">We're here to help you</p>
        </div>

        {session && messages.length > 0 && (
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Messages</h2>
            <div className="space-y-4">
              {messages.map((msg) => (
                <Card key={msg.id} className="bg-gray-700/50 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      msg.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                      msg.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      msg.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-gray-200">{msg.message}</p>
                  {msg.admin_notes && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <p className="text-sm text-gray-400">Admin Response:</p>
                      <p className="text-gray-300">{msg.admin_notes}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        )}

        {session ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Live Chat</h3>
                  <p className="text-gray-400">Chat with our support team</p>
                </div>
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">Start Chat</Button>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Phone className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Call Us</h3>
                  <p className="text-gray-400">1-800-FLIGHTS</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-700">
                Call Now
              </Button>
            </Card>
          </div>
        ) : null}

        <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-8">
          <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <Input 
                  className="bg-gray-700/50 border-gray-600 text-white" 
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <Input 
                  className="bg-gray-700/50 border-gray-600 text-white" 
                  type="email" 
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
              <Input 
                className="bg-gray-700/50 border-gray-600 text-white" 
                type="tel" 
                placeholder="Your phone number"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                className="w-full h-32 bg-gray-700/50 border-gray-600 rounded-md p-3 text-white resize-none"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                required
              />
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">Send Message</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Support;