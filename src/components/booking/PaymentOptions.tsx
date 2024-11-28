import { PaymentSummary } from "./PaymentSummary";
import { PaymentActions } from "./PaymentActions";

interface PaymentOptionsProps {
  booking: any;
  flightDetails: any;
  onPayNow: () => void;
  onHoldOrder: () => void;
}

export const PaymentOptions = ({ booking, flightDetails, onPayNow, onHoldOrder }: PaymentOptionsProps) => {
  if (!booking || !flightDetails) return null;

  return (
    <div className="space-y-4">
      <PaymentSummary booking={booking} flightDetails={flightDetails} />
      <PaymentActions 
        booking={booking} 
        flightDetails={flightDetails} 
        onPayNow={onPayNow} 
        onHoldOrder={onHoldOrder} 
      />
    </div>
  );
};