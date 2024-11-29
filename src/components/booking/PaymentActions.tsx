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

// Helper functions to keep the component smaller
const createPaymentRecord = async (bookingId: string, amounts: any) => {
  const { data, error } = await supabase
    .from('booking_payments')
    .insert({
      booking_id: bookingId,
      amount: amounts.total,
      base_amount: amounts.base,
      taxes_amount: amounts.taxes,
      fees_amount: amounts.fees,
      status: 'processing'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateBookingStatus = async (bookingId: string, status: string) => {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) throw error;
};

export const PaymentActions = ({ booking, flightDetails, onPayNow, onHoldOrder }: PaymentActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!booking || !flightDetails?.data) {
    return null;
  }

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);
      const amounts = {
        base: parseFloat(flightDetails.data.total_amount || booking.total_price),
        taxes: parseFloat(flightDetails.data.tax_amount || 0),
        fees: parseFloat(flightDetails.data.service_fees_amount || 0),
      };
      amounts.total = amounts.base + amounts.taxes + amounts.fees;

      // Create initial payment record
      const paymentData = await createPaymentRecord(booking.id, amounts);

      // Process payment with Duffel
      const { data: duffelPayment, error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: `/air/payments`,
          method: 'POST',
          body: {
            data: {
              amount: amounts.total.toString(),
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
      const amounts = {
        base: parseFloat(flightDetails.data.total_amount || booking.total_price),
        taxes: parseFloat(flightDetails.data.tax_amount || 0),
        fees: parseFloat(flightDetails.data.service_fees_amount || 0),
      };
      amounts.total = amounts.base + amounts.taxes + amounts.fees;

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

  return (
    <div className="flex justify-between items-center mt-6">
      {flightDetails.data.payment_requirements?.requires_instant_payment === false && (
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
