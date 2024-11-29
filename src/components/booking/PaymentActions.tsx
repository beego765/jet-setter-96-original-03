import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Clock, CreditCard } from "lucide-react";
import { createPaymentRecord, updateBookingStatus } from "@/services/paymentService";
import { calculatePaymentAmounts } from "@/utils/paymentCalculations";
import { supabase } from "@/integrations/supabase/client";

interface PaymentActionsProps {
  booking: any;
  flightDetails: any;
  onPayNow: () => void;
  onHoldOrder: () => void;
}

export const PaymentActions = ({ booking, flightDetails, onPayNow, onHoldOrder }: PaymentActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!booking || !flightDetails?.data) {
    return null;
  }

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);
      const amounts = calculatePaymentAmounts(flightDetails, booking.total_price);

      // Create initial payment record
      const paymentData = await createPaymentRecord(booking.id, amounts);

      // Process payment with Duffel
      const { data: duffelPayment, error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: `/air/payments`,
          method: 'POST',
          body: {
            data: {
              amount: amounts.totalAmount.toString(),
              currency: flightDetails.data.total_currency || 'GBP',
              order_id: booking.duffel_booking_id,
              type: 'balance'
            }
          }
        }
      });

      if (duffelError) throw duffelError;

      // Update payment record with success
      await supabase
        .from('booking_payments')
        .update({
          status: 'completed',
          duffel_payment_id: duffelPayment.data.id
        })
        .eq('id', paymentData.id);

      // Update booking status
      await updateBookingStatus(booking.id, 'confirmed');

      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed"
      });

      onPayNow();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHold = async () => {
    try {
      setIsProcessing(true);
      const amounts = calculatePaymentAmounts(flightDetails, booking.total_price);

      // Create hold order with Duffel
      const { data: duffelHold, error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: `/air/orders/${booking.duffel_booking_id}/hold`,
          method: 'POST',
          body: {
            data: {
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
            }
          }
        }
      });

      if (duffelError) throw duffelError;

      // Create hold payment record
      await createPaymentRecord(booking.id, {
        ...amounts,
        status: 'held'
      });

      // Update booking status
      await updateBookingStatus(booking.id, 'draft');

      toast({
        title: "Booking Held",
        description: "Your booking has been held for 24 hours"
      });

      onHoldOrder();
    } catch (error: any) {
      console.error('Hold error:', error);
      toast({
        title: "Hold Failed",
        description: error.message || "There was an error holding your booking",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isHoldAvailable = flightDetails.data.payment_requirements?.requires_instant_payment === false;
  const isHeld = booking.booking_payments?.[0]?.status === 'held';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isHoldAvailable && (
          <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium">Hold Booking</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Reserve your booking for 24 hours without payment
            </p>
            <Button
              variant="outline"
              className="w-full border-gray-700 hover:bg-gray-700/50"
              onClick={handleHold}
              disabled={isProcessing || isHeld}
            >
              {isProcessing ? "Processing..." : isHeld ? "Currently Held" : "Hold for 24h"}
            </Button>
          </div>
        )}
        
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-medium">Pay Now</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Secure your booking immediately with instant payment
          </p>
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            onClick={handlePayNow}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};