import { Card, CardContent } from "@/components/ui/card";
import { Archive } from "lucide-react";

export const NoTaskDetected = () => {
  return (
    <Card className="cyber-card border-glow-purple">
      <CardContent className="p-12 text-center">
        <div className="text-neon-purple mb-6">
          <Archive className="h-16 w-16 mx-auto mb-6 opacity-60 animate-float" />
          <p className="text-2xl font-cyber font-bold text-glow-purple mb-2">
            NO TASKS DETECTED
          </p>
          <p className="text-lg font-matrix text-neon-cyan/60">
            Initialize your first neural task to begin
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
