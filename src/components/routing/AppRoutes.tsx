import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Index from "@/pages/Index";
import Deals from "@/pages/Deals";
import MyBookings from "@/pages/MyBookings";
import Support from "@/pages/Support";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import Search from "@/pages/Search";
import FlightSummary from "@/pages/FlightSummary";
import BookingDetails from "@/pages/BookingDetails";
import SeatSelection from "@/components/booking/SeatSelection";
import PassengerDetails from "@/pages/PassengerDetails";
import Payment from "@/pages/Payment";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/search" element={<Search />} />
      <Route path="/flight-summary" element={<FlightSummary />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/my-bookings" element={
        <ProtectedRoute>
          <MyBookings />
        </ProtectedRoute>
      } />
      <Route path="/booking/:flightId" element={
        <ProtectedRoute>
          <BookingDetails />
        </ProtectedRoute>
      } />
      <Route path="/booking/:flightId/passenger-details" element={
        <ProtectedRoute>
          <PassengerDetails />
        </ProtectedRoute>
      } />
      <Route path="/booking/:flightId/seat-selection" element={
        <ProtectedRoute>
          <SeatSelection />
        </ProtectedRoute>
      } />
      <Route path="/booking/:flightId/payment" element={
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      } />
      <Route path="/support" element={<Support />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <Admin />
        </ProtectedRoute>
      } />
    </Routes>
  );
};