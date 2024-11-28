import { Badge } from "@/components/ui/badge";

interface AdditionalInfoSectionProps {
  flightDetails: any;
}

export const AdditionalInfoSection = ({ flightDetails }: AdditionalInfoSectionProps) => {
  return (
    <>
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
    </>
  );
};