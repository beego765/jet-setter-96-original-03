import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BookingHeader } from "@/components/booking/BookingHeader";
import { FlightInfo } from "@/components/booking/FlightInfo";
import { PassengerForm } from "@/components/booking/PassengerForm";
import { BookingActions } from "@/components/booking/BookingActions";

const BookingDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [passengerDetails, setPassengerDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', flightId)
          .single();

        if (bookingError) throw bookingError;

        const { data: passengerData, error: passengerError } = await supabase
          .from('passenger_details')
          .select('*')
          .eq('booking_id', flightId);

        if (passengerError) throw passengerError;

        setBooking(bookingData);
        setPassengerDetails(passengerData || []);
      } catch (error: any) {
        toast({
          title: "Error fetching booking details",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (flightId) {
      fetchBookingDetails();
    }
  }, [flightId, toast]);

  const handlePassengerDetailsChange = (index: number, data: any) => {
    const updatedDetails = [...passengerDetails];
    if (!updatedDetails[index]) {
      updatedDetails[index] = {};
    }
    updatedDetails[index] = { ...updatedDetails[index], ...data };
    setPassengerDetails(updatedDetails);
  };

  const handleSaveForLater = async () => {
    try {
      const { error } = await supabase
        .from('passenger_details')
        .upsert(
          passengerDetails.map(passenger => ({
            ...passenger,
            booking_id: flightId
          }))
        );

      if (error) throw error;

      toast({
        title: "Progress Saved",
        description: "Your booking details have been saved."
      });
      
      navigate('/my-bookings');
    } catch (error: any) {
      toast({
        title: "Error saving details",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleConfirmBooking = async () => {
    try {
      // First save passenger details
      const { error: saveError } = await supabase
        .from('passenger_details')
        .upsert(
          passengerDetails.map(passenger => ({
            ...passenger,
            booking_id: flightId
          }))
        );

      if (saveError) throw saveError;

      // Then update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', flightId);

      if (updateError) throw updateError;

      toast({
        title: "Booking Confirmed",
        description: "Your booking has been confirmed successfully!"
      });
      
      navigate('/my-bookings');
    } catch (error: any) {
      toast({
        title: "Error confirming booking",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <BookingHeader booking={booking} />
          <FlightInfo booking={booking} />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Passenger Details</h2>
            {Array.from({ length: booking.passengers }).map((_, index) => (
              <PassengerForm
                key={index}
                index={index}
                type={index === 0 ? "Adult" : "Guest"}
                onChange={handlePassengerDetailsChange}
              />
            ))}
          </div>

          <BookingActions
            onSave={handleSaveForLater}
            onConfirm={handleConfirmBooking}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;