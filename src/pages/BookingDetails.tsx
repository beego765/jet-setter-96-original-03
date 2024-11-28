import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { FlightSummary } from "@/components/booking/FlightSummary";
import { PaymentOptions } from "@/components/booking/PaymentOptions";
import { PassengerForm } from "@/components/booking/PassengerForm";
import { FlightInfo } from "@/components/booking/FlightInfo";

const BookingDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [passengerDetails, setPassengerDetails] = useState<any>({});

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!flightId) {
          throw new Error('No flight ID provided');
        }

        // Fetch booking with payment details
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            *,
            booking_payments (
              amount,
              base_amount,
              fees_amount,
              taxes_amount,
              status,
              currency
            ),
            passenger_details (*)
          `)
          .eq('id', flightId)
          .single();

        if (bookingError) throw bookingError;
        if (!bookingData) throw new Error('Booking not found');

        setBooking(bookingData);

        // Only fetch flight details if we have a duffel_offer_id
        if (bookingData.duffel_offer_id) {
          const { data: duffelData, error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
            body: {
              path: `/air/offers/${bookingData.duffel_offer_id}`,
              method: 'GET'
            }
          });

          if (duffelError) {
            console.error('Error fetching Duffel data:', duffelError);
            toast({
              title: "Warning",
              description: "Some flight details might not be available",
              variant: "destructive",
            });
          } else {
            setFlightDetails(duffelData);
          }
        }
      } catch (error: any) {
        console.error('Error fetching booking details:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load booking details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [flightId, toast]);

  const handlePassengerDetailsChange = (index: number, data: any) => {
    setPassengerDetails(prev => ({
      ...prev,
      [index]: { ...(prev[index] || {}), ...data }
    }));
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <div className="text-red-400">Booking not found</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
            <FlightSummary booking={booking} flightDetails={flightDetails} />
          </Card>

          <FlightInfo booking={booking} />

          {/* Passenger Forms */}
          {Array.from({ length: booking.passengers || 1 }).map((_, index) => (
            <PassengerForm
              key={index}
              index={index}
              type="adult"
              onChange={handlePassengerDetailsChange}
              initialData={booking.passenger_details?.[index]}
            />
          ))}

          {/* Payment Options */}
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <PaymentOptions
              booking={booking}
              flightDetails={flightDetails}
              onPayNow={handlePayNow}
              onHoldOrder={handleHoldOrder}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;