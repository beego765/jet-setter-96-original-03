import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AdditionalInfoSectionProps {
  flightDetails: any;
}

export const AdditionalInfoSection = ({ flightDetails }: AdditionalInfoSectionProps) => {
  const navigate = useNavigate();

  const handleSeatSelection = () => {
    navigate(`/seat-selection/${flightDetails.data?.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Seat Selection */}
      <div className="mt-6 p-4 bg-gray-800/40 rounded-lg">
        <h3 className="font-semibold mb-2 text-lg">Seat Selection</h3>
        <p className="text-gray-400 mb-4">Choose your preferred seat before flight</p>
        <Button 
          onClick={handleSeatSelection}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Select Seat
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meals */}
        <div className="p-4 bg-gray-800/40 rounded-lg">
          <h3 className="font-semibold mb-2">Meals</h3>
          <div className="flex items-center gap-2">
            {flightDetails.data?.services?.some((s: any) => s.category === 'meal') ? (
              <Check className="text-green-500" />
            ) : (
              <X className="text-red-500" />
            )}
            <span className="text-gray-400">
              {flightDetails.data?.services?.some((s: any) => s.category === 'meal') 
                ? 'Meal included' 
                : 'No meal included'}
            </span>
          </div>
        </div>

        {/* Baggage */}
        <div className="p-4 bg-gray-800/40 rounded-lg">
          <h3 className="font-semibold mb-2">Baggage</h3>
          <div className="flex items-center gap-2">
            {flightDetails.data?.passengers?.[0]?.bags?.[0]?.quantity > 0 ? (
              <Check className="text-green-500" />
            ) : (
              <X className="text-red-500" />
            )}
            <span className="text-gray-400">
              {flightDetails.data?.passengers?.[0]?.bags?.[0]?.quantity > 0
                ? `${flightDetails.data?.passengers?.[0]?.bags?.[0]?.quantity} checked bags included`
                : 'No checked bags included'}
            </span>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="p-4 bg-gray-800/40 rounded-lg">
          <h3 className="font-semibold mb-2">Refund Policy</h3>
          <div className="flex items-center gap-2">
            {flightDetails.data?.conditions?.refund_before_departure?.allowed ? (
              <Check className="text-green-500" />
            ) : (
              <X className="text-red-500" />
            )}
            <span className="text-gray-400">
              {flightDetails.data?.conditions?.refund_before_departure?.allowed
                ? `Refundable (Fee: £${flightDetails.data?.conditions?.refund_before_departure?.penalty_amount || '0.00'})`
                : 'Non-refundable'}
            </span>
          </div>
        </div>

        {/* Changes Policy */}
        <div className="p-4 bg-gray-800/40 rounded-lg">
          <h3 className="font-semibold mb-2">Changes</h3>
          <div className="flex items-center gap-2">
            {flightDetails.data?.conditions?.change_before_departure?.allowed ? (
              <Check className="text-green-500" />
            ) : (
              <X className="text-red-500" />
            )}
            <span className="text-gray-400">
              {flightDetails.data?.conditions?.change_before_departure?.allowed
                ? `Changes allowed (Fee: £${flightDetails.data?.conditions?.change_before_departure?.penalty_amount || '0.00'})`
                : 'Changes not allowed'}
            </span>
          </div>
        </div>
      </div>

      {/* Carbon Offset */}
      {flightDetails.data?.slices?.[0]?.segments?.[0]?.carbon_emissions && (
        <div className="p-4 bg-gray-800/40 rounded-lg">
          <h3 className="font-semibold mb-2">Carbon Offset</h3>
          <div className="text-gray-400">
            CO2 Emissions: {flightDetails.data?.slices?.[0]?.segments?.[0]?.carbon_emissions?.amount}kg CO2e
          </div>
        </div>
      )}

      {/* Additional Services */}
      {flightDetails.data?.services && flightDetails.data?.services.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Additional Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flightDetails.data?.services.map((service: any) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">{service.name}</span>
                <Badge variant="outline">£{service.amount}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};