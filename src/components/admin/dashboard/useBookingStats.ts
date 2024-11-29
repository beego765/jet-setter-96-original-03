import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, format, subMonths } from "date-fns";
import { BookingStats, BookingTrend, DestinationData } from "./types";

export const useBookingStats = () => {
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [destinationStats, setDestinationStats] = useState<DestinationData[]>([]);

  const processBookingData = (bookings: any[]) => {
    const months = Array.from({ length: 5 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return startOfMonth(date);
    }).reverse();

    // Process booking trends
    const trends = months.map(month => {
      const count = bookings.filter(booking => {
        const bookingDate = new Date(booking.departure_date);
        return startOfMonth(bookingDate).getTime() === month.getTime();
      }).length;

      return {
        x: format(month, 'MMM'),
        y: count
      };
    });

    // Process destination stats
    const destinationCounts = bookings.reduce((acc: Record<string, number>, booking) => {
      const destination = booking.destination || 'Unknown';
      acc[destination] = (acc[destination] || 0) + 1;
      return acc;
    }, {});

    const destinations: DestinationData[] = Object.entries(destinationCounts)
      .map(([id, value]) => ({ 
        id, 
        value: Number(value) 
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { trends, destinations };
  };

  // Initial data fetch
  const { data: initialData } = useQuery({
    queryKey: ['booking-stats'],
    queryFn: async () => {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('departure_date, destination')
        .gte('created_at', subMonths(startOfMonth(new Date()), 4).toISOString());

      if (error) throw error;
      if (!bookings) return { trends: [], destinations: [] };

      return processBookingData(bookings);
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 60000, // Keep data in cache for 1 minute (formerly cacheTime)
  });

  useEffect(() => {
    if (initialData) {
      setBookingTrends(initialData.trends);
      setDestinationStats(initialData.destinations);
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('booking-stats')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `created_at.gte.${subMonths(startOfMonth(new Date()), 4).toISOString()}`
        },
        async (payload) => {
          console.log('Received real-time update:', payload);
          
          const { data: refreshedData, error } = await supabase
            .from('bookings')
            .select('departure_date, destination')
            .gte('created_at', subMonths(startOfMonth(new Date()), 4).toISOString());

          if (error) {
            console.error('Error fetching updated data:', error);
            return;
          }

          if (refreshedData) {
            const { trends, destinations } = processBookingData(refreshedData);
            setBookingTrends(trends);
            setDestinationStats(destinations);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up subscription');
      channel.unsubscribe();
    };
  }, [initialData]);

  return {
    bookingTrends,
    destinationStats
  };
};