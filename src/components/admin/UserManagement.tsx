import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, UserCheck, UserX } from "lucide-react";

export const UserManagement = () => (
  <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 mt-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-100">User Management</h2>
      <div className="flex items-center gap-3">
        <Input 
          placeholder="Search users..." 
          className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder:text-gray-400"
        />
        <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white">
          Add User
        </Button>
      </div>
    </div>

    <div className="space-y-4">
      {[
        { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
        { name: "Jane Smith", email: "jane@example.com", role: "Manager", status: "Active" },
        { name: "Bob Wilson", email: "bob@example.com", role: "Agent", status: "Inactive" },
      ].map((user, i) => (
        <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-100">{user.name}</p>
              {user.role === "Admin" && <Shield className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-sm text-gray-300">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className={user.status === "Active" ? "border-green-500 text-green-400" : "border-red-500 text-red-400"}>
              {user.status === "Active" ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
              {user.status}
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              {user.role}
            </Badge>
            <Button variant="ghost" size="sm" className="text-gray-200 hover:text-white hover:bg-gray-700">
              Edit
            </Button>
          </div>
        </div>
      ))}
    </div>
  </Card>
);