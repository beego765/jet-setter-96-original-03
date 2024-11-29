export interface PaymentAmounts {
  baseAmount: number;
  taxesAmount: number;
  feesAmount: number;
  totalAmount: number;
}

export const calculatePaymentAmounts = (
  flightDetails: any,
  bookingTotalPrice: number
): PaymentAmounts => {
  const baseAmount = parseFloat(flightDetails?.data?.total_amount || bookingTotalPrice);
  const taxesAmount = parseFloat(flightDetails?.data?.tax_amount || 0);
  const feesAmount = parseFloat(flightDetails?.data?.service_fees_amount || 0);
  const totalAmount = baseAmount + taxesAmount + feesAmount;

  return {
    baseAmount,
    taxesAmount,
    feesAmount,
    totalAmount
  };
};