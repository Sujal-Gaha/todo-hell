import { Card, CardContent } from "@/components/ui/card";
import { TMonthlyStat } from "../types/stats";

export const MonthlyStatsCard = ({
  monthlyStats,
}: {
  monthlyStats: TMonthlyStat;
}) => {
  return (
    <Card className="cyber-card border-glow-purple hover:glow-purple transition-all duration-300 mb-8">
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-sm text-neon-purple font-matrix mb-2">
            MONTHLY ANALYSIS
          </p>
          <p className="text-xl font-cyber font-bold text-neon-purple text-glow-purple mb-4">
            {monthlyStats.monthName}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neon-cyan font-matrix">
                Tasks Started
              </p>
              <p className="text-2xl font-cyber font-bold text-neon-cyan">
                {monthlyStats.tasksStarted}
              </p>
            </div>
            <div>
              <p className="text-sm text-neon-green font-matrix">
                Tasks Completed
              </p>
              <p className="text-2xl font-cyber font-bold text-neon-green">
                {monthlyStats.tasksCompleted}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
