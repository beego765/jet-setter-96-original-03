import { useParams, useNavigate } from "react-router-dom";
import { PassengerForm } from "@/components/booking/PassengerForm";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const PassengerDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [passengerData, setPassengerData] = useState<Record<number, any>>({});

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

  const handlePassengerDataChange = (index: number, data: any) => {
    setPassengerData(prev => ({
      ...prev,
      [index]: { ...prev[index], ...data }
    }));
  };

  const handleContinue = async () => {
    try {
      // Validate all required fields are filled
      const passengers = Object.values(passengerData);
      const requiredFields = ['title', 'first_name', 'last_name', 'date_of_birth', 'email'];
      
      const isValid = passengers.every(passenger => 
        requiredFields.every(field => passenger && passenger[field])
      );

      if (!isValid) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields for all passengers",
          variant: "destructive"
        });
        return;
      }

      // Save passenger details to database
      const { error } = await supabase
        .from('passenger_details')
        .insert(
          Object.values(passengerData).map(passenger => ({
            booking_id: flightId,
            ...passenger
          }))
        );

      if (error) throw error;

      // Navigate to payment page
      navigate(`/booking/${flightId}/payment`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save passenger details",
        variant: "destructive"
      });
    }
  };

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
              onChange={handlePassengerDataChange}
            />
          ))}

          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="flex justify-end">
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Continue to Payment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;