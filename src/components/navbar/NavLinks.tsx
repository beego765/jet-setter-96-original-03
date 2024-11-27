import { Link } from "react-router-dom";
import { Tag, BookOpen, HelpCircle, Settings } from "lucide-react";

interface NavLinksProps {
  session: any;
  isAdmin: boolean;
  onNavigate?: (path: string) => void;
  className?: string;
}

export const NavLinks = ({ session, isAdmin, onNavigate, className = "" }: NavLinksProps) => {
  const handleClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={className}>
      <Link 
        to="/deals" 
        className="text-gray-300 hover:text-white flex items-center gap-2"
        onClick={() => handleClick('/deals')}
      >
        <Tag className="w-4 h-4" />
        Deals
      </Link>
      {session && (
        <Link 
          to="/my-bookings" 
          className="text-gray-300 hover:text-white flex items-center gap-2"
          onClick={() => handleClick('/my-bookings')}
        >
          <BookOpen className="w-4 h-4" />
          My Bookings
        </Link>
      )}
      <Link 
        to="/support" 
        className="text-gray-300 hover:text-white flex items-center gap-2"
        onClick={() => handleClick('/support')}
      >
        <HelpCircle className="w-4 h-4" />
        Support
      </Link>
      {session && isAdmin && (
        <Link
          to="/admin"
          className="text-gray-300 hover:text-white flex items-center gap-2"
          onClick={() => handleClick('/admin')}
        >
          <Settings className="w-4 h-4" />
          Admin
        </Link>
      )}
    </div>
  );
};