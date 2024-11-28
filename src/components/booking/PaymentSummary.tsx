import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

interface PaymentSummaryProps {
  booking: any;
  flightDetails: any;
}

export const PaymentSummary = ({ booking, flightDetails }: PaymentSummaryProps) => {
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
    </div>
  );
};