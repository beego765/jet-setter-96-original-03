import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface BookingActionsProps {
  onSave: () => void;
  onConfirm: () => void;
}

export const BookingActions = ({ onSave, onConfirm }: BookingActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        className="border-gray-700"
        onClick={onSave}
      >
        Save for Later
      </Button>
      <Button
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        onClick={onConfirm}
      >
        Confirm Booking
      </Button>
    </div>
  );
};