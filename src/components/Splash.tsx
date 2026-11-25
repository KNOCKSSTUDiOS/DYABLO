import { useEffect, useState } from "react";
import { Sparkles, Shield, Cpu, Zap } from "lucide-react";

interface SplashProps {
  onDismiss: () => void;
}

export default function Splash({ onDismiss }: SplashProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Dyablo deepsea physics engine...");

  useEffect(() => {
    const startProgress = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(startProgress);
          return 100;
        }
        
        // Progress text transitions
        if (prev === 20) setStatusText("Calibrating bioluminescent volumetric scatter grids...");
        if (prev === 50) setStatusText("Generating 8K HDR Raytrace pipeline shader maps...");
        if (prev === 80) setStatusText("Booting real-time Web Audio synthesis interfaces...");
        if (prev === 95) setStatusText("Dyablo Core operational. Zero-Sandbox link established.");
        
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(startProgress);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950 font-sans text-gray-100 select-none overflow-hidden transition-all duration-1000"
      style={{
        backgroundImage: "radial-gradient(circle at center, rgba(3, 20, 35, 0.95) 0%, rgba(2, 4, 12, 1) 100%)"
      }}
    >
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Futuristic Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="relative z-10 max-w-xl w-full px-6 text-center flex flex-col items-center">
        {/* Brand Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-full text-xs text-cyan-400 font-mono tracking-widest uppercase mb-6 animate-pulse">
          <Sparkles size={12} className="text-cyan-400" />
          KNOCKSSTUDiOS Presents
        </div>

        {/* Dynamic Glowing SVG Logo for DYABLO */}
        <div className="mb-6 filter drop-shadow-[0_0_20px_rgba(0,240,255,0.6)] animate-pulse">
          <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dyablo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Horns / Trident shape resembling sea demon */}
            <path d="M20,25 C25,45 35,50 50,20 C65,50 75,45 80,25 C75,55 65,70 50,75 C35,70 25,55 20,25 Z" stroke="url(#dyablo-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50,20 L50,85" stroke="url(#dyablo-grad)" strokeWidth="2" strokeDasharray="3 3" />
            {/* Bioluminescent core bulb */}
            <circle cx="50" cy="50" r="10" fill="#00f0ff" className="animate-ping" style={{ transformOrigin: 'center' }} />
            <circle cx="50" cy="50" r="7" fill="url(#dyablo-grad)" />
            {/* Side sparks */}
            <circle cx="28" cy="45" r="2.5" fill="#00f0ff" />
            <circle cx="72" cy="45" r="2.5" fill="#ec4899" />
          </svg>
        </div>

        {/* Master Logo */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-[0.25em] text-white select-none font-sans mb-2">
          DYABLO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 filter drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">ENGINE</span>
        </h1>
        
        <p className="text-sm font-mono tracking-widest text-gray-400 uppercase mb-10">
          8K HDR • Deepsea Bioluminescent Particle & Audio Synthesis
        </p>

        {/* System Loader Widget */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-2xl mb-8 w-full">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-3">
            <span className="flex items-center gap-1.5 text-cyan-500">
              <Cpu size={12} className="animate-spin" />
              DYABLO PHYSICS SHADER CORE: v3.12-HDR
            </span>
            <span className="text-cyan-400">{progress}%</span>
          </div>

          {/* Loadbar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-400 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_#00F0FF]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 text-xs font-mono text-gray-400 min-h-[16px] animate-pulse">
            {statusText}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onDismiss}
          disabled={progress < 100}
          className={`relative group px-8 py-3.5 rounded-lg border font-mono tracking-widest text-sm uppercase font-semibold transition-all duration-500 ${
            progress === 100 
              ? "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer hover:scale-[1.03] active:scale-[0.98]" 
              : "bg-gray-900/40 border-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          {progress === 100 ? "Initiate Dyablo Core" : "Establishing Link..."}
          
          {progress === 100 && (
            <div className="absolute inset-0 -z-10 rounded-lg bg-cyan-400 opacity-20 filter blur-md transition-all duration-300 group-hover:opacity-40" />
          )}
        </button>

        {/* Architecture Badges */}
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-sm mx-auto text-center opacity-50">
          <div className="flex flex-col items-center">
            <Shield size={16} className="text-cyan-400 mb-1" />
            <span className="text-[10px] font-mono text-gray-400">Zero Sandbox</span>
          </div>
          <div className="flex flex-col items-center">
            <Cpu size={16} className="text-purple-400 mb-1" />
            <span className="text-[10px] font-mono text-gray-400">8K HDR GPU</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap size={16} className="text-pink-400 mb-1" />
            <span className="text-[10px] font-mono text-gray-400">PCM AudioPort</span>
          </div>
        </div>
      </div>
    </div>
  );
}
