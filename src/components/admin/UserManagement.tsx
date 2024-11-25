import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, UserCheck, UserX, MoreHorizontal, Filter, Download, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

export const UserManagement = () => {
  const { toast } = useToast();

  const handleAction = (action: string, userId: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} action for user ${userId}`,
    });
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 mt-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-100">User Management</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
              Add User
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Search users..." 
              className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder:text-gray-400"
            />
          </div>
          <div className="flex-1">
            <Select>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {[
          { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", lastActive: "2 hours ago" },
          { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Manager", status: "Active", lastActive: "1 day ago" },
          { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "Agent", status: "Inactive", lastActive: "5 days ago" },
          { id: "4", name: "Alice Brown", email: "alice@example.com", role: "Manager", status: "Suspended", lastActive: "1 hour ago" },
          { id: "5", name: "Charlie Davis", email: "charlie@example.com", role: "Agent", status: "Active", lastActive: "3 hours ago" },
        ].map((user) => (
          <div key={user.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-100">{user.name}</p>
                {user.role === "Admin" && <Shield className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-sm text-gray-300">{user.email}</p>
              <p className="text-xs text-gray-400">Last active: {user.lastActive}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" 
                className={`
                  ${user.status === "Active" ? "border-green-500 text-green-400" : 
                    user.status === "Inactive" ? "border-red-500 text-red-400" : 
                    "border-yellow-500 text-yellow-400"}
                `}
              >
                {user.status === "Active" ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                {user.status}
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                {user.role}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-200 hover:text-white hover:bg-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuLabel className="text-gray-200">Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                    onClick={() => handleAction("edit", user.id)}
                  >
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                    onClick={() => handleAction("permissions", user.id)}
                  >
                    Manage Permissions
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                    onClick={() => handleAction("reset", user.id)}
                  >
                    Reset Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-gray-700 focus:bg-gray-700"
                    onClick={() => handleAction("delete", user.id)}
                  >
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};