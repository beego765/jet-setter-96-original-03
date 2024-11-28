import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BookingHeaderProps {
  booking: any;
}

export const BookingHeader = ({ booking }: BookingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Booking Details</h1>
      <Button
        variant="outline"
        onClick={() => navigate('/my-bookings')}
        className="border-gray-700"
      >
        Back to My Bookings
      </Button>
    </div>
  );
};