import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FlightInfoHeader } from "./FlightInfoHeader";
import { FlightDetailsSection } from "./FlightDetailsSection";
import { FareConditionsSection } from "./FareConditionsSection";
import { AdditionalInfoSection } from "./AdditionalInfoSection";

interface FlightInfoProps {
  booking: any;
}

export const FlightInfo = ({ booking }: FlightInfoProps) => {
  const { data: flightDetails, isLoading, error } = useQuery({
    queryKey: ['flight-details', booking?.duffel_booking_id],
    queryFn: async () => {
      console.log('Fetching flight details for:', booking?.duffel_booking_id);
      const { data, error } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: `/air/orders/${booking?.duffel_booking_id}`,
          method: 'GET'
        }
      });
      if (error) {
        console.error('Error fetching flight details:', error);
        throw error;
      }
      console.log('Flight details response:', data);
      return data;
    },
    enabled: !!booking?.duffel_booking_id
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      day: 'numeric',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <div className="h-40 bg-gray-700/50 rounded" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <div className="text-red-400">Error loading flight details. Please try again later.</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <div className="space-y-6">
          <FlightInfoHeader booking={booking} status={booking?.status} />
          
          <Separator className="bg-gray-700" />

          {flightDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FlightDetailsSection 
                  flightDetails={flightDetails}
                  formatDateTime={formatDateTime}
                  formatDuration={formatDuration}
                />
                <FareConditionsSection flightDetails={flightDetails} />
              </div>
              <AdditionalInfoSection flightDetails={flightDetails} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};