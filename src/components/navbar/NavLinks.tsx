import { Link } from "react-router-dom";
import { Tag, BookOpen, HelpCircle, Settings } from "lucide-react";

interface NavLinksProps {
  session: any;
  isAdmin: boolean;
  onNavigate?: (path: string) => void;
  className?: string;
}

export const NavLinks = ({ session, isAdmin, onNavigate, className = "" }: NavLinksProps) => {
  return (
    <div className={className}>
      <Link to="/deals" className="text-gray-300 hover:text-white flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Deals
      </Link>
      {session && (
        <Link to="/my-bookings" className="text-gray-300 hover:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          My Bookings
        </Link>
      )}
      <Link to="/support" className="text-gray-300 hover:text-white flex items-center gap-2">
        <HelpCircle className="w-4 h-4" />
        Support
      </Link>
      {isAdmin && (
        <Link
          to="/admin"
          className="text-gray-300 hover:text-white flex items-center gap-2"
          onClick={() => onNavigate?.('/admin')}
        >
          <Settings className="w-4 h-4" />
          Admin
        </Link>
      )}
    </div>
  );
};