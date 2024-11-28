import { Card } from "@/components/ui/card";

interface AirlineInfoProps {
  name: string;
  logoUrl?: string;
  iataCode?: string;
}

export const AirlineInfo = ({ name, logoUrl, iataCode }: AirlineInfoProps) => {
  // Use a fallback image if no logo URL is provided
  const fallbackLogoUrl = `https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg`;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-8 h-8 rounded-full overflow-hidden">
        <img
          src={logoUrl || fallbackLogoUrl}
          alt={`${name} logo`}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = fallbackLogoUrl;
          }}
        />
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        {iataCode && (
          <p className="text-xs text-gray-400">Code: {iataCode}</p>
        )}
      </div>
    </div>
  );
};