import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SupportMessage } from "../../../types/support";

interface MessageListProps {
  messages: SupportMessage[];
  onViewDetails: (message: SupportMessage) => void;
}

export const MessageList = ({ messages, onViewDetails }: MessageListProps) => {
  return (
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
                  onClick={() => onViewDetails(message)}
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
  );
};