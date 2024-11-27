import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: PassengerCount;
  onChange: (value: PassengerCount) => void;
}

export const PassengerSelector = ({ value, onChange }: PassengerSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateCount = (type: keyof PassengerCount, increment: boolean) => {
    const newValue = { ...value };
    if (increment) {
      // Enforce maximum of 9 total passengers as per airline restrictions
      const totalPassengers = value.adults + value.children + value.infants;
      if (totalPassengers >= 9) return;
      
      // Infants cannot exceed adults (as they must sit on an adult's lap)
      if (type === 'infants' && newValue.infants >= newValue.adults) return;
      
      newValue[type]++;
    } else {
      // Maintain minimum requirements
      if (type === 'adults' && newValue.adults <= 1) return; // At least 1 adult required
      if (type === 'adults' && newValue.infants >= newValue.adults) return; // Can't reduce adults below infant count
      if ((type === 'children' || type === 'infants') && newValue[type] <= 0) return;
      
      newValue[type]--;
    }
    onChange(newValue);
  };

  return (
    <div className="relative">
      <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Passengers
      </Label>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 justify-between text-left font-normal bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700"
      >
        <span>
          {value.adults + value.children + value.infants} Passenger{value.adults + value.children + value.infants !== 1 ? 's' : ''}
        </span>
        <Users className="w-4 h-4" />
      </Button>

      {isOpen && (
        <Card className="absolute z-50 w-full mt-2 p-4 bg-gray-800 border-gray-700 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Adults</p>
                <p className="text-xs text-gray-400">Age 12+</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateCount('adults', false)}
                  className="h-8 w-8 bg-gray-700/50 border-gray-600"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-white">{value.adults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateCount('adults', true)}
                  className="h-8 w-8 bg-gray-700/50 border-gray-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Children</p>
                <p className="text-xs text-gray-400">Age 2-11</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateCount('children', false)}
                  className="h-8 w-8 bg-gray-700/50 border-gray-600"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-white">{value.children}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateCount('children', true)}
                  className="h-8 w-8 bg-gray-700/50 border-gray-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Infants</p>
                <p className="text-xs text-gray-400">Under 2 (on lap)</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateCount('infants', false)}
                  className="h-8 w-8 bg-gray-700/50 border-gray-600"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-white">{value.infants}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateCount('infants', true)}
                  className="h-8 w-8 bg-gray-700/50 border-gray-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};