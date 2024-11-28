import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface PaymentOptionsProps {
  booking: any;
  flightDetails: any;
  onPayNow: () => void;
  onHoldOrder: () => void;
}

export const PaymentOptions = ({ booking, flightDetails, onPayNow, onHoldOrder }: PaymentOptionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!booking || !flightDetails) return null;

  const baseAmount = parseFloat(flightDetails.data?.total_amount || booking.total_price);
  const taxAmount = parseFloat(flightDetails.data?.tax_amount || 0);
  const feesAmount = parseFloat(flightDetails.data?.service_fees_amount || 0);
  const totalAmount = baseAmount + taxAmount + feesAmount;

  // Calculate any additional fees from services
  const additionalServices = flightDetails.data?.services || [];
  const servicesTotal = additionalServices.reduce((acc: number, service: any) => 
    acc + parseFloat(service.amount || 0), 0
  );

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);

      // Create payment record in Supabase
      const { data: paymentData, error: paymentError } = await supabase
        .from('booking_payments')
        .insert({
          booking_id: booking.id,
          amount: totalAmount + servicesTotal,
          base_amount: baseAmount,
          taxes_amount: taxAmount,
          fees_amount: feesAmount + servicesTotal,
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
              amount: (totalAmount + servicesTotal).toString(),
              currency: flightDetails.data?.total_currency || 'GBP',
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

      // Create hold record in Supabase
      const { error: paymentError } = await supabase
        .from('booking_payments')
        .insert({
          booking_id: booking.id,
          amount: totalAmount + servicesTotal,
          base_amount: baseAmount,
          taxes_amount: taxAmount,
          fees_amount: feesAmount + servicesTotal,
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
      <Card className="p-4 space-y-4 bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Fare</span>
            <span>£{baseAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Taxes</span>
            <span>£{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Service Fees</span>
            <span>£{feesAmount.toFixed(2)}</span>
          </div>

          {additionalServices.length > 0 && (
            <>
              <Separator className="my-2 bg-gray-700" />
              <div className="space-y-1">
                <span className="text-sm font-medium">Additional Services</span>
                {additionalServices.map((service: any, index: number) => (
                  <div key={index} className="flex justify-between text-gray-400 text-sm">
                    <span>{service.name}</span>
                    <span>£{parseFloat(service.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <Separator className="my-2 bg-gray-700" />
          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>£{(totalAmount + servicesTotal).toFixed(2)}</span>
          </div>
        </div>

        {booking.booking_payments?.[0]?.status === 'held' && (
          <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 p-3 rounded-lg mt-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">This booking is currently on hold</span>
          </div>
        )}
      </Card>

      <div className="flex justify-between items-center mt-6">
        {flightDetails.data?.payment_requirements?.requires_instant_payment === false && (
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
    </div>
  );
};