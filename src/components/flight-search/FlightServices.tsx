import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface FlightServicesProps {
  services: {
    name: string;
    included: boolean;
    description?: string;
  }[];
}

export const FlightServices = ({ services }: FlightServicesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service, index) => (
        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30">
          <Checkbox
            checked={service.included}
            disabled
            className="mt-1 border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-200">
                {service.name}
              </span>
              {service.included ? (
                <Check className="w-4 h-4 text-purple-400" />
              ) : (
                <X className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {service.description && (
              <p className="text-xs text-gray-400 mt-1">{service.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};