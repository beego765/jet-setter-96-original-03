import { PaymentSummary } from "./PaymentSummary";
import { PaymentActions } from "./PaymentActions";
import { Card } from "@/components/ui/card";

interface PaymentOptionsProps {
  booking: any;
  flightDetails: any;
  onPayNow: () => void;
  onHoldOrder: () => void;
}

export const PaymentOptions = ({ booking, flightDetails, onPayNow, onHoldOrder }: PaymentOptionsProps) => {
  if (!booking) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Payment Options</h2>
      <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <PaymentSummary booking={booking} flightDetails={flightDetails} />
      </Card>
      <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <PaymentActions 
          booking={booking}
          flightDetails={flightDetails}
          onPayNow={onPayNow}
          onHoldOrder={onHoldOrder}
        />
      </Card>
    </div>
  );
};