import { CreditCard, AlertCircle, Luggage, Plane } from "lucide-react";

interface FareConditionsSectionProps {
  flightDetails: any;
}

export const FareConditionsSection = ({ flightDetails }: FareConditionsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Fare Conditions</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400">
          <CreditCard className="w-4 h-4" />
          <span>{flightDetails.data?.fare_brand_name || 'Standard Fare'}</span>
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
  );
};