import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone, Mail, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Support = () => {
  const [session, setSession] = useState(null);
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

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
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
                <Input className="bg-gray-700/50 border-gray-600 text-white" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <Input className="bg-gray-700/50 border-gray-600 text-white" type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
              <Input 
                className="bg-gray-700/50 border-gray-600 text-white" 
                type="tel" 
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                className="w-full h-32 bg-gray-700/50 border-gray-600 rounded-md p-3 text-white resize-none"
                placeholder="How can we help you?"
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