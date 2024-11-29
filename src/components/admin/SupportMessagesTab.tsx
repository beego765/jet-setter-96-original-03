import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SupportMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  admin_notes: string | null;
  created_at: string;
};

export const SupportMessagesTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['support-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportMessage[];
    }
  });

  const updateMessageStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: SupportMessage['status']; notes?: string }) => {
      const { error } = await supabase
        .from('support_messages')
        .update({ 
          status,
          ...(notes && { admin_notes: notes })
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-messages'] });
      toast({
        title: "Message updated successfully",
        duration: 2000,
      });
      setSelectedMessage(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error updating message",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleStatusChange = (message: SupportMessage, newStatus: SupportMessage['status']) => {
    updateMessageStatus.mutateAsync({
      id: message.id,
      status: newStatus,
      notes: adminNotes || undefined
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-100">Support Messages</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      message.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                      message.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      message.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {message.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMessage(message)}
                      className="border-gray-700 hover:bg-gray-700"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <Card className="bg-gray-800/95 backdrop-blur-lg border-gray-700 p-6 max-w-2xl w-full space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">Message Details</h3>
                  <p className="text-sm text-gray-400">From: {selectedMessage.name}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                  className="border-gray-700 hover:bg-gray-700"
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Message:</label>
                  <p className="text-gray-100 bg-gray-700/50 p-3 rounded-md">{selectedMessage.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Contact Information:</label>
                  <p className="text-gray-100">Email: {selectedMessage.email}</p>
                  {selectedMessage.phone && <p className="text-gray-100">Phone: {selectedMessage.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Admin Notes:</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this support request..."
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  {selectedMessage.status !== 'in_progress' && (
                    <Button
                      onClick={() => handleStatusChange(selectedMessage, 'in_progress')}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Mark In Progress
                    </Button>
                  )}
                  {selectedMessage.status !== 'resolved' && (
                    <Button
                      onClick={() => handleStatusChange(selectedMessage, 'resolved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Resolved
                    </Button>
                  )}
                  {selectedMessage.status !== 'closed' && (
                    <Button
                      onClick={() => handleStatusChange(selectedMessage, 'closed')}
                      variant="destructive"
                    >
                      Close Request
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
};