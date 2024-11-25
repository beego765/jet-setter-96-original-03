import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

interface LoyaltyCardProps {
  points: number;
  tier: string;
  nextTierPoints: number;
}

export const LoyaltyCard = ({ points, tier, nextTierPoints }: LoyaltyCardProps) => {
  const progress = (points / nextTierPoints) * 100;

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg border-gray-700 p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-purple-500/20 rounded-full">
          <Award className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Loyalty Program</h3>
          <p className="text-sm text-gray-300">{tier} Member</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Current Points</span>
          <span className="font-semibold text-white">{points} pts</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-400">
          {nextTierPoints - points} points until next tier
        </p>
      </div>
    </Card>
  );
};