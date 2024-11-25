import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Clock, QrCode, Download, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface BoardingPassProps {
  flightNumber: string;
  seat: string;
  gate: string;
  boardingTime: string;
  departureTime: string;
  qrCode: string;
  terminal: string;
}

export const BoardingPass = ({
  flightNumber,
  seat,
  gate,
  boardingTime,
  departureTime,
  qrCode,
  terminal
}: BoardingPassProps) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const departure = new Date(departureTime);
      const now = new Date();
      const difference = departure.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Departed");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [departureTime]);

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg border-gray-700 p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Plane className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <span className="text-lg font-semibold">Flight {flightNumber}</span>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Time until departure: {timeLeft}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-400">Seat</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                {seat}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Gate</p>
              <p className="text-lg font-semibold">{gate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Terminal</p>
              <p className="text-lg font-semibold">{terminal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Boarding</p>
              <p className="text-lg font-semibold">{boardingTime}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-lg">
            <QrCode className="w-24 h-24 text-gray-900" />
          </div>
          <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Download Pass
          </Button>
        </div>
      </div>
    </Card>
  );
};