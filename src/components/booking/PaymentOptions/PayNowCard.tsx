import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PayNowCardProps {
  isProcessing: boolean;
  onPayNow: () => void;
}

export const PayNowCard = ({ isProcessing, onPayNow }: PayNowCardProps) => {
  return (
    <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-purple-400" />
          Pay Now
        </CardTitle>
        <CardDescription>
          Secure your booking immediately with instant payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          onClick={onPayNow}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Payment...
            </div>
          ) : (
            "Pay Now"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};