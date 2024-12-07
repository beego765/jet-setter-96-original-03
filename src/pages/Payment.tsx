import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { PaymentOptions } from "@/components/booking/PaymentOptions";
import { useToast } from "@/components/ui/use-toast";

const Payment = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', flightId],
    queryFn: async () => {
      console.log('Fetching booking details for:', flightId);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          passenger_details (*),
          booking_payments (*)
        `)
        .eq('id', flightId)
        .single();

      if (error) throw error;
      
      // Validate booking has required Duffel IDs
      if (!data.duffel_booking_id) {
        throw new Error('Booking is missing Duffel booking ID');
      }

      console.log('Fetched booking data:', data);
      return data;
    },
    enabled: !!flightId
  });

  const { data: flightDetails } = useQuery({
    queryKey: ['flight-details', booking?.duffel_booking_id],
    queryFn: async () => {
      console.log('Fetching flight details for Duffel booking:', booking.duffel_booking_id);
      const { data, error } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: `/air/orders/${booking.duffel_booking_id}`,
          method: 'GET'
        }
      });

      if (error) throw error;
      console.log('Fetched flight details:', data);
      return data;
    },
    enabled: !!booking?.duffel_booking_id
  });

  const handlePayNow = async () => {
    try {
      navigate('/my-bookings');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Payment failed",
        variant: "destructive"
      });
    }
  };

  const handleHoldOrder = async () => {
    try {
      navigate('/my-bookings');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to hold order",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-blue-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-red-400 p-4 rounded-lg bg-red-400/10">
          {error.message || "Failed to load booking details"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <PaymentOptions
          booking={booking}
          flightDetails={flightDetails}
          onPayNow={handlePayNow}
          onHoldOrder={handleHoldOrder}
        />
      </div>
    </div>
  );
};

export default Payment;