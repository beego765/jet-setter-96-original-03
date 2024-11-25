import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemHealth } from "@/components/admin/SystemHealth";
import { Select } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Filter,
  Search,
  Calendar as CalendarIcon,
  Download,
  Printer,
  MoreHorizontal,
  Edit,
  Trash,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Admin = () => {
  const { toast } = useToast();
  const [stats] = useState({
    totalBookings: 1234,
    totalRevenue: 456789,
    activeUsers: 789,
    upcomingFlights: 56,
    monthlyGrowth: "+12.5%",
    customerSatisfaction: "4.8/5",
    topDestination: "London",
    avgTicketPrice: "£350",
    bookingsChange: "+15%",
    revenueChange: "+8.3%",
    userChange: "+5.2%",
  });

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        <AdminHeader />
        <StatsGrid stats={stats} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700 w-full justify-start overflow-x-auto">
            <TabsTrigger 
              value="overview" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              System
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardCharts />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <ActivityLog />
              <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleExportData}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    Export Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white"
                  >
                    Generate Report
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-100">Booking Management</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-600">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                    <Button variant="outline" className="border-gray-600">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" className="border-gray-600">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input 
                    placeholder="Search bookings..." 
                    className="bg-gray-700/50 border-gray-600"
                  />
                  <Select>
                    <option value="">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                  <Select>
                    <option value="">All Classes</option>
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </Select>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                    New Booking
                  </Button>
                </div>

                <div className="rounded-lg border border-gray-700 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-800/50">
                        <TableHead className="text-gray-300">Booking ID</TableHead>
                        <TableHead className="text-gray-300">Passenger</TableHead>
                        <TableHead className="text-gray-300">Flight</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3].map((booking) => (
                        <TableRow key={booking} className="border-gray-700 hover:bg-gray-800/50">
                          <TableCell className="font-mono text-gray-300">BK-{booking}234</TableCell>
                          <TableCell className="text-gray-300">John Doe</TableCell>
                          <TableCell className="text-gray-300">LHR → JFK</TableCell>
                          <TableCell className="text-gray-300">2024-03-15</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                              Confirmed
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-300">£499.99</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                <DropdownMenuItem className="text-gray-300 hover:text-white cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-green-400 hover:text-green-300 cursor-pointer">
                                  <CheckCircle className="mr-2 h-4 w-4" /> Confirm
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:text-red-300 cursor-pointer">
                                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:text-red-300 cursor-pointer">
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Showing 1-3 of 100 bookings</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-600">Previous</Button>
                    <Button variant="outline" className="border-gray-600">Next</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system">
            <SystemHealth />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-6">Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Site Name</label>
                    <Input defaultValue="OpusTravels Admin" className="bg-gray-700/50 border-gray-600 text-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Contact Email</label>
                    <Input defaultValue="admin@opustravels.com" className="bg-gray-700/50 border-gray-600 text-gray-200" />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
