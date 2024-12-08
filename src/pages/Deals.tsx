import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Tag, Clock, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Deals = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals', selectedCategory],
    queryFn: async () => {
      let query = supabase.from('deals').select('*');
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Error loading deals",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data;
    },
  });

  const categories = [
    { id: "all", name: "All Deals" },
    { id: "weekend", name: "Weekend Getaways" },
    { id: "seasonal", name: "Seasonal Offers" },
    { id: "business", name: "Business Class" },
  ];

  const handleBookNow = (dealId: string) => {
    toast({
      title: "Deal Selected!",
      description: "You'll be redirected to complete your booking.",
    });
  };

  const calculateTimeLeft = (validUntil: string) => {
    const difference = +new Date(validUntil) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }

    return timeLeft;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="relative h-72 mb-8">
        <img
          src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80"
          alt="Travel Deals"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent">
          <div className="container max-w-7xl mx-auto px-4 h-full flex items-end pb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Special Deals
              </h1>
              <p className="text-gray-300 max-w-2xl">
                Discover our best flight offers with exclusive discounts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "border-gray-700 hover:bg-gray-700"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const timeLeft = calculateTimeLeft(deal.valid_until);
            
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group overflow-hidden bg-gray-800/50 backdrop-blur-lg border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={deal.image_url}
                      alt={deal.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/90 text-white rounded-full text-sm font-medium">
                      {deal.discount}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
                        <p className="text-gray-400 text-sm">{deal.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400">
                          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400 line-through">£{deal.original_price}</p>
                        <p className="text-2xl font-bold text-blue-400">£{deal.price}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBookNow(deal.id)}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 group"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Deals;