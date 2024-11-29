import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FlightPricingProps {
  price: number;
  onSelect: () => void;
  isLoading: boolean;
}

export const FlightPricing = ({ price, onSelect, isLoading }: FlightPricingProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">£{price.toFixed(2)}</p>
        <p className="text-sm text-gray-400">per passenger</p>
      </div>
      <Button
        onClick={onSelect}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : null}
        Select Flight
      </Button>
    </div>
  );
};