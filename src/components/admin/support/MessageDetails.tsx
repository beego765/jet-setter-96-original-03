import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SupportMessage } from "../../../types/support";

interface MessageDetailsProps {
  message: SupportMessage;
  adminNotes: string;
  onAdminNotesChange: (notes: string) => void;
  onClose: () => void;
  onStatusChange: (status: SupportMessage['status']) => void;
}

export const MessageDetails = ({
  message,
  adminNotes,
  onAdminNotesChange,
  onClose,
  onStatusChange,
}: MessageDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="bg-gray-800/95 backdrop-blur-lg border-gray-700 p-6 max-w-2xl w-full space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">Message Details</h3>
            <p className="text-sm text-gray-400">From: {message.name}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-gray-700 hover:bg-gray-700"
          >
            Close
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Message:</label>
            <p className="text-gray-100 bg-gray-700/50 p-3 rounded-md">{message.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contact Information:</label>
            <p className="text-gray-100">Email: {message.email}</p>
            {message.phone && <p className="text-gray-100">Phone: {message.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Admin Notes:</label>
            <Textarea
              value={adminNotes}
              onChange={(e) => onAdminNotesChange(e.target.value)}
              placeholder="Add notes about this support request..."
              className="bg-gray-700/50 border-gray-600 text-white"
            />
          </div>

          <div className="flex gap-2">
            {message.status !== 'in_progress' && (
              <Button
                onClick={() => onStatusChange('in_progress')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Mark In Progress
              </Button>
            )}
            {message.status !== 'resolved' && (
              <Button
                onClick={() => onStatusChange('resolved')}
                className="bg-green-600 hover:bg-green-700"
              >
                Mark Resolved
              </Button>
            )}
            {message.status !== 'closed' && (
              <Button
                onClick={() => onStatusChange('closed')}
                variant="destructive"
              >
                Close Request
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};