import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
  change?: string;
  additionalLabel?: string;
}

export const StatCard = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value,
  change,
  additionalLabel,
}: StatCardProps) => {
  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center justify-between">
        <div className={`p-3 ${iconBgColor} rounded-xl`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {change && (
          <span className="flex items-center text-green-400 text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            {change}
          </span>
        )}
        {additionalLabel && (
          <span className="text-sm text-gray-400">{additionalLabel}</span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-gray-400">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
};