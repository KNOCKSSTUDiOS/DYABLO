import React from "react";
import { Cpu, Terminal, Sparkles, Flame, Orbit } from "lucide-react";

interface EngineSelectorProps {
  activeEngine: string;
  onSelectEngine: (engineName: string) => void;
}

const ENGINES = [
  { 
    id: "SORA 2", 
    label: "SORA 2", 
    desc: "120fps volumetric video matrix", 
    icon: Orbit, 
    color: "from-purple-500 to-pink-500", 
    accent: "text-pink-400" 
  },
  { 
    id: "OMNI FLASH", 
    label: "OMNI FLASH", 
    desc: "Low-latency reactive prompt mesh", 
    icon: Sparkles, 
    color: "from-cyan-500 to-blue-500", 
    accent: "text-cyan-400" 
  },
  { 
    id: "VEO 3N", 
    label: "VEO 3N", 
    desc: "8K bioluminescent camera pipeline", 
    icon: Flame, 
    color: "from-amber-500 to-red-500", 
    accent: "text-amber-400" 
  },
  { 
    id: "OLLAMA", 
    label: "OLLAMA", 
    desc: "Direct local GPU model interface", 
    icon: Cpu, 
    color: "from-emerald-500 to-teal-500", 
    accent: "text-emerald-400" 
  },
  { 
    id: "CLOUDFABRICATOR", 
    label: "CLOUDFABRICATOR", 
    desc: "Unrestricted cloud GPGPU allocation", 
    icon: Terminal, 
    color: "from-blue-600 to-indigo-600", 
    accent: "text-indigo-400" 
  }
];

export default function EngineSelector({ activeEngine, onSelectEngine }: EngineSelectorProps) {
  return (
    <div id="engine-selector-container" className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-3 font-mono">
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-white font-bold tracking-wider">
          <Terminal size={14} className="text-cyan-400" />
          ACTIVE SYNTHESIS ENGINE MATRIX
        </div>
        <span className="text-[9px] text-gray-500">SELECT TO BOOT SHADERS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {ENGINES.map((engine) => {
          const Icon = engine.icon;
          const isActive = activeEngine === engine.id;
          return (
            <button
              id={`engine-chip-${engine.id.toLowerCase().replace(/\s+/g, "-")}`}
              key={engine.id}
              onClick={() => onSelectEngine(engine.id)}
              className={`relative text-left p-3 rounded-lg border transition-all duration-300 group flex flex-col justify-between h-24 ${
                isActive 
                  ? "bg-gray-950 border-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.08)]" 
                  : "bg-gray-950/60 border-gray-850 hover:border-gray-700 hover:bg-gray-950"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`p-1 rounded bg-gray-900 border ${isActive ? "border-cyan-500/30" : "border-gray-800"}`}>
                  <Icon size={14} className={isActive ? engine.accent : "text-gray-500"} />
                </div>
                <div className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-cyan-400 animate-pulse" : "bg-gray-800"}`} />
              </div>

              <div className="mt-2">
                <div className="text-[11px] font-bold text-white tracking-wider flex items-center gap-1">
                  {engine.label}
                </div>
                <div className="text-[8px] text-gray-500 truncate mt-0.5 font-sans">
                  {engine.desc}
                </div>
              </div>

              {isActive && (
                <div className={`absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r ${engine.color}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
