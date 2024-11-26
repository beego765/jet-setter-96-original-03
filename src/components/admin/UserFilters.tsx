import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type UserRole } from "./types";

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: "all" | UserRole;
  setRoleFilter: (value: "all" | UserRole) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export const UserFilters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}: UserFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input 
        placeholder="Search users..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder:text-gray-400"
      />
      <Select 
        value={roleFilter} 
        onValueChange={(value: "all" | UserRole) => setRoleFilter(value)}
      >
        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        value={statusFilter} 
        onValueChange={setStatusFilter}
      >
        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};