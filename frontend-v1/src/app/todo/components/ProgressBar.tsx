import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const ProgressBar = ({
  monthFilter,
  monthName,
  completionRate,
}: {
  monthFilter: string;
  completionRate: number;
  monthName: string;
}) => {
  return (
    <Card className="cyber-card border-glow-cyan mb-8 hologram">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-cyber text-neon-cyan">
            {monthFilter === "all"
              ? "NEURAL PROGRESS SYNC"
              : `PROGRESS: ${monthName}`}
          </span>
          <span className="text-lg font-matrix text-neon-pink text-glow-pink">
            {completionRate.toFixed(1)}%
          </span>
        </div>
        <div className="relative">
          <Progress
            value={completionRate}
            className="h-4 bg-cyber-dark border border-neon-cyan/30"
          />
          <div
            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full transition-all duration-500 glow-cyan"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
