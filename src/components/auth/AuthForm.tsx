import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export const AuthForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const pendingSearch = localStorage.getItem('pendingFlightSearch');
        navigate(pendingSearch ? '/' : '/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg border-gray-700 p-8">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#8B5CF6',
                brandAccent: '#7C3AED',
                inputBackground: 'transparent',
                inputText: 'white',
                inputPlaceholder: 'gray',
                inputBorder: '#374151',
                inputBorderHover: '#4B5563',
                inputBorderFocus: '#6366F1',
              },
            },
          },
          style: {
            input: {
              backgroundColor: 'transparent',
              border: '1px solid #374151',
              color: 'white',
            },
            label: {
              color: 'white',
            },
            button: {
              border: '1px solid #374151',
              backgroundColor: '#8B5CF6',
              color: 'white',
            },
          },
        }}
        providers={["google", "github"]}
        redirectTo={window.location.origin}
        view="sign_in"
        showLinks={true}
      />
    </Card>
  );
};