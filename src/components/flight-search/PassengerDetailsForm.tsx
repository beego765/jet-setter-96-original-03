import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Flight } from "./types";

interface PassengerDetailsFormProps {
  flight: Flight;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  onComplete: (passengerDetails: any[]) => void;
}

export const PassengerDetailsForm = ({ flight, passengers, onComplete }: PassengerDetailsFormProps) => {
  const { toast } = useToast();
  const [passengerDetails, setPassengerDetails] = useState<any[]>([]);
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passengerDetails.length !== totalPassengers) {
      toast({
        title: "Missing Information",
        description: "Please fill in details for all passengers",
        variant: "destructive",
      });
      return;
    }
    onComplete(passengerDetails);
  };

  const updatePassengerDetail = (index: number, field: string, value: string) => {
    const updatedDetails = [...passengerDetails];
    if (!updatedDetails[index]) {
      updatedDetails[index] = {};
    }
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPassengerDetails(updatedDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        {Array.from({ length: totalPassengers }).map((_, index) => (
          <Card key={index} className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Passenger {index + 1}
                {index < passengers.adults ? " (Adult)" : 
                 index < passengers.adults + passengers.children ? " (Child)" : " (Infant)"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${index}`}>First Name</Label>
                  <Input
                    id={`firstName-${index}`}
                    placeholder="Enter first name"
                    className="bg-gray-700/50 border-gray-600"
                    onChange={(e) => updatePassengerDetail(index, 'firstName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                  <Input
                    id={`lastName-${index}`}
                    placeholder="Enter last name"
                    className="bg-gray-700/50 border-gray-600"
                    onChange={(e) => updatePassengerDetail(index, 'lastName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`dob-${index}`}>Date of Birth</Label>
                  <Input
                    id={`dob-${index}`}
                    type="date"
                    className="bg-gray-700/50 border-gray-600"
                    onChange={(e) => updatePassengerDetail(index, 'dateOfBirth', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`passport-${index}`}>Passport Number</Label>
                  <Input
                    id={`passport-${index}`}
                    placeholder="Enter passport number"
                    className="bg-gray-700/50 border-gray-600"
                    onChange={(e) => updatePassengerDetail(index, 'passportNumber', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      >
        Continue to Payment
      </Button>
    </form>
  );
};