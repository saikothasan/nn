import { Terminal, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[var(--background)]">
      
      <div className="max-w-md w-full border border-[var(--border)] bg-[var(--muted)]/20 p-8 rounded-sm text-center">
        
        {/* Icon Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <div className="relative bg-[var(--background)] border border-[var(--border)] p-4 rounded-sm">
              <Terminal className="w-8 h-8 text-[var(--foreground)]" />
            </div>
          </div>
        </div>

        {/* Text Status */}
        <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight mb-2">
          Initializing Environment
        </h2>
        
        {/* Console Log Simulation */}
        <div className="font-mono text-xs text-[var(--muted-foreground)] space-y-1 mb-6 text-left bg-[var(--background)] p-4 border border-[var(--border)] h-24 overflow-hidden">
          <div className="flex gap-2">
            <span className="text-emerald-500">✓</span> <span>Loading Edge Runtime...</span>
          </div>
          <div className="flex gap-2">
            <span className="text-emerald-500">✓</span> <span>Verifying security headers...</span>
          </div>
          <div className="flex gap-2 animate-pulse">
            <span className="text-blue-500">➜</span> <span>Mounting tool component...</span>
          </div>
        </div>

        {/* Spinner */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
           <Loader2 className="w-3.5 h-3.5 animate-spin" />
           <span>PLEASE WAIT</span>
        </div>
      </div>
    </div>
  );
}
