import { Wifi } from "lucide-react";

export const TodoPageHeader = () => {
  return (
    <div className="mb-8 text-center">
      <h1
        className="text-6xl font-cyber font-black mb-4 glitch text-glow-cyan"
        data-text="NEURAL DASHBOARD"
      >
        <span className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple bg-clip-text text-transparent">
          NEURAL DASHBOARD
        </span>
      </h1>
      <div className="flex items-center justify-center gap-2 mt-2 text-neon-cyan text-sm">
        <Wifi className="h-4 w-4 animate-pulse" />
        <span>QUANTUM ENCRYPTED • NEURAL LINKED • REALITY SYNCED</span>
      </div>
    </div>
  );
};
