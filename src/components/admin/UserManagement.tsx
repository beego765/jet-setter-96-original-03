import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserFilters } from "./UserFilters";
import { UserActions } from "./UserActions";
import { UserCard } from "./UserCard";
import type { UserProfile, UserRole } from "./types";

export const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
          <UserActions />
        </div>

        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      <div className="mt-6 space-y-4">
        {filteredUsers.map((user: UserProfile) => (
          <UserCard 
            key={user.id} 
            user={user} 
            onAction={handleAction}
          />
        ))}
      </div>
    </Card>
  );
};