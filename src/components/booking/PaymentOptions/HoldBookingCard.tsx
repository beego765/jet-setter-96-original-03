import { Button } from "@/components/ui/button";
import { Clock, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HoldBookingCardProps {
  isProcessing: boolean;
  isHeld: boolean;
  onHold: () => void;
}

export const HoldBookingCard = ({ isProcessing, isHeld, onHold }: HoldBookingCardProps) => {
  return (
    <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-400" />
          Hold Booking
        </CardTitle>
        <CardDescription>
          Reserve your booking for 24 hours without payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-full border-gray-700 hover:bg-gray-700/50"
          onClick={onHold}
          disabled={isProcessing || isHeld}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          ) : isHeld ? (
            "Currently Held"
          ) : (
            "Hold for 24h"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};