import { LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  value: number;
  progressColor: string;
  label: string;
}

export const MetricCard = ({
  icon: Icon,
  iconColor,
  title,
  value,
  progressColor,
  label,
}: MetricCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span className="text-gray-200">{title}</span>
      </div>
      <Progress value={value} className={`bg-gray-700 [&>div]:${progressColor}`} />
      <p className="text-sm text-gray-300">{value}% {label}</p>
    </div>
  );
};