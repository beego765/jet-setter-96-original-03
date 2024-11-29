import { Button } from "../../ui/button";
import { Trash } from "lucide-react";
import { Deal } from "../types/deals";

interface DealsListProps {
  deals: Deal[];
  onDelete: (id: string) => void;
}

export const DealsList = ({ deals, onDelete }: DealsListProps) => {
  return (
    <div className="space-y-4">
      {deals?.map((deal) => (
        <div
          key={deal.id}
          className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
        >
          <div>
            <h3 className="font-medium text-gray-200">{deal.title}</h3>
            <p className="text-sm text-gray-400">
              {deal.destination} - {deal.discount}
            </p>
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => deal.id && onDelete(deal.id)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};