import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Tag, BookOpen, HelpCircle, User } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              JetSetter
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/deals" className="text-gray-300 hover:text-white flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Deals
            </Link>
            <Link to="/my-bookings" className="text-gray-300 hover:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              My Bookings
            </Link>
            <Link to="/support" className="text-gray-300 hover:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};