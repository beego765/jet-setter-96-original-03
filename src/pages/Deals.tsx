import { Card } from "@/components/ui/card";
import { Plane, Tag, Clock } from "lucide-react";

const Deals = () => {
  const deals = [
    {
      id: 1,
      title: "Weekend Getaway",
      description: "Fly to Paris for a romantic weekend",
      discount: "20% OFF",
      validUntil: "2024-04-30",
      price: 299,
    },
    {
      id: 2,
      title: "Summer Special",
      description: "Beach destinations at unbeatable prices",
      discount: "30% OFF",
      validUntil: "2024-05-15",
      price: 399,
    },
    {
      id: 3,
      title: "Business Class Upgrade",
      description: "Upgrade your experience for less",
      discount: "25% OFF",
      validUntil: "2024-04-20",
      price: 599,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Special Deals
          </h1>
          <p className="text-gray-300">Discover our best flight offers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Plane className="w-6 h-6 text-blue-400" />
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  {deal.discount}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
              <p className="text-gray-400 mb-4">{deal.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Valid until {deal.validUntil}</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">${deal.price}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deals;