import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type Booking = {
  id: string;
  customer: string;
  destination: string;
  date: string;
  status: string;
};

type BookingPayload = {
  id: string;
  passenger_details: Array<{ first_name: string; last_name: string }>;
  destination: string;
  departure_date: string;
  status: string;
};

export const useBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const { data: initialBookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          passenger_details(first_name, last_name),
          destination,
          departure_date,
          status
        `)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((booking: BookingPayload) => ({
        id: booking.id,
        customer: booking.passenger_details?.[0] 
          ? `${booking.passenger_details[0].first_name} ${booking.passenger_details[0].last_name}`
          : 'N/A',
        destination: booking.destination,
        date: booking.departure_date,
        status: booking.status
      }));
    }
  });

  useEffect(() => {
    if (initialBookings) {
      setBookings(initialBookings);
    }
  }, [initialBookings]);

  useEffect(() => {
    const bookingsSubscription = supabase
      .channel('bookings-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        async (payload: RealtimePostgresChangesPayload<any>) => {
          if (!payload.new && !payload.old) return;

          // Only proceed if the booking is confirmed or was confirmed
          if (
            (payload.new && payload.new.status !== 'confirmed') && 
            (payload.old && payload.old.status !== 'confirmed')
          ) {
            return;
          }

          // Fetch the complete booking data including passenger details
          const { data: newBooking, error } = await supabase
            .from('bookings')
            .select(`
              id,
              passenger_details(first_name, last_name),
              destination,
              departure_date,
              status
            `)
            .eq('id', payload.new?.id || payload.old?.id)
            .single();

          if (error) {
            toast({
              title: "Error updating bookings",
              description: error.message,
              variant: "destructive"
            });
            return;
          }

          // Only proceed with confirmed bookings
          if (newBooking && newBooking.status === 'confirmed') {
            const formattedBooking = {
              id: newBooking.id,
              customer: newBooking.passenger_details?.[0] 
                ? `${newBooking.passenger_details[0].first_name} ${newBooking.passenger_details[0].last_name}`
                : 'N/A',
              destination: newBooking.destination,
              date: newBooking.departure_date,
              status: newBooking.status
            };

            if (payload.eventType === 'INSERT') {
              setBookings(prev => [formattedBooking, ...prev]);
              toast({
                title: "New booking received",
                description: `Booking for ${formattedBooking.customer} has been added.`
              });
            } else if (payload.eventType === 'UPDATE') {
              setBookings(prev => 
                prev.map(booking => 
                  booking.id === formattedBooking.id ? formattedBooking : booking
                )
              );
              toast({
                title: "Booking updated",
                description: `Booking for ${formattedBooking.customer} has been updated.`
              });
            }
          } else if (payload.eventType === 'DELETE' || (payload.eventType === 'UPDATE' && newBooking?.status !== 'confirmed')) {
            // Remove booking if deleted or status changed from confirmed
            setBookings(prev => prev.filter(booking => booking.id !== (payload.old?.id || payload.new?.id)));
            toast({
              title: "Booking removed",
              description: "A booking has been removed from the list."
            });
          }
        }
      )
      .subscribe();

    return () => {
      bookingsSubscription.unsubscribe();
    };
  }, [toast]);

  return { bookings };
};