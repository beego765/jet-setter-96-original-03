import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, BarChart, Users } from "lucide-react";

export const ActivityLog = () => (
  <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Recent Activity</h2>
      <Button variant="ghost" className="text-gray-400 hover:text-white">
        View All
      </Button>
    </div>
    <div className="space-y-4">
      {[
        { title: "New Booking #1234", time: "2 hours ago", icon: Plane },
        { title: "Revenue Report Generated", time: "4 hours ago", icon: BarChart },
        { title: "New User Registration", time: "5 hours ago", icon: Users },
      ].map((activity, i) => (
        <div key={i} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
          <div className="p-2 bg-gray-700 rounded-full">
            <activity.icon className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-gray-400">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);