import { Button } from "@/components/ui/button";

interface FlightPricingProps {
  price: number;
  onSelect: () => void;
  isLoading: boolean;
}

export const FlightPricing = ({ price, onSelect, isLoading }: FlightPricingProps) => {
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(price);

  return (
    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
      <p className="text-3xl font-bold text-purple-400">{formattedPrice}</p>
      <Button 
        onClick={onSelect}
        disabled={isLoading}
        className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
      >
        {isLoading ? "Processing..." : "Select"}
      </Button>
    </div>
  );
};