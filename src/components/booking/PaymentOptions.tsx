import { Button } from "@/components/ui/button";

interface PaymentOptionsProps {
  booking: any;
  onPayNow: () => void;
  onHoldOrder: () => void;
}

export const PaymentOptions = ({ booking, onPayNow, onHoldOrder }: PaymentOptionsProps) => {
  if (!booking) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Total Amount</p>
          <p className="text-2xl font-bold">£{booking.total_price}</p>
        </div>
        <div className="space-x-4">
          <Button
            variant="outline"
            className="border-gray-700"
            onClick={onHoldOrder}
          >
            Hold for 24h
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            onClick={onPayNow}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};