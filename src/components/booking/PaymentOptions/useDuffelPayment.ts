import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createPaymentRecord, updateBookingStatus } from "@/services/paymentService";
import { calculatePaymentAmounts } from "@/utils/paymentCalculations";

export const useDuffelPayment = (booking: any, flightDetails: any, onPayNow: () => void, onHoldOrder: () => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePayNow = async () => {
    try {
      // Validate booking ID
      if (!booking?.duffel_booking_id) {
        throw new Error("Invalid booking: missing Duffel booking ID");
      }

      setIsProcessing(true);
      setPaymentError(null);
      const amounts = calculatePaymentAmounts(flightDetails, booking.total_price);

      console.log('Processing payment with amounts:', amounts);
      console.log('Duffel booking ID:', booking.duffel_booking_id);

      // Create initial payment record
      const paymentData = await createPaymentRecord(booking.id, amounts);

      console.log('Created payment record:', paymentData);

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

      if (duffelError) {
        console.error('Duffel payment error:', duffelError);
        throw duffelError;
      }

      console.log('Duffel payment response:', duffelPayment);

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
      const errorMessage = error.message || error.error?.message || "There was an error processing your payment";
      setPaymentError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
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

      console.log('Processing hold request for booking:', booking.duffel_booking_id);

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

      if (duffelError) {
        console.error('Hold request error:', duffelError);
        throw duffelError;
      }

      console.log('Hold response:', duffelHold);

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
      const errorMessage = error.message || error.error?.message || "There was an error holding your booking";
      setPaymentError(errorMessage);
      toast({
        title: "Hold Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    paymentError,
    handlePayNow,
    handleHold
  };
};