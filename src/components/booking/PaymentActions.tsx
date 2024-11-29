import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Clock, CreditCard, Loader2 } from "lucide-react";
import { createPaymentRecord, updateBookingStatus } from "@/services/paymentService";
import { calculatePaymentAmounts } from "@/utils/paymentCalculations";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentActionsProps {
  booking: any;
  flightDetails: any;
  onPayNow: () => void;
  onHoldOrder: () => void;
}

export const PaymentActions = ({ booking, flightDetails, onPayNow, onHoldOrder }: PaymentActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();

  if (!booking || !flightDetails?.data) {
    return null;
  }

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
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
      setPaymentError(error.message || "There was an error processing your payment");
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
      setPaymentError(null);
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
      await createPaymentRecord(booking.id, amounts);

      // Update booking status
      await updateBookingStatus(booking.id, 'draft');

      toast({
        title: "Booking Held",
        description: "Your booking has been held for 24 hours"
      });

      onHoldOrder();
    } catch (error: any) {
      console.error('Hold error:', error);
      setPaymentError(error.message || "There was an error holding your booking");
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
    <div className="space-y-6">
      {paymentError && (
        <Alert variant="destructive">
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isHoldAvailable && (
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
                onClick={handleHold}
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
        )}
        
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
              onClick={handlePayNow}
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
      </div>
    </div>
  );
};