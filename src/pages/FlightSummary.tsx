import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlightSummary } from "@/components/booking/FlightSummary";
import { FlightServices } from "@/components/flight-search/FlightServices";
import { FlightExtras } from "@/components/flight-search/FlightExtras";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plane, Calendar, Users, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createDuffelBooking, createBookingRecord, addBookingExtras } from "@/utils/bookingUtils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const FlightSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState({
    bags: false,
    meals: false,
    wifi: false,
    flexibleTicket: false
  });

  const flight = location.state?.flight;
  const passengers = location.state?.passengers;

  if (!flight) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">No flight details available</div>
      </div>
    );
  }

  // Extract and transform services from the flight data
  const flightServices = {
    seatSelection: flight.conditions?.change_before_departure?.allowed || false,
    meals: flight.slices?.[0]?.segments?.map(segment => segment.meal_service || []).flat() || [],
    baggage: {
      included: flight.passengers?.[0]?.baggages?.length > 0 || false,
      details: flight.passengers?.[0]?.baggages?.length > 0 
        ? `${flight.passengers[0].baggages.length} bag(s) included` 
        : 'No baggage included'
    },
    refund: {
      allowed: flight.conditions?.refund_before_departure?.allowed || false,
      penalty: flight.conditions?.refund_before_departure?.penalty_amount
    },
    changes: {
      allowed: flight.conditions?.change_before_departure?.allowed || false,
      penalty: flight.conditions?.change_before_departure?.penalty_amount
    }
  };

  const handleExtrasChange = (extras: any) => {
    setSelectedExtras(extras);
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      console.log('Selected flight:', flight);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create Duffel booking
      const duffelOrder = await createDuffelBooking(flight);

      // Create booking record
      const bookingData = await createBookingRecord(user.id, flight, duffelOrder.data.id);

      // Add selected extras
      const addonsError = await addBookingExtras(bookingData.id, selectedExtras);

      if (addonsError) {
        console.error('Error adding extras:', addonsError);
        toast({
          title: "Warning",
          description: "Some extras couldn't be added to your booking",
          variant: "destructive",
        });
      }

      // Navigate to passenger details
      navigate(`/booking/${bookingData.id}/passenger-details`, { 
        state: { 
          bookingId: bookingData.id,
          passengers 
        } 
      });
    } catch (error: any) {
      console.error('Error handling booking:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total duration of the flight
  const getTotalDuration = () => {
    const segments = flight.slices?.[0]?.segments || [];
    if (segments.length === 0) return "N/A";
    
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    
    const start = new Date(firstSegment.departing_at);
    const end = new Date(lastSegment.arriving_at);
    
    const durationInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Flight Summary
        </h1>

        <div className="space-y-6">
          {/* Flight Overview Card */}
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="space-y-6">
              {/* Flight Route */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {new Date(flight.slices[0].segments[0].departing_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {flight.slices[0].origin.iata_code}
                  </Badge>
                </div>

                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="w-full flex items-center gap-2">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/20 to-blue-400"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Plane className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-400 to-blue-500/20"></div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">{getTotalDuration()}</div>
                  {flight.owner?.name && (
                    <div className="text-sm text-gray-400 mt-1">Operated by {flight.owner.name}</div>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {new Date(flight.slices[0].segments[flight.slices[0].segments.length - 1].arriving_at)
                      .toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {flight.slices[0].destination.iata_code}
                  </Badge>
                </div>
              </div>

              {/* Flight Details */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(flight.slices[0].segments[0].departing_at), 'EEE, dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{passengers?.adults + (passengers?.children || 0) + (passengers?.infants || 0)} Passengers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{getTotalDuration()} Duration</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Included Services Card */}
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Included Services</h2>
            <FlightServices 
              services={flightServices}
              carbonEmissions={flight.total_emissions_kg ? {
                amount: parseFloat(flight.total_emissions_kg),
                unit: 'kg CO2'
              } : undefined}
            />
          </Card>

          {/* Additional Services Card */}
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Additional Services</h2>
            <FlightExtras
              onChange={handleExtrasChange}
              value={selectedExtras}
            />
          </Card>

          {/* Price Summary Card */}
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">£{flight.total_amount}</p>
                <p className="text-sm text-gray-400">Total price including all taxes and fees</p>
              </div>
              <Button
                onClick={handleContinue}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Continue to Passenger Details"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlightSummaryPage;
