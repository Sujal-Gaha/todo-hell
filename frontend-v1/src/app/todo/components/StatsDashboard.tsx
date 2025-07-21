import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, BarChart3, CheckCircle2, Clock } from "lucide-react";
import { TStat } from "../types/stats";

export const StatsDashboard = ({ stats }: { stats: TStat }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="cyber-card border-glow-cyan hover:glow-cyan transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neon-cyan font-matrix mb-1">
                TOTAL TASKS
              </p>
              <p className="text-3xl font-cyber font-bold text-neon-cyan text-glow-cyan">
                {stats.total}
              </p>
            </div>
            <BarChart3 className="h-10 w-10 text-neon-cyan animate-pulse" />
          </div>
        </CardContent>
      </Card>

      <Card className="cyber-card border-glow-green hover:glow-green transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neon-green font-matrix mb-1">
                COMPLETED
              </p>
              <p className="text-3xl font-cyber font-bold text-neon-green text-glow-green">
                {stats.completed}
              </p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-neon-green animate-pulse" />
          </div>
        </CardContent>
      </Card>

      <Card className="cyber-card border-glow-purple hover:glow-purple transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neon-purple font-matrix mb-1">
                ACTIVE
              </p>
              <p className="text-3xl font-cyber font-bold text-neon-purple text-glow-purple">
                {stats.active}
              </p>
            </div>
            <Clock className="h-10 w-10 text-neon-purple animate-pulse" />
          </div>
        </CardContent>
      </Card>

      <Card className="cyber-card border-glow-pink hover:glow-pink transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neon-pink font-matrix mb-1">OVERDUE</p>
              <p className="text-3xl font-cyber font-bold text-neon-pink text-glow-pink animate-pulse">
                {stats.overdue}
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-neon-pink animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
