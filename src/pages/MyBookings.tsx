import { useEffect, useState } from "react";
import { LoyaltyCard } from "@/components/bookings/LoyaltyCard";
import { TravelStats } from "@/components/bookings/TravelStats";
import { BoardingPass } from "@/components/bookings/BoardingPass";
import { BookingsCalendar } from "@/components/bookings/BookingsCalendar";
import { BookingHeader } from "@/components/bookings/BookingHeader";
import { ConfirmedBookings } from "@/components/bookings/ConfirmedBookings";
import { PendingBookings } from "@/components/bookings/PendingBookings";
import { UserProfileSection } from "@/components/bookings/UserProfileSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const MyBookings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<any[]>([]);
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
        <BookingHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <TravelStats {...travelStats} />
            <LoyaltyCard {...loyaltyInfo} />
          </div>
          <div>
            <BookingsCalendar flights={flights} />
          </div>
        </div>

        <div className="mb-8">
          <UserProfileSection />
        </div>

        {upcomingBoardingPass && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Digital Boarding Pass</h2>
            <BoardingPass {...upcomingBoardingPass} />
          </div>
        )}

        <ConfirmedBookings bookings={confirmedBookings} />
        <PendingBookings bookings={bookings} />
      </div>
    </div>
  );
};

export default MyBookings;