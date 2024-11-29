import { supabase } from "@/integrations/supabase/client";
import { PaymentAmounts } from "@/utils/paymentCalculations";

export const createPaymentRecord = async (bookingId: string, amounts: PaymentAmounts) => {
  const { data, error } = await supabase
    .from('booking_payments')
    .insert({
      booking_id: bookingId,
      amount: amounts.totalAmount,
      base_amount: amounts.baseAmount,
      taxes_amount: amounts.taxesAmount,
      fees_amount: amounts.feesAmount,
      status: 'processing'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'draft') => {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) throw error;
};