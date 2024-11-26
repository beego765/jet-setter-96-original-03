import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, UserCheck, UserX, MoreHorizontal, Download, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type UserRole = 'user' | 'admin';

type UserProfile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  status: string | null;
  last_login: string | null;
  role?: UserRole;
};

export const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch users with their roles
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role
          )
        `);

      if (profilesError) throw profilesError;

      return profiles.map(profile => ({
        ...profile,
        role: profile.user_roles?.[0]?.role || 'user'
      }));
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
    };
  }, [queryClient]);

  // Update user status mutation
  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Status updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update user role mutation with proper typing
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: role 
        }, 
        { onConflict: 'user_id' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Role updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user: UserProfile) => {
    const matchesSearch = 
      searchTerm === "" ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAction = async (action: string, user: UserProfile) => {
    switch (action) {
      case 'activate':
        await updateUserStatus.mutateAsync({ userId: user.id, status: 'active' });
        break;
      case 'deactivate':
        await updateUserStatus.mutateAsync({ userId: user.id, status: 'inactive' });
        break;
      case 'makeAdmin':
        await updateUserRole.mutateAsync({ userId: user.id, role: 'admin' });
        break;
      case 'removeAdmin':
        await updateUserRole.mutateAsync({ userId: user.id, role: 'user' });
        break;
      default:
        toast({
          title: "Action not implemented",
          description: `${action} action for user ${user.id}`,
        });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 mt-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </Card>
    );
  }

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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder:text-gray-400"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
      </div>

      <div className="mt-6 space-y-4">
        {filteredUsers.map((user: UserProfile) => (
          <div key={user.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
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
                      onClick={() => handleAction('deactivate', user)}
                    >
                      Deactivate User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                      onClick={() => handleAction('activate', user)}
                    >
                      Activate User
                    </DropdownMenuItem>
                  )}
                  {user.role === 'admin' ? (
                    <DropdownMenuItem 
                      className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                      onClick={() => handleAction('removeAdmin', user)}
                    >
                      Remove Admin Role
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                      onClick={() => handleAction('makeAdmin', user)}
                    >
                      Make Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-gray-700 focus:bg-gray-700"
                    onClick={() => handleAction('delete', user)}
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
