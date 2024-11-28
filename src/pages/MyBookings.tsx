import { useEffect, useState } from "react";
import { LoyaltyCard } from "@/components/bookings/LoyaltyCard";
import { BookingCard } from "@/components/bookings/BookingCard";
import { TravelStats } from "@/components/bookings/TravelStats";
import { BoardingPass } from "@/components/bookings/BoardingPass";
import { BookingsCalendar } from "@/components/bookings/BookingsCalendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const MyBookings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [travelStats, setTravelStats] = useState({
    totalMiles: 0,
    visitedDestinations: 0,
    totalBookings: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch travel stats
        const { data: statsData, error: statsError } = await supabase
          .from('travel_stats')
          .select('*')
          .eq('user_id', user.id);

        if (statsError) throw statsError;
        
        // If stats exist, use them. Otherwise, use defaults
        if (statsData && statsData.length > 0) {
          setTravelStats({
            totalMiles: statsData[0].total_miles || 0,
            visitedDestinations: statsData[0].visited_destinations || 0,
            totalBookings: statsData[0].total_bookings || 0
          });
        }

        // Fetch bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('departure_date', { ascending: true });

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const loyaltyInfo = {
    points: 750,
    tier: "Gold",
    nextTierPoints: 1000
  };

  const upcomingBooking = bookings.find(b => b.status === 'confirmed' && new Date(b.departure_date) > new Date());
  const upcomingBoardingPass = upcomingBooking ? {
    flightNumber: upcomingBooking.booking_reference || 'N/A',
    seat: "12A",
    gate: "B22",
    boardingTime: "10:30",
    departureTime: upcomingBooking.departure_date,
    terminal: "T2",
    qrCode: "boarding-pass-qr"
  } : null;

  const flights = bookings.map(booking => ({
    date: new Date(booking.departure_date),
    flightNumber: booking.booking_reference || 'N/A',
    destination: booking.destination
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            My Bookings
          </h1>
          <p className="text-gray-300">Manage your flight bookings and travel details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <TravelStats {...travelStats} />
            <LoyaltyCard {...loyaltyInfo} />
          </div>
          <div>
            <BookingsCalendar flights={flights} />
          </div>
        </div>

        {upcomingBoardingPass && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Digital Boarding Pass</h2>
            <BoardingPass {...upcomingBoardingPass} />
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={{
                  id: booking.id,
                  flightNumber: booking.booking_reference || 'N/A',
                  from: booking.origin,
                  to: booking.destination,
                  date: booking.departure_date,
                  status: booking.status
                }}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No bookings found. Start planning your next adventure!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;