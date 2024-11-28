import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Service {
  name: string;
  included: boolean;
  description?: string;
}

interface FlightServicesProps {
  services: {
    seatSelection: boolean;
    meals: string[];
    baggage: {
      included: boolean;
      details: string;
    };
    refund: {
      allowed: boolean;
      penalty?: number;
    };
    changes: {
      allowed: boolean;
      penalty?: number;
    };
  };
  carbonEmissions?: {
    amount: number;
    unit: string;
  };
}

export const FlightServices = ({ services, carbonEmissions }: FlightServicesProps) => {
  const servicesList: Service[] = [
    {
      name: "Seat Selection",
      included: services.seatSelection,
      description: "Choose your preferred seat before flight"
    },
    {
      name: "Meals",
      included: services.meals.length > 0,
      description: services.meals.length > 0 ? services.meals.join(", ") : undefined
    },
    {
      name: "Baggage",
      included: services.baggage.included,
      description: services.baggage.details
    },
    {
      name: "Refundable",
      included: services.refund.allowed,
      description: services.refund.penalty ? `Change fee: £${services.refund.penalty}` : undefined
    },
    {
      name: "Changes Allowed",
      included: services.changes.allowed,
      description: services.changes.penalty ? `Change fee: £${services.changes.penalty}` : undefined
    }
  ];

  if (carbonEmissions) {
    servicesList.push({
      name: "Carbon Offset",
      included: true,
      description: `${carbonEmissions.amount} ${carbonEmissions.unit}`
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {servicesList.map((service) => (
        <div key={service.name} className="p-3 bg-gray-800/40 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{service.name}</span>
            {service.included ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <X className="w-4 h-4 text-red-400" />
            )}
          </div>
          {service.description && (
            <p className="text-sm text-gray-400">{service.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};