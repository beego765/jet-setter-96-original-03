import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlightPricingProps {
  price: number;
  onSelect: () => void;
  isLoading?: boolean;
  conditions?: {
    refundable: boolean;
    changeable: boolean;
    refundPenalty?: number;
    changePenalty?: number;
  };
}

export const FlightPricing = ({ price, onSelect, isLoading, conditions }: FlightPricingProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-2xl font-bold">£{price.toFixed(2)}</p>
        <div className="flex gap-2">
          {conditions?.refundable && (
            <Badge variant="outline" className="text-green-400 border-green-400">
              Refundable {conditions.refundPenalty ? `(£${conditions.refundPenalty})` : ''}
            </Badge>
          )}
          {conditions?.changeable && (
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              Changes allowed {conditions.changePenalty ? `(£${conditions.changePenalty})` : ''}
            </Badge>
          )}
        </div>
      </div>
      
      <Button
        onClick={onSelect}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </>
        ) : (
          'Select'
        )}
      </Button>
    </div>
  );
};