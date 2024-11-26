import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

interface AuthButtonsProps {
  session: any;
  onSignIn: () => void;
  onSignOut: () => void;
  className?: string;
}

export const AuthButtons = ({ session, onSignIn, onSignOut, className = "" }: AuthButtonsProps) => {
  return (
    <div className={className}>
      {session ? (
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-white"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-white"
          onClick={onSignIn}
        >
          <User className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      )}
    </div>
  );
};