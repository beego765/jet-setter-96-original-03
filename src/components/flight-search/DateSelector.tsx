import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateSelectorProps {
  label: string;
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  onComplete?: () => void;
}

export const DateSelector = ({ label, date, onSelect, onComplete }: DateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    onSelect(selectedDate);
    setOpen(false);
    if (selectedDate && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-12 justify-start text-left font-normal bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700",
              !date && "text-gray-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            className="rounded-md border border-gray-700 bg-gray-800"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};