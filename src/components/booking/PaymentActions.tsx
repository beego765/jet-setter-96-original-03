import { PaymentError } from "./PaymentOptions/PaymentError";
import { HoldBookingCard } from "./PaymentOptions/HoldBookingCard";
import { PayNowCard } from "./PaymentOptions/PayNowCard";
import { useDuffelPayment } from "./PaymentOptions/useDuffelPayment";

interface PaymentActionsProps {
  booking: any;
  flightDetails: any;
  onPayNow: () => void;
  onHoldOrder: () => void;
}

export const PaymentActions = ({ booking, flightDetails, onPayNow, onHoldOrder }: PaymentActionsProps) => {
  const {
    isProcessing,
    paymentError,
    handlePayNow,
    handleHold
  } = useDuffelPayment(booking, flightDetails, onPayNow, onHoldOrder);

  if (!booking || !flightDetails?.data) {
    return null;
  }

  const isHoldAvailable = flightDetails.data.payment_requirements?.requires_instant_payment === false;
  const isHeld = booking.booking_payments?.[0]?.status === 'held';

  return (
    <div className="space-y-6">
      <PaymentError error={paymentError} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isHoldAvailable && (
          <HoldBookingCard
            isProcessing={isProcessing}
            isHeld={isHeld}
            onHold={handleHold}
          />
        )}
        
        <PayNowCard
          isProcessing={isProcessing}
          onPayNow={handlePayNow}
        />
      </div>
    </div>
  );
};