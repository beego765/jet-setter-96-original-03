import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SeatSelection = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSeat, setSelectedSeat] = useState("");

  const handleSeatSelection = async () => {
    if (!selectedSeat) {
      toast({
        title: "Please select a seat",
        description: "You must select a seat to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('booking_addons')
        .insert({
          booking_id: flightId,
          type: 'seat',
          name: `Seat ${selectedSeat}`,
          price: 50,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Seat selected",
        description: `You have selected seat ${selectedSeat}`,
      });
      
      // Navigate back to the booking details page
      navigate(`/booking/${flightId}`);
    } catch (error: any) {
      toast({
        title: "Error selecting seat",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <Card className="max-w-4xl mx-auto p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Select Your Seat</h2>
        
        <div className="grid grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 30 }, (_, i) => {
            const seatNumber = `${Math.floor(i / 6) + 1}${String.fromCharCode(65 + (i % 6))}`;
            return (
              <Button
                key={seatNumber}
                variant={selectedSeat === seatNumber ? "default" : "outline"}
                className={`h-12 ${selectedSeat === seatNumber ? 'bg-blue-500' : 'border-gray-600'}`}
                onClick={() => setSelectedSeat(seatNumber)}
              >
                {seatNumber}
              </Button>
            );
          })}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            className="border-gray-700"
            onClick={() => navigate(`/booking/${flightId}`)}
          >
            Back
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            onClick={handleSeatSelection}
          >
            Confirm Seat Selection
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SeatSelection;