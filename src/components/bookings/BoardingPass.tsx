import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Clock, QrCode, Download } from "lucide-react";

interface BoardingPassProps {
  flightNumber: string;
  seat: string;
  gate: string;
  boardingTime: string;
  qrCode: string;
}

export const BoardingPass = ({ flightNumber, seat, gate, boardingTime, qrCode }: BoardingPassProps) => (
  <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-gray-700 p-6 mb-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Plane className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-lg font-semibold">Flight {flightNumber}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Seat</p>
            <p className="text-lg font-semibold">{seat}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Gate</p>
            <p className="text-lg font-semibold">{gate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Boarding</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <p className="text-lg font-semibold">{boardingTime}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <QrCode className="w-24 h-24 text-white" />
        <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
          <Download className="w-4 h-4 mr-2" />
          Download Pass
        </Button>
      </div>
    </div>
  </Card>
);