import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

export const UserProfileSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input
            value={profile.first_name || ''}
            onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            className="bg-gray-700/50 border-gray-600"
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input
            value={profile.last_name || ''}
            onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            className="bg-gray-700/50 border-gray-600"
            placeholder="Enter your last name"
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={profile.email || ''}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="bg-gray-700/50 border-gray-600"
            placeholder="Enter your email"
            type="email"
          />
        </div>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </Card>
  );
};