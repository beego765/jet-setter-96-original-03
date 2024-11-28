import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plane, Clock, Calendar, Users, Luggage } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const BookingDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [passengerDetails, setPassengerDetails] = useState<any>({
    title: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    passportNumber: '',
    passportExpiry: '',
    passportCountry: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', flightId)
          .single();

        if (bookingError) throw bookingError;

        // Fetch flight details from Duffel API via Edge Function
        const { data: duffelData, error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
          body: {
            path: `/air/offers/${bookingData.duffel_offer_id}`,
            method: 'GET'
          }
        });

        if (duffelError) throw duffelError;

        setBooking(bookingData);
        setFlightDetails(duffelData);
      } catch (error: any) {
        toast({
          title: "Error fetching booking details",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (flightId) {
      fetchBookingDetails();
    }
  }, [flightId, toast]);

  const handlePassengerDetailsChange = (field: string, value: string) => {
    setPassengerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayNow = async () => {
    try {
      // Create order in Duffel
      const { data: orderData, error: orderError } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: '/air/orders',
          method: 'POST',
          body: {
            data: {
              selected_offers: [booking.duffel_offer_id],
              passengers: [{
                type: 'adult',
                title: passengerDetails.title,
                gender: passengerDetails.gender,
                given_name: passengerDetails.firstName,
                family_name: passengerDetails.lastName,
                born_on: passengerDetails.dateOfBirth,
                email: passengerDetails.email,
                phone_number: passengerDetails.phoneNumber,
                documents: [{
                  type: 'passport',
                  number: passengerDetails.passportNumber,
                  expires_on: passengerDetails.passportExpiry,
                  issuing_country_code: passengerDetails.passportCountry
                }]
              }]
            }
          }
        }
      });

      if (orderError) throw orderError;

      // Update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          booking_reference: orderData.booking_reference
        })
        .eq('id', flightId);

      if (updateError) throw updateError;

      toast({
        title: "Booking Confirmed",
        description: "Your booking has been confirmed successfully!"
      });
      
      navigate('/my-bookings');
    } catch (error: any) {
      toast({
        title: "Error confirming booking",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleHoldOrder = async () => {
    try {
      // Create hold order in Duffel
      const { data: holdData, error: holdError } = await supabase.functions.invoke('duffel-proxy', {
        body: {
          path: '/air/orders/holds',
          method: 'POST',
          body: {
            data: {
              selected_offers: [booking.duffel_offer_id],
              passengers: [{
                type: 'adult',
                title: passengerDetails.title,
                given_name: passengerDetails.firstName,
                family_name: passengerDetails.lastName,
                born_on: passengerDetails.dateOfBirth,
                email: passengerDetails.email,
                phone_number: passengerDetails.phoneNumber
              }]
            }
          }
        }
      });

      if (holdError) throw holdError;

      toast({
        title: "Order Held",
        description: "Your order has been held for 24 hours"
      });
      
      navigate('/my-bookings');
    } catch (error: any) {
      toast({
        title: "Error holding order",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Flight Summary */}
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(booking.departure_date), 'EEE, dd MMM yyyy')}</span>
                <Users className="w-4 h-4 ml-4" />
                <span>{booking.passengers} Passenger</span>
                <span className="ml-4">{booking.cabin_class}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-3xl font-bold">{flightDetails?.slices[0]?.departure?.time || '16:15'}</p>
                  <p className="text-sm font-medium bg-gray-700/50 px-3 py-1 rounded-full">
                    {booking.origin}
                  </p>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="w-full flex items-center gap-2">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/20 to-blue-400"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Plane className="w-4 h-4 text-blue-400 rotate-90" />
                    </div>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-400 to-blue-500/20"></div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-400">
                      {flightDetails?.slices[0]?.duration || '21h 55m'}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold">{flightDetails?.slices[0]?.arrival?.time || '19:10+1'}</p>
                  <p className="text-sm font-medium bg-gray-700/50 px-3 py-1 rounded-full">
                    {booking.destination}
                  </p>
                </div>
              </div>

              {/* Flight Details */}
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Flight Details</h3>
                {flightDetails?.slices?.map((slice: any, index: number) => (
                  <div key={index} className="border-t border-gray-700 pt-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={slice?.carrier?.logo_url || '/placeholder.svg'} 
                        alt={slice?.carrier?.name}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <p className="font-medium">{slice?.carrier?.name}</p>
                        <p className="text-sm text-gray-400">Flight {slice?.flight_number}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Luggage className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {slice?.passengers?.[0]?.baggages?.carry_on?.count || 1} carry-on bag
                          {slice?.passengers?.[0]?.baggages?.checked?.count || 1} checked bag
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Passenger Details */}
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Select onValueChange={(value) => handlePassengerDetailsChange('title', value)}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mr">Mr</SelectItem>
                    <SelectItem value="mrs">Mrs</SelectItem>
                    <SelectItem value="ms">Ms</SelectItem>
                    <SelectItem value="miss">Miss</SelectItem>
                    <SelectItem value="dr">Dr</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select onValueChange={(value) => handlePassengerDetailsChange('gender', value)}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Male</SelectItem>
                    <SelectItem value="f">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  className="bg-gray-700/50 border-gray-600"
                  onChange={(e) => handlePassengerDetailsChange('firstName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  className="bg-gray-700/50 border-gray-600"
                  onChange={(e) => handlePassengerDetailsChange('lastName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  className="bg-gray-700/50 border-gray-600"
                  onChange={(e) => handlePassengerDetailsChange('dateOfBirth', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  className="bg-gray-700/50 border-gray-600"
                  onChange={(e) => handlePassengerDetailsChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  className="bg-gray-700/50 border-gray-600"
                  onChange={(e) => handlePassengerDetailsChange('phoneNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Passport Number</Label>
                <Input
                  className="bg-gray-700/50 border-gray-600"
                  onChange={(e) => handlePassengerDetailsChange('passportNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Passport Expiry</Label>
                <Input
                  type="date"
                  className="bg-gray-700/50 border-gray-600"
                  onChange={(e) => handlePassengerDetailsChange('passportExpiry', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Passport Country</Label>
                <Input
                  className="bg-gray-700/50 border-gray-600"
                  onChange={(e) => handlePassengerDetailsChange('passportCountry', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Payment Options */}
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-2xl font-bold">£{booking.total_price}</p>
                </div>
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    className="border-gray-700"
                    onClick={handleHoldOrder}
                  >
                    Hold for 24h
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    onClick={handlePayNow}
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
