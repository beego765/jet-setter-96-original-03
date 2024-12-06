import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { PaymentOptions } from "@/components/booking/PaymentOptions";

const Payment = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', flightId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          passenger_details (*)
        `)
        .eq('id', flightId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!flightId
  });

  const { data: flightDetails } = useQuery({
    queryKey: ['flight-details', booking?.duffel_offer_id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: `/air/offers/${booking.duffel_offer_id}`,
          method: 'GET'
        }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!booking?.duffel_offer_id
  });

  const handlePayNow = async () => {
    navigate('/my-bookings');
  };

  const handleHoldOrder = async () => {
    navigate('/my-bookings');
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