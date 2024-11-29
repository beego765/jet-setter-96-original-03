import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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

  if (!booking || !flightDetails) {
    return null;
  }

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);
      const baseAmount = parseFloat(flightDetails?.data?.total_amount || booking.total_price);
      const taxAmount = parseFloat(flightDetails?.data?.tax_amount || 0);
      const feesAmount = parseFloat(flightDetails?.data?.service_fees_amount || 0);
      const totalAmount = baseAmount + taxAmount + feesAmount;

      // Create payment record in Supabase
      const { data: paymentData, error: paymentError } = await supabase
        .from('booking_payments')
        .insert({
          booking_id: booking.id,
          amount: totalAmount,
          base_amount: baseAmount,
          taxes_amount: taxAmount,
          fees_amount: feesAmount,
          status: 'processing'
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Process payment with Duffel
      const { data: duffelPayment, error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: `/air/payments`,
          method: 'POST',
          body: {
            data: {
              amount: totalAmount.toString(),
              currency: flightDetails?.data?.total_currency || 'GBP',
              order_id: booking.duffel_booking_id
            }
          }
        }
      });

      if (duffelError) throw duffelError;

      // Update payment record with Duffel payment ID
      await supabase
        .from('booking_payments')
        .update({
          status: 'completed',
          duffel_payment_id: duffelPayment.id
        })
        .eq('id', paymentData.id);

      // Update booking status
      await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', booking.id);

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
      const baseAmount = parseFloat(flightDetails?.data?.total_amount || booking.total_price);
      const taxAmount = parseFloat(flightDetails?.data?.tax_amount || 0);
      const feesAmount = parseFloat(flightDetails?.data?.service_fees_amount || 0);
      const totalAmount = baseAmount + taxAmount + feesAmount;

      // Create hold record in Supabase
      const { error: paymentError } = await supabase
        .from('booking_payments')
        .insert({
          booking_id: booking.id,
          amount: totalAmount,
          base_amount: baseAmount,
          taxes_amount: taxAmount,
          fees_amount: feesAmount,
          status: 'held'
        });

      if (paymentError) throw paymentError;

      // Update booking status
      await supabase
        .from('bookings')
        .update({ status: 'draft' })
        .eq('id', booking.id);

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

  return (
    <div className="flex justify-between items-center mt-6">
      {flightDetails?.data?.payment_requirements?.requires_instant_payment === false && (
        <Button
          variant="outline"
          className="border-gray-700"
          onClick={handleHold}
          disabled={isProcessing || booking.booking_payments?.[0]?.status === 'held'}
        >
          {isProcessing ? "Processing..." : "Hold for 24h"}
        </Button>
      )}
      <Button
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        onClick={handlePayNow}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
};