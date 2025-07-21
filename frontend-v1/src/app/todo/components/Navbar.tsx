import { Button } from "@/components/ui/button";
import { Cpu, Home, Shield } from "lucide-react";
import Link from "next/link";

export const TodoPageNavbar = () => {
  return (
    <nav className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
              <Cpu className="h-6 w-6 text-cyber-dark" />
            </div>
            <span className="text-2xl font-cyber font-bold text-neon-cyan text-glow-cyan">
              CYBER TODO
            </span>
          </Link>
          <div className="flex items-center gap-4 text-neon-green font-matrix text-sm">
            <Cpu className="h-4 w-4 animate-pulse" />
            <span>NEURAL DASHBOARD ACTIVE</span>
            <Shield className="h-4 w-4 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-cyber-dark font-cyber"
            >
              <Home className="h-4 w-4 mr-2" />
              HOME
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
