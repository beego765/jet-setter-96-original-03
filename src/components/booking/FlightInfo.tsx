import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Plane, Calendar, Luggage, CreditCard, AlertCircle, Timer, Building2, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">Flight Information</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Plane className="w-4 h-4" />
                  <span>From: {booking?.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Plane className="w-4 h-4 rotate-90" />
                  <span>To: {booking?.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Date: {new Date(booking?.departure_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Status: </span>
                  <Badge variant={booking?.status === 'confirmed' ? 'secondary' : 'default'}>
                    {booking?.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">£{booking?.total_price}</p>
              <p className="text-gray-400">{booking?.cabin_class}</p>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {flightDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Flight Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Building2 className="w-4 h-4" />
                      <span>Carrier: {flightDetails.data?.owner?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Timer className="w-4 h-4" />
                      <span>Duration: {formatDuration(flightDetails.data?.slices?.[0]?.duration || 0)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Departure: {formatDateTime(flightDetails.data?.slices?.[0]?.departing_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Arrival: {formatDateTime(flightDetails.data?.slices?.[0]?.arriving_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>Passengers: {flightDetails.data?.passengers?.length || 1}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Fare Conditions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {flightDetails.data?.fare_brand_name || 'Standard Fare'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        {flightDetails.data?.conditions?.change_before_departure?.allowed ? 
                          `Changes allowed (Fee: ${flightDetails.data?.conditions?.change_before_departure?.penalty_amount || 'N/A'})` : 
                          'Changes not allowed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Luggage className="w-4 h-4" />
                      <span>
                        {flightDetails.data?.passengers?.[0]?.bags?.[0]?.quantity > 0 ? 
                          `${flightDetails.data?.passengers?.[0]?.bags?.[0]?.quantity} checked bags included` : 
                          'No checked bags included'}
                      </span>
                    </div>
                    {flightDetails.data?.slices?.[0]?.segments?.[0]?.aircraft?.name && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Plane className="w-4 h-4" />
                        <span>Aircraft: {flightDetails.data?.slices?.[0]?.segments?.[0]?.aircraft?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {flightDetails.data?.services && flightDetails.data?.services.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Additional Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {flightDetails.data?.services.map((service: any) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <span>{service.name}</span>
                        <Badge variant="outline">£{service.amount}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {flightDetails.data?.conditions?.refund_before_departure && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Refund Policy</h3>
                  <div className="text-sm text-gray-400">
                    {flightDetails.data?.conditions?.refund_before_departure?.allowed ? 
                      `Refundable (Fee: ${flightDetails.data?.conditions?.refund_before_departure?.penalty_amount || 'N/A'})` : 
                      'Non-refundable'}
                  </div>
                </div>
              )}

              {flightDetails.data?.slices?.[0]?.segments?.[0]?.carbon_emissions && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Environmental Impact</h3>
                  <div className="text-sm text-gray-400">
                    CO2 Emissions: {flightDetails.data?.slices?.[0]?.segments?.[0]?.carbon_emissions?.amount}kg CO2e
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};