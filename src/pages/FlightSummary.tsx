import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlightSummary } from "@/components/booking/FlightSummary";
import { FlightServices } from "@/components/flight-search/FlightServices";
import { FlightExtras } from "@/components/flight-search/FlightExtras";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

  const handleExtrasChange = (extras: any) => {
    setSelectedExtras(extras);
  };

  const handleContinue = () => {
    setIsLoading(true);
    // Create a booking object with selected extras
    const bookingDetails = {
      flight,
      passengers,
      extras: selectedExtras
    };

    // Navigate to passenger details page with booking information
    navigate('/booking/passenger-details', { 
      state: { bookingDetails } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Flight Summary
        </h1>

        <div className="space-y-6">
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <FlightSummary booking={{ 
              departure_date: flight.departureDate,
              origin: flight.origin,
              destination: flight.destination,
              passengers: passengers.adults + passengers.children + passengers.infants,
              cabin_class: flight.cabinClass
            }} flightDetails={null} />
          </Card>

          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Included Services</h2>
            <FlightServices 
              services={{
                seatSelection: flight.services.seatSelection,
                meals: flight.services.meals,
                baggage: flight.services.baggage,
                refund: flight.services.refund,
                changes: flight.services.changes
              }}
              carbonEmissions={flight.carbonEmissions}
            />
          </Card>

          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Additional Services</h2>
            <FlightExtras
              onChange={handleExtrasChange}
              value={selectedExtras}
            />
          </Card>

          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">£{flight.price.toFixed(2)}</p>
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