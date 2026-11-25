import { ActiveMode, MetricSnapshot } from "../types";
import { Cpu, Layers, Disc, Terminal, ShieldAlert, CpuIcon, Sparkles, Download } from "lucide-react";

interface HeaderProps {
  activeMode: ActiveMode;
  onModeChange: (mode: ActiveMode) => void;
  metrics: MetricSnapshot;
  onDownloadClick: () => void;
}

export default function Header({ activeMode, onModeChange, metrics, onDownloadClick }: HeaderProps) {
  const modesList: { id: ActiveMode; label: string; icon: any }[] = [
    { id: "DESIGN", label: "Design Workspace", icon: Layers },
    { id: "LOGIC", label: "Logic Flow Nodes", icon: Cpu },
    { id: "MUSIC", label: "Synthesis Studio", icon: Disc },
    { id: "DEPLOY", label: "Deployment Pipeline", icon: Terminal },
    { id: "MODEL_GARDEN", label: "Model Garden", icon: Sparkles },
    { id: "SPECS", label: "Platform Specs", icon: ShieldAlert },
  ];

  return (
    <header className="border-b border-cyan-500/10 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            {/* Custom mini Dyablo SVG Logo */}
            <svg className="h-6 w-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20,25 C25,45 35,50 50,20 C65,50 75,45 80,25 C75,55 65,70 50,75 C35,70 25,55 20,25 Z" stroke="#00f0ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="50" r="10" fill="#a855f7" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-lg font-bold tracking-[0.15em] text-white">DYABLO</span>
              <span className="font-sans text-lg font-bold tracking-[0.15em] text-cyan-400 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">CORE</span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
              By KNOCKSSTUDiOS
            </div>
          </div>
        </div>

        {/* Navigation Modes */}
        <nav className="hidden lg:flex items-center gap-1">
          {modesList.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all duration-300 ${
                  isSelected 
                    ? "bg-cyan-950/40 border border-cyan-400/30 text-cyan-400" 
                    : "border border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-900/60"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-cyan-400" : "text-gray-500"} />
                {mode.label}
                {isSelected && (
                  <span className="absolute -bottom-[1px] left-1/3 right-1/3 h-[1px] bg-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Nav Button Indicator & Telemetry */}
        <div className="flex items-center gap-4">
          <button
            id="btn-header-download-app"
            onClick={onDownloadClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-mono text-xs font-bold rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(219,39,119,0.2)] hover:shadow-[0_0_25px_rgba(219,39,119,0.45)] active:scale-95 animate-pulse"
            style={{ animationDuration: "3s" }}
          >
            <Download size={13} className="animate-bounce" />
            <span className="hidden sm:inline">DOWNLOAD APP</span>
            <span className="inline sm:hidden">GET</span>
          </button>

          <div className="flex items-center gap-3 text-right">
            {/* Real-time statistics indicator */}
            <div className="hidden sm:block">
              <div className="text-[10px] font-mono text-gray-500 tracking-wider">GPU MEMORY</div>
              <div className="text-xs font-mono font-medium text-cyan-400">
                {metrics.gpuMemoryUsed} / {metrics.gpuMemoryMax} MB
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] font-mono text-gray-500 tracking-wider">LATENCY</div>
              <div className="text-xs font-mono font-medium text-teal-400">
                {metrics.latency}ms
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-500 tracking-wider">ENGINE ACCEL</div>
              <div className="flex items-center gap-1 text-xs font-mono font-medium text-purple-400 justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                {metrics.fps} FPS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Bar Mobile Mode Selection */}
      <div className="flex lg:hidden overflow-x-auto border-t border-cyan-500/5 px-2 py-1.5 gap-1 select-none scrollbar-none">
        {modesList.map((mode) => {
          const isSelected = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`flex-none px-3 py-1 rounded-md font-mono text-[10px] tracking-wider transition-all border ${
                isSelected 
                  ? "bg-cyan-950/40 border-cyan-500/20 text-cyan-400" 
                  : "bg-transparent border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {mode.label.split(" ")[0]}
            </button>
          );
        })}
      </div>
    </header>
  );
}
