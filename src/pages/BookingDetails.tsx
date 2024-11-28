import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PassengerDetail {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  passport_number: string | null;
}

interface BookingAddon {
  id: string;
  type: string;
  name: string;
  description: string | null;
  price: number;
  status: string;
}

const BookingDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [passengers, setPassengers] = useState<PassengerDetail[]>([]);
  const [addons, setAddons] = useState<BookingAddon[]>([]);

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

        const { data: addonData, error: addonError } = await supabase
          .from('booking_addons')
          .select('*')
          .eq('booking_id', flightId);

        if (addonError) throw addonError;

        setBooking(bookingData);
        setPassengers(passengerData);
        setAddons(addonData || []);
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

  const handleAddAddon = async (type: string) => {
    try {
      const { data, error } = await supabase
        .from('booking_addons')
        .insert({
          booking_id: flightId,
          type,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Add-on`,
          price: 50, // Default price, should be fetched from Duffel API
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setAddons([...addons, data]);
      toast({
        title: "Add-on added",
        description: "The add-on has been added to your booking."
      });
    } catch (error: any) {
      toast({
        title: "Error adding add-on",
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <Button
              variant="outline"
              onClick={() => navigate('/my-bookings')}
              className="border-gray-700"
            >
              Back to My Bookings
            </Button>
          </div>

          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Flight Information</h2>
                  <p className="text-gray-400">Booking Reference: {booking?.booking_reference}</p>
                  <p className="text-gray-400">From: {booking?.origin}</p>
                  <p className="text-gray-400">To: {booking?.destination}</p>
                  <p className="text-gray-400">Date: {new Date(booking?.departure_date).toLocaleDateString()}</p>
                  <p className="text-gray-400">Status: {booking?.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">£{booking?.total_price}</p>
                  <p className="text-gray-400">{booking?.cabin_class}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                  <p className="font-medium">{passenger.first_name} {passenger.last_name}</p>
                  <p className="text-sm text-gray-400">DOB: {new Date(passenger.date_of_birth).toLocaleDateString()}</p>
                  {passenger.passport_number && (
                    <p className="text-sm text-gray-400">Passport: {passenger.passport_number}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add-ons and Changes</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAddAddon('baggage')}
                  className="border-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Baggage
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddAddon('meal')}
                  className="border-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Meal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddAddon('seat')}
                  className="border-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Select Seat
                </Button>
              </div>
            </div>

            {addons.length > 0 ? (
              <div className="space-y-4">
                {addons.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="font-medium">{addon.name}</p>
                      {addon.description && <p className="text-sm text-gray-400">{addon.description}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">£{addon.price}</p>
                      {addon.status === 'confirmed' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Button size="sm" variant="outline" className="border-gray-700">
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No add-ons selected yet.</p>
            )}
          </Card>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              className="border-gray-700"
              onClick={() => navigate('/my-bookings')}
            >
              Save for Later
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              onClick={() => {
                toast({
                  title: "Booking Confirmed",
                  description: "Your booking has been confirmed successfully!"
                });
                navigate('/my-bookings');
              }}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;