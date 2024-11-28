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
  const { data: flightDetails } = useQuery({
    queryKey: ['flight-details', booking?.duffel_booking_id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: `/air/orders/${booking?.duffel_booking_id}`,
          method: 'GET'
        }
      });
      if (error) throw error;
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
                      <span>Carrier: {flightDetails.owner?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Timer className="w-4 h-4" />
                      <span>Duration: {formatDuration(flightDetails.slices?.[0]?.duration || 0)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Departure: {formatDateTime(flightDetails.slices?.[0]?.departing_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Arrival: {formatDateTime(flightDetails.slices?.[0]?.arriving_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>Passengers: {flightDetails.passengers?.length || 1}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Fare Conditions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {flightDetails.refundable ? 
                          `Refundable (£${flightDetails.refund_fee} fee)` : 
                          'Non-refundable'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        {flightDetails.changeable ? 
                          `Changes allowed (£${flightDetails.change_fee} fee)` : 
                          'Not changeable'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Luggage className="w-4 h-4" />
                      <span>
                        {flightDetails.bags_included ? 
                          `Includes ${flightDetails.bags_count} checked bags` : 
                          'No checked bags included'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Plane className="w-4 h-4" />
                      <span>CO2 emissions: {flightDetails.co2_emissions}kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {flightDetails.services && flightDetails.services.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Additional Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {flightDetails.services.map((service: any) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <span>{service.name}</span>
                        <Badge variant="outline">£{service.price}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {flightDetails.conditions && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Terms and Conditions</h3>
                  <div className="text-sm text-gray-400">
                    {flightDetails.conditions}
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