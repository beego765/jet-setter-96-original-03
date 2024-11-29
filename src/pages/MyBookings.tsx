import { useEffect, useState } from "react";
import { LoyaltyCard } from "@/components/bookings/LoyaltyCard";
import { BookingCard } from "@/components/bookings/BookingCard";
import { TravelStats } from "@/components/bookings/TravelStats";
import { BoardingPass } from "@/components/bookings/BoardingPass";
import { BookingsCalendar } from "@/components/bookings/BookingsCalendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MyBookings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
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
        
        if (statsData && statsData.length > 0) {
          setTravelStats({
            totalMiles: statsData[0].total_miles || 0,
            visitedDestinations: statsData[0].visited_destinations || 0,
            totalBookings: statsData[0].total_bookings || 0
          });
        }

        // Fetch all bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('departure_date', { ascending: true });

        if (bookingsError) throw bookingsError;
        
        // Separate confirmed bookings
        const confirmed = bookingsData?.filter(b => b.status === 'confirmed') || [];
        const other = bookingsData?.filter(b => b.status !== 'confirmed') || [];
        
        setConfirmedBookings(confirmed);
        setBookings(other);

        // Fetch recent searches (mock data for now)
        setSearchHistory([
          { id: 1, from: 'London', to: 'Paris', date: '2024-03-15', searchedAt: '2024-03-01' },
          { id: 2, from: 'New York', to: 'Tokyo', date: '2024-04-20', searchedAt: '2024-03-02' },
          { id: 3, from: 'Dubai', to: 'Singapore', date: '2024-05-10', searchedAt: '2024-03-03' },
        ]);

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

  const upcomingBooking = confirmedBookings.find(b => new Date(b.departure_date) > new Date());
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

        {/* Confirmed Bookings Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Confirmed Bookings</h2>
          <div className="space-y-4">
            {confirmedBookings.length > 0 ? (
              confirmedBookings.map((booking) => (
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
              <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <p className="text-gray-400 text-center">No confirmed bookings yet</p>
              </Card>
            )}
          </div>
        </div>

        {/* Pending or Draft Bookings */}
        {bookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Pending Bookings</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
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
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Searches</h2>
          {searchHistory.length > 0 ? (
            <div className="space-y-4">
              {searchHistory.map((search) => (
                <Card key={search.id} className="p-4 bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-blue-500/20">
                        <Search className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">From {search.from} to {search.to}</p>
                        <p className="text-xs text-gray-500">Date: {search.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Searched on {search.searchedAt}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No recent searches found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;