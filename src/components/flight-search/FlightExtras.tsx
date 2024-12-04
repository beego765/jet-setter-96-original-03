import { Check, Luggage, Coffee, Wifi, CreditCard } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface FlightExtrasProps {
  onChange: (extras: FlightExtrasType) => void;
  value: FlightExtrasType;
}

export interface FlightExtrasType {
  bags: boolean;
  meals: boolean;
  wifi: boolean;
  flexibleTicket: boolean;
}

export const FlightExtras = ({ onChange, value }: FlightExtrasProps) => {
  const handleChange = (key: keyof FlightExtrasType) => {
    onChange({
      ...value,
      [key]: !value[key]
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => handleChange('bags')}>
        <div className="flex items-start space-x-4">
          <Checkbox 
            id="bags" 
            checked={value.bags}
            onCheckedChange={() => handleChange('bags')}
          />
          <div className="flex-1">
            <Label htmlFor="bags" className="flex items-center gap-2 cursor-pointer">
              <Luggage className="w-4 h-4" />
              Extra Baggage
            </Label>
            <p className="text-sm text-gray-400 mt-1">Add checked baggage to your booking</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => handleChange('meals')}>
        <div className="flex items-start space-x-4">
          <Checkbox 
            id="meals" 
            checked={value.meals}
            onCheckedChange={() => handleChange('meals')}
          />
          <div className="flex-1">
            <Label htmlFor="meals" className="flex items-center gap-2 cursor-pointer">
              <Coffee className="w-4 h-4" />
              Meal Service
            </Label>
            <p className="text-sm text-gray-400 mt-1">Pre-book your in-flight meals</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => handleChange('wifi')}>
        <div className="flex items-start space-x-4">
          <Checkbox 
            id="wifi" 
            checked={value.wifi}
            onCheckedChange={() => handleChange('wifi')}
          />
          <div className="flex-1">
            <Label htmlFor="wifi" className="flex items-center gap-2 cursor-pointer">
              <Wifi className="w-4 h-4" />
              Wi-Fi Access
            </Label>
            <p className="text-sm text-gray-400 mt-1">Stay connected during your flight</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => handleChange('flexibleTicket')}>
        <div className="flex items-start space-x-4">
          <Checkbox 
            id="flexibleTicket" 
            checked={value.flexibleTicket}
            onCheckedChange={() => handleChange('flexibleTicket')}
          />
          <div className="flex-1">
            <Label htmlFor="flexibleTicket" className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="w-4 h-4" />
              Flexible Ticket
            </Label>
            <p className="text-sm text-gray-400 mt-1">Change or cancel your flight without fees</p>
          </div>
        </div>
      </Card>
    </div>
  );
};