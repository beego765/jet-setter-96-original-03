import { CreditCard, AlertCircle, Luggage, Plane, Clock } from "lucide-react";

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
            {flightDetails.data?.passengers?.[0]?.checked_bags_count > 0 ? 
              `${flightDetails.data?.passengers?.[0]?.checked_bags_count} checked bags included` : 
              'No checked bags included'}
          </span>
        </div>
        {flightDetails.data?.slices?.[0]?.segments?.[0]?.aircraft?.name && (
          <div className="flex items-center gap-2 text-gray-400">
            <Plane className="w-4 h-4" />
            <span>Aircraft: {flightDetails.data?.slices?.[0]?.segments?.[0]?.aircraft?.name}</span>
          </div>
        )}
        {flightDetails.data?.payment_requirements?.requires_instant_payment === false && (
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              Hold available until: {new Date(flightDetails.data?.payment_requirements?.payment_required_by).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};