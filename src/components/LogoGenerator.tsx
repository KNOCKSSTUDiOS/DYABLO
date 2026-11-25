import React, { useState } from "react";
import { Download, Sliders, Sparkles, Layers, ShieldCheck, RefreshCw } from "lucide-react";

interface LogoGeneratorProps {
  onAddLog: (level: "INFO" | "WARN" | "SUCCESS" | "ERROR", message: string) => void;
}

type LogoPreset = "ABYSSAL_SIREN" | "NEPTUNE_CORE" | "CHARYBDIS_MAW" | "HYDROTHERMAL_VENT";

export default function LogoGenerator({ onAddLog }: LogoGeneratorProps) {
  // Configurable parameters
  const [activePreset, setActivePreset] = useState<LogoPreset>("ABYSSAL_SIREN");
  const [coreColor, setCoreColor] = useState("#00f0ff"); // Neon Teal
  const [accentColor, setAccentColor] = useState("#a855f7"); // Purple Accent
  const [glowIntensity, setGlowIntensity] = useState(35); // Gaussian Blur radius
  const [sporeCount, setSporeCount] = useState(12); // Bioluminescent spores
  const [ringRotation, setRingRotation] = useState(45); // Core rotation degree
  const [showWatermark, setShowWatermark] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const applyPreset = (preset: LogoPreset) => {
    setActivePreset(preset);
    if (preset === "ABYSSAL_SIREN") {
      setCoreColor("#00f0ff");
      setAccentColor("#a855f7");
      setGlowIntensity(40);
      setSporeCount(14);
      setRingRotation(45);
      onAddLog("INFO", "Bioluminescent Logo: Calibrated to 'Abyssal Siren' (Teal-Purple spectrum)");
    } else if (preset === "NEPTUNE_CORE") {
      setCoreColor("#10b981"); // Emerald
      setAccentColor("#06b6d4"); // Cyan
      setGlowIntensity(55);
      setSporeCount(20);
      setRingRotation(90);
      onAddLog("INFO", "Bioluminescent Logo: Calibrated to 'Neptune Core' (Phos-Green spectrum)");
    } else if (preset === "CHARYBDIS_MAW") {
      setCoreColor("#f43f5e"); // Rose
      setAccentColor("#f59e0b"); // Gold/Amber
      setGlowIntensity(30);
      setSporeCount(8);
      setRingRotation(120);
      onAddLog("INFO", "Bioluminescent Logo: Calibrated to 'Charybdis Maw' (Volcanic Rift spectrum)");
    } else if (preset === "HYDROTHERMAL_VENT") {
      setCoreColor("#ec4899"); // Pink
      setAccentColor("#3b82f6"); // Vivid Blue
      setGlowIntensity(45);
      setSporeCount(16);
      setRingRotation(15);
      onAddLog("INFO", "Bioluminescent Logo: Calibrated to 'Hydrothermal Vent' (Bioluminescent Hotspot)");
    }
  };

  // Dynamically generate the SVG spores (floaters) inside the view
  const generateSporesMarkup = () => {
    const spores = [];
    const seedPoints = [
      { x: 220, y: 180, r: 4 }, { x: 580, y: 190, r: 3 },
      { x: 190, y: 480, r: 5 }, { x: 620, y: 450, r: 4.5 },
      { x: 380, y: 110, r: 3 }, { x: 420, y: 690, r: 4 },
      { x: 120, y: 320, r: 5 }, { x: 680, y: 340, r: 3.5 },
      { x: 300, y: 640, r: 4 }, { x: 500, y: 640, r: 3 },
      { x: 150, y: 550, r: 3 }, { x: 650, y: 550, r: 5 },
      { x: 280, y: 140, r: 4 }, { x: 520, y: 130, r: 3.5 },
      { x: 210, y: 260, r: 3 }, { x: 590, y: 260, r: 4 },
    ];

    for (let i = 0; i < Math.min(sporeCount, seedPoints.length); i++) {
      const pt = seedPoints[i];
      spores.push(
        <g key={i} className="animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
          <circle cx={pt.x} cy={pt.y} r={pt.r + 3} fill={coreColor} opacity="0.25" filter="url(#sporeGlow)" />
          <circle cx={pt.x} cy={pt.y} r={pt.r} fill={coreColor} />
          <circle cx={pt.x} cy={pt.y} r={pt.r * 0.4} fill="#ffffff" />
        </g>
      );
    }
    return spores;
  };

  // Handles compiling & exporting raw clean SVG code as high resolution vector file
  const handleExportSVG = () => {
    setIsExporting(true);
    onAddLog("INFO", "Compiling 8K Vector Matrix into raw XML file stream...");

    setTimeout(() => {
      // Build high-performance XML string
      const svgString = `<?xml version="1.0" encoding="utf-8"?>
<!--
  ========================================================================
  DYABLO DEEP-SEA BIOLUMINESCENT LOGO EXPORT (8K HDR ULTRA GRAPHICS VECTORS)
  LICENSED OPERATOR: KNOCKSSTUDiOS
  OPERATOR EMAIL: KNOCKSSTUDiOS@hollywoodimaging.studio
  METADATA TIMESTAMP: ${new Date().toISOString()}
  ========================================================================
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <!-- Complex multi-layered ambient glow filter mapping -->
    <filter id="bioluminescent-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${glowIntensity}" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="spore-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Deep sea volumetric linear gradients -->
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${coreColor}" />
      <stop offset="50%" stop-color="${accentColor}" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>

    <radialGradient id="oceanBackground" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#020813" />
      <stop offset="60%" stop-color="#010308" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>
  </defs>

  <!-- Deep Ocean Background Backdrop -->
  <rect width="800" height="800" fill="url(#oceanBackground)" />

  <!-- Grid mesh references -->
  <g stroke="rgba(0, 240, 255, 0.03)" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="800" />
    <line x1="200" y1="0" x2="200" y2="800" />
    <line x1="300" y1="0" x2="300" y2="800" />
    <line x1="400" y1="0" x2="400" y2="800" />
    <line x1="500" y1="0" x2="500" y2="800" />
    <line x1="600" y1="0" x2="600" y2="800" />
    <line x1="700" y1="0" x2="700" y2="800" />

    <line x1="0" y1="100" x2="800" y2="100" />
    <line x1="0" y1="200" x2="800" y2="200" />
    <line x1="0" y1="300" x2="800" y2="300" />
    <line x1="0" y1="400" x2="800" y2="400" />
    <line x1="0" y1="500" x2="800" y2="500" />
    <line x1="0" y1="600" x2="800" y2="600" />
    <line x1="0" y1="700" x2="800" y2="700" />
  </g>

  <!-- Bioluminescent outer scattering fields -->
  <g filter="url(#spore-glow)">
    ${[
      { x: 220, y: 180, r: 4 }, { x: 580, y: 190, r: 3 },
      { x: 190, y: 480, r: 5 }, { x: 620, y: 450, r: 4.5 },
      { x: 380, y: 110, r: 3 }, { x: 420, y: 690, r: 4 },
      { x: 120, y: 320, r: 5 }, { x: 680, y: 340, r: 3.5 },
    ]
      .slice(0, Math.min(sporeCount, 8))
      .map(
        (pt) => `
    <circle cx="${pt.x}" cy="${pt.y}" r="${pt.r + 3}" fill="${coreColor}" opacity="0.3" />
    <circle cx="${pt.x}" cy="${pt.y}" r="${pt.r}" fill="${coreColor}" />
    `
      )
      .join("")}
  </g>

  <!-- Deep Ocean Outer Orbit Rings -->
  <g stroke="url(#primaryGrad)" stroke-width="2.5" fill="none" opacity="0.35" transform="rotate(${ringRotation} 400 400)">
    <ellipse cx="400" cy="400" rx="320" ry="140" />
    <ellipse cx="400" cy="400" rx="280" ry="80" />
  </g>

  <!-- Volumetric Core Aura -->
  <circle cx="400" cy="400" r="160" fill="${coreColor}" opacity="0.08" filter="url(#bioluminescent-glow)" />
  <circle cx="400" cy="400" r="100" fill="${accentColor}" opacity="0.12" filter="url(#bioluminescent-glow)" />

  <!-- MAIN ORGANIC TRIDENT EMBLEM (High-fidelity Bezier curves) -->
  <g filter="url(#bioluminescent-glow)">
    <!-- Base crown -->
    <path d="M180,240 C220,380 290,440 400,200 C510,440 580,380 620,240 C580,480 500,600 400,640 C300,600 220,480 180,240 Z" 
          stroke="url(#primaryGrad)" 
          stroke-width="8" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          fill="rgba(2, 6, 18, 0.4)" />

    <!-- Core bioluminescent spine -->
    <line x1="400" y1="200" x2="400" y2="700" stroke="url(#primaryGrad)" stroke-width="4" stroke-dasharray="8 8" />

    <!-- Inside physical reactor shield -->
    <path d="M300,320 C340,400 460,400 500,320 C465,480 335,480 300,320 Z" 
          stroke="${coreColor}" 
          stroke-width="3" 
          stroke-dasharray="2 4"
          fill="none" />
  </g>

  <!-- Central Light Anchor -->
  <circle cx="400" cy="400" r="30" fill="${coreColor}" filter="url(#spore-glow)" />
  <circle cx="400" cy="400" r="18" fill="${accentColor}" />
  <circle cx="400" cy="400" r="8" fill="#ffffff" />

  <!-- Operator Branding watermark signature -->
  ${
    showWatermark
      ? `
  <g transform="translate(400, 750)">
    <text text-anchor="middle" font-family="'Courier New', monospace" font-size="11" fill="rgba(255, 255, 255, 0.4)" letter-spacing="3">
      DYABLO ENGINE • DESIGNED BY KNOCKSSTUDiOS
    </text>
    <text text-anchor="middle" font-family="'Courier New', monospace" font-size="8" fill="rgba(6, 182, 212, 0.5)" letter-spacing="1.5" dy="16">
      AUTHENTIC: KNOCKSSTUDiOS@HOLLYWOODIMAGING.STUDIO
    </text>
  </g>
  `
      : ""
  }
</svg>`;

      // Trigger automatic file download
      const dataStr = "data:image/svg+xml;utf8," + encodeURIComponent(svgString);
      const dlLink = document.createElement("a");
      dlLink.setAttribute("href", dataStr);
      dlLink.setAttribute("download", `dyablo_8k_hdr_logo_${activePreset.toLowerCase()}_knocksstudios.svg`);
      document.body.appendChild(dlLink);
      dlLink.click();
      dlLink.remove();

      onAddLog("SUCCESS", "Bioluminescent Logo downloaded! Ultra high-resolution 8K HDR vector SVG saved.");
      setIsExporting(false);
    }, 1200);
  };

  return (
    <div id="bioluminescent-logo-generator" className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center gap-2 justify-between border-b border-gray-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-white uppercase tracking-wider font-bold">
            DYABLO 8K HDR BIOLUMINESCENT LOGO MATRIX
          </span>
        </div>
        <span className="text-[9px] font-mono text-pink-400 bg-pink-950/35 px-2 py-0.5 border border-pink-500/10 rounded font-bold">
          VECTOR ENGINE
        </span>
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed">
        Customize, preview, and render your non-pixelated 8K vector logo for film overlay use. Configured with a deep-sea volumetric scatter filter and secure hardware certification marks for <strong className="text-white">KNOCKSSTUDiOS</strong>.
      </p>

      {/* Preset Picker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(["ABYSSAL_SIREN", "NEPTUNE_CORE", "CHARYBDIS_MAW", "HYDROTHERMAL_VENT"] as LogoPreset[]).map((p) => (
          <button
            id={`preset-btn-${p.toLowerCase()}`}
            key={p}
            onClick={() => applyPreset(p)}
            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-mono border transition-all text-center tracking-wider ${
              activePreset === p
                ? "bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border-cyan-400 text-cyan-400 font-bold"
                : "bg-gray-950 border-gray-850 text-gray-500 hover:text-gray-300 hover:border-gray-700"
            }`}
          >
            {p.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Sliders Control area (7 columns) */}
        <div className="md:col-span-7 space-y-3.5 flex flex-col justify-between font-mono text-[10px]">
          <div className="space-y-3">
            {/* Core Glow color */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">CORE GLOW ACCENT:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={coreColor}
                  onChange={(e) => {
                    setCoreColor(e.target.value);
                    setActivePreset("ABYSSAL_SIREN"); // customized
                  }}
                  className="w-5 h-5 bg-transparent rounded cursor-pointer border-0"
                />
                <span className="text-white uppercase">{coreColor}</span>
              </div>
            </div>

            {/* Inner Ring Glow Accent */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">REACTOR CORONA:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => {
                    setAccentColor(e.target.value);
                    setActivePreset("ABYSSAL_SIREN");
                  }}
                  className="w-5 h-5 bg-transparent rounded cursor-pointer border-0"
                />
                <span className="text-white uppercase">{accentColor}</span>
              </div>
            </div>

            {/* Bloom scatter factor */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-gray-400">BIOLUMINESCENT BLUR INTENSITY (bloom)</span>
                <span className="text-cyan-400 font-bold">{glowIntensity}px scatter</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(Number(e.target.value))}
                className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Spore Count slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-gray-400">SPORE FIELD PARTICLES</span>
                <span className="text-purple-400 font-bold">{sporeCount} spores</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                value={sporeCount}
                onChange={(e) => setSporeCount(Number(e.target.value))}
                className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* Orbital rotation speed / angle */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-gray-400">ORBIT ANGLE TWIST</span>
                <span className="text-pink-400 font-bold">{ringRotation}° rotation</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={ringRotation}
                onChange={(e) => setRingRotation(Number(e.target.value))}
                className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>

            {/* Watermark toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-400 text-[9px]">EMBED CO-BRAND SIGNATURE:</span>
              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold border transition ${
                  showWatermark
                    ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                    : "bg-gray-950 border-gray-850 text-gray-500"
                }`}
              >
                {showWatermark ? "LICENSED HUD ON" : "HUD OFF"}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-900 flex gap-2">
            <button
              onClick={handleExportSVG}
              disabled={isExporting}
              className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-gray-950 hover:text-white font-bold rounded-lg text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 flex items-center justify-center gap-1.5"
            >
              {isExporting ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  RENDERING SVG...
                </>
              ) : (
                <>
                  <Download size={13} />
                  DOWNLOAD 8K LOGO SVG
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live SVG Vector Rendering Preview area (5 columns) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-gray-950 border border-gray-850 rounded-xl p-3 min-h-[220px] relative overflow-hidden group">
          {/* Subtle grid mesh backdrop */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.15),transparent)]" />
          
          <div className="relative w-full aspect-square max-w-[180px] drop-shadow-[0_0_25px_rgba(0,240,255,0.15)] group-hover:scale-[1.03] transition-all duration-500">
            {/* High fidelity dynamic live preview SVG vector matching the customized sliders */}
            <svg viewBox="0 0 800 800" className="w-full h-full block" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="previewGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={glowIntensity / 2} result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="sporeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="prevGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={coreColor} />
                  <stop offset="50%" stopColor={accentColor} />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
              </defs>

              {/* Background ambient circular backglows */}
              <circle cx="400" cy="400" r="150" fill={coreColor} opacity="0.1" filter="url(#previewGlow)" />
              <circle cx="400" cy="400" r="90" fill={accentColor} opacity="0.12" filter="url(#previewGlow)" />

              {/* Glowing Spores */}
              <g filter="url(#sporeGlow)">
                {generateSporesMarkup()}
              </g>

              {/* Rings */}
              <g stroke="url(#prevGrad)" strokeWidth="2.5" fill="none" opacity="0.4" transform={`rotate(${ringRotation} 400 400)`}>
                <ellipse cx="400" cy="400" rx="320" ry="140" />
                <ellipse cx="400" cy="400" rx="280" ry="80" />
              </g>

              {/* Main organic trident/sea demon curved emblem */}
              <g filter="url(#previewGlow)">
                <path 
                  d="M180,240 C220,380 290,440 400,200 C510,440 580,380 620,240 C580,480 500,600 400,640 C300,600 220,480 180,240 Z" 
                  stroke="url(#prevGrad)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="rgba(2, 6, 18, 0.45)" 
                />
                <line x1="400" y1="200" x2="400" y2="700" stroke="url(#prevGrad)" strokeWidth="4" strokeDasharray="8 8" />
              </g>

              {/* Nuclear center core */}
              <circle cx="400" cy="400" r="28" fill={coreColor} filter="url(#sporeGlow)" />
              <circle cx="400" cy="400" r="16" fill={accentColor} />
              <circle cx="400" cy="400" r="7" fill="#ffffff" />
            </svg>
          </div>

          <div className="mt-3.5 text-center font-mono text-[9px] text-gray-500 uppercase tracking-widest pointer-events-none">
            {activePreset.replace("_", " ")} LIVE PREVIEW
          </div>
        </div>
      </div>
    </div>
  );
}
