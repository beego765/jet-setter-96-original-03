import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, Download } from "lucide-react";
import { useState } from "react";

export const BookingsTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                className="pl-10 bg-gray-700/50 border-gray-600"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="border-gray-600">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-gray-700">
          <Table>
            <thead className="bg-gray-800/50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Booking ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Destination
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "B001",
                  customer: "John Doe",
                  destination: "Paris",
                  date: "2024-03-15",
                  status: "Confirmed"
                },
                {
                  id: "B002",
                  customer: "Jane Smith",
                  destination: "Tokyo",
                  date: "2024-03-20",
                  status: "Pending"
                }
              ].map((booking) => (
                <tr key={booking.id} className="border-t border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-300">{booking.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {booking.customer}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {booking.destination}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {booking.date}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === "Confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600"
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Booking Calendar</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="text-white"
        />
      </Card>
    </div>
  );
};

export default BookingsTab;