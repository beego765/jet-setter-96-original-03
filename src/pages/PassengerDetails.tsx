import { useParams } from "react-router-dom";
import { PassengerForm } from "@/components/booking/PassengerForm";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PassengerDetails = () => {
  const { flightId } = useParams();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', flightId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', flightId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!flightId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-blue-400">Loading passenger details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Passenger Details
        </h1>
        
        <div className="space-y-6">
          {Array.from({ length: booking?.passengers || 1 }).map((_, index) => (
            <PassengerForm
              key={index}
              index={index}
              type="adult"
              onChange={(index, data) => {
                console.log('Passenger data updated:', { index, data });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;