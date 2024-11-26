import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, UserCheck, UserX, MoreHorizontal } from "lucide-react";
import { type UserProfile } from "./types";

interface UserCardProps {
  user: UserProfile;
  onAction: (action: string, user: UserProfile) => void;
}

export const UserCard = ({ user, onAction }: UserCardProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-100">
            {user.first_name} {user.last_name}
          </p>
          {user.role === "admin" && <Shield className="w-4 h-4 text-purple-400" />}
        </div>
        <p className="text-sm text-gray-300">{user.email}</p>
        <p className="text-xs text-gray-400">
          Last active: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" 
          className={`
            ${user.status === "active" ? "border-green-500 text-green-400" : 
              "border-red-500 text-red-400"}
          `}
        >
          {user.status === "active" ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
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
            {user.status === 'active' ? (
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => onAction('deactivate', user)}
              >
                Deactivate User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => onAction('activate', user)}
              >
                Activate User
              </DropdownMenuItem>
            )}
            {user.role === 'admin' ? (
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => onAction('removeAdmin', user)}
              >
                Remove Admin Role
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => onAction('makeAdmin', user)}
              >
                Make Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-gray-700 focus:bg-gray-700"
              onClick={() => onAction('delete', user)}
            >
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};