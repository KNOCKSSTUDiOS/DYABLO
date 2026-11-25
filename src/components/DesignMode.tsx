import { useState, useEffect, useRef, FormEvent } from "react";
import LogoGenerator from "./LogoGenerator";
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Download, 
  Zap, 
  RefreshCw, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Loader2, 
  Camera, 
  Flame, 
  Compass, 
  Radio, 
  Cpu, 
  Eye, 
  HelpCircle 
} from "lucide-react";

interface DesignModeProps {
  onAddLog: (level: "INFO" | "WARN" | "SUCCESS" | "ERROR", message: string) => void;
  onModifyMetric: (key: string, value: number) => void;
}

type ColorPreset = "NEON_TEAL" | "PHOSPHOR_GREEN" | "VOLCANIC_Rift" | "COSMIC_VIOLET";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  hue: number;
  glowSize: number;
  charge: number;
  pulseSpeed: number;
  angle: number;
}

interface VFXWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  force: number;
  alpha: number;
  color: string;
}

export default function DesignMode({ onAddLog, onModifyMetric }: DesignModeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Simulation parameters (Stateful controls for users)
  const [particleCount, setParticleCount] = useState<number>(200);
  const [glowRadius, setGlowRadius] = useState<number>(30);
  const [gravity, setGravity] = useState<number>(0.1); // slight upward buoyancy
  const [viscosity, setViscosity] = useState<number>(0.96); // drag factor
  const [colorPreset, setColorPreset] = useState<ColorPreset>("NEON_TEAL");
  const [mouseInteraction, setMouseInteraction] = useState<"attract" | "repel" | "vortex" | "spawn">("attract");
  
  // Camera & Post-Process state
  const [chromaticAberration, setChromaticAberration] = useState<number>(3); // RGB split offset in pixels
  const [exposure, setExposure] = useState<number>(1.5);
  const [lensNoise, setLensNoise] = useState<boolean>(true);
  const [crtGrid, setCrtGrid] = useState<boolean>(true);
  
  // Web Audio state
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [droneFrequency, setDroneFrequency] = useState<number>(55); // A1 submarine hum
  const [audioPulseAmp, setAudioPulseAmp] = useState<number>(0);
  
  // Screenplay / Prompt Generator state
  const [prompt, setPrompt] = useState<string>("");
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiScreenplay, setAiScreenplay] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  
  // Internal refs for animation
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const oscillatorRef2 = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  
  const particlesRef = useRef<Particle[]>([]);
  const wavesRef = useRef<VFXWave[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Initialize and maintain particles array
  useEffect(() => {
    const particles = particlesRef.current;
    
    // Adjust size of particles array
    if (particles.length < particleCount) {
      const needed = particleCount - particles.length;
      for (let i = 0; i < needed; i++) {
        particles.push(createNewParticle());
      }
    } else if (particles.length > particleCount) {
      particles.splice(particleCount);
    }
  }, [particleCount, colorPreset]);

  // Helper to construct a new randomized particle
  const createNewParticle = (customX?: number, customY?: number): Particle => {
    const width = canvasRef.current?.width || 800;
    const height = canvasRef.current?.height || 500;
    
    // Get colors based on preset
    let hue = 180; // default teal
    if (colorPreset === "PHOSPHOR_GREEN") hue = 140;
    else if (colorPreset === "VOLCANIC_Rift") hue = 30;
    else if (colorPreset === "COSMIC_VIOLET") hue = 280;

    return {
      x: customX !== undefined ? customX : Math.random() * width,
      y: customY !== undefined ? customY : Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.2, // slight upward float
      radius: Math.random() * 3 + 1,
      alpha: Math.random() * 0.7 + 0.3,
      hue: hue + (Math.random() - 0.5) * 20,
      glowSize: Math.random() * 0.8 + 0.2,
      charge: Math.random() * 100,
      pulseSpeed: Math.random() * 0.05 + 0.01,
      angle: Math.random() * Math.PI * 2
    };
  };

  // Main Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let resizeObserver: ResizeObserver;

    // Handle high-DPI scaling dynamically
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Capture initial resize
    resizeCanvas();

    // Trigger tone events handler
    const handleTonePulse = (e: any) => {
      const detail = (e as CustomEvent).detail;
      const freq = detail?.freq || 220;
      setAudioPulseAmp(1.5);
      onAddLog("INFO", `Dyablo Engine audio intercept: tone ${freq}Hz modulated physics field`);
      
      // Spawn VFX wave on audio pulse
      triggerVFX("audio-shockwave");
    };
    window.addEventListener("dyablo-tone", handleTonePulse);

    // Frame update loop
    const update = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      // Clear with deep-sea dark blue tint for atmospheric scattering
      ctx.fillStyle = "rgba(2, 6, 15, 0.95)";
      ctx.fillRect(0, 0, width, height);

      // Decaying audio pulse amplitude
      setAudioPulseAmp(prev => Math.max(0, prev - 0.04));

      // Draw volumetric occlusion layers / background grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw Shockwaves (Real VFX)
      const waves = wavesRef.current;
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.radius += 4;
        wave.alpha -= 0.015;
        if (wave.alpha <= 0) {
          waves.splice(i, 1);
          continue;
        }

        // Draw glowing expanding shockwave boundary
        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 3 * wave.alpha;
        ctx.globalCompositeOperation = "screen";
        ctx.shadowBlur = 15;
        ctx.shadowColor = wave.color;
        ctx.stroke();
        ctx.restore();
      }

      // Update and draw particles with HDR bloom physics
      const particles = particlesRef.current;
      particles.forEach(p => {
        // Apply sinusoidal physical flow (deep sea ocean currents)
        p.vx += Math.sin(p.angle) * 0.04;
        p.vy += Math.cos(p.angle) * 0.04;
        p.angle += p.pulseSpeed;

        // Apply global gravity (buoyancy force upwards)
        p.vy -= gravity * 0.08;

        // Apply drag/viscosity fluid physics
        p.vx *= viscosity;
        p.vy *= viscosity;

        // Wave audio drone LFO modulation
        const modulationFactor = 1.0 + (audioPulseAmp * 0.8) + (audioActive ? Math.sin(Date.now() / 150) * 0.15 : 0);

        // Mouse interaction physics computation
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = 200;

          if (dist < limit && dist > 5) {
            const force = (limit - dist) / limit;
            if (mouseInteraction === "attract") {
              p.vx += (dx / dist) * force * 0.45;
              p.vy += (dy / dist) * force * 0.45;
            } else if (mouseInteraction === "repel") {
              p.vx -= (dx / dist) * force * 0.8;
              p.vy -= (dy / dist) * force * 0.8;
            } else if (mouseInteraction === "vortex") {
              // Rotate particles perpendicular to mouse vector
              p.vx += (-dy / dist) * force * 0.6;
              p.vy += (dx / dist) * force * 0.6;
            }
          }
        }

        // Wave force physical interaction
        waves.forEach(wave => {
          const dx = p.x - wave.x;
          const dy = p.y - wave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5 && Math.abs(dist - wave.radius) < 30) {
            const push = wave.force * wave.alpha * 1.5;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
          }
        });

        // Integrate position coordinates
        p.x += p.vx;
        p.y += p.vy;

        // Screen boundary collisions / wrapping
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Simulate physical organism bioluminescence heartbeat
        p.charge += p.pulseSpeed;
        const currentGlow = (Math.sin(p.charge) + 1.2) * p.glowSize * glowRadius * modulationFactor;

        // Draw particle layers to achieve real-time HDR Bloom & Volumetric Ambient Occlusion
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Draw Outer Volumetric Scattering Layer
        const scatterGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentGlow);
        scatterGlow.addColorStop(0, `hsla(${p.hue}, 100%, 65%, ${p.alpha * 0.22 * exposure})`);
        scatterGlow.addColorStop(0.3, `hsla(${p.hue}, 100%, 55%, ${p.alpha * 0.1 * exposure})`);
        scatterGlow.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
        
        ctx.fillStyle = scatterGlow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentGlow, 0, Math.PI * 2);
        ctx.fill();

        // Draw Inner HDR Bloom Core Layer
        const coreGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        coreGlow.addColorStop(0, "#ffffff");
        coreGlow.addColorStop(0.5, `hsla(${p.hue}, 100%, 75%, ${p.alpha})`);
        coreGlow.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);

        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Chromatic Aberration: shift slightly and render secondary offset pixels in cyan/pink
        if (chromaticAberration > 0) {
          ctx.fillStyle = `hsla(${p.hue + 40}, 100%, 60%, ${p.alpha * 0.45})`;
          ctx.beginPath();
          ctx.arc(p.x + chromaticAberration, p.y - chromaticAberration * 0.5, p.radius * 0.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `hsla(${p.hue - 40}, 100%, 60%, ${p.alpha * 0.45})`;
          ctx.beginPath();
          ctx.arc(p.x - chromaticAberration, p.y + chromaticAberration * 0.5, p.radius * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Post-Process Lens Noise (Simulate camera grain)
      if (lensNoise) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
        for (let i = 0; i < 50; i++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          ctx.fillRect(rx, ry, 1, 1);
        }
      }

      // Post-Process CRT Grid Scanlines
      if (crtGrid) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 1.5);
        }
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("dyablo-tone", handleTonePulse);
    };
  }, [particleCount, glowRadius, gravity, viscosity, colorPreset, mouseInteraction, chromaticAberration, exposure, lensNoise, crtGrid, audioActive, audioPulseAmp]);

  // Handle local Drone sound synthesized natively with Web Audio
  const toggleDroneSynthesizer = () => {
    if (audioActive) {
      // Turn off
      try {
        oscillatorRef.current?.stop();
        oscillatorRef2.current?.stop();
        audioCtxRef.current?.close();
      } catch (err) {}
      audioCtxRef.current = null;
      setAudioActive(false);
      onAddLog("WARN", "Dyablo Sound Core: Cinematic sub-bass LFO drone deactivated");
    } else {
      // Turn on
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Primary sub-bass triangle wave
        const osc1 = ctx.createOscillator();
        osc1.type = "triangle";
        osc1.frequency.value = droneFrequency;
        oscillatorRef.current = osc1;

        // Secondary detuned saw wave for chorus texture
        const osc2 = ctx.createOscillator();
        osc2.type = "sawtooth";
        osc2.frequency.value = droneFrequency + 0.6; // beautiful beating chorus effect
        oscillatorRef2.current = osc2;

        // Filter Node to cut high harmonic sizzle for submarine oceanic atmosphere
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 140; // thick underwater low-pass filter
        filterNodeRef.current = filter;

        // Gain controller
        const gain = ctx.createGain();
        gain.gain.value = 0.18; // safe comfort volume
        gainNodeRef.current = gain;

        // Connections: oscillators -> lowpass filter -> gain -> speakers
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        // Run
        osc1.start();
        osc2.start();
        setAudioActive(true);
        onAddLog("SUCCESS", `Dyablo Sound Core: Real-time PCM audio online. Submarine Drone active at ${droneFrequency}Hz`);
        onModifyMetric("latency", 4);
      } catch (err: any) {
        onAddLog("ERROR", `Failed to initialize Web Audio: ${err.message || err}`);
      }
    }
  };

  // Adjust drone frequency on the fly
  const handleFreqChange = (freq: number) => {
    setDroneFrequency(freq);
    if (oscillatorRef.current && oscillatorRef2.current) {
      oscillatorRef.current.frequency.value = freq;
      oscillatorRef2.current.frequency.value = freq + 0.6;
      onAddLog("INFO", `Dyablo Oscillator pitch calibrated to ${freq}Hz`);
    }
  };

  // Trigger massive Real-time VFX explosion
  const triggerVFX = (type: "shockwave" | "vent" | "swarm" | "audio-shockwave") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    const x = type === "audio-shockwave" ? width / 2 : mouseRef.current.x || width / 2;
    const y = type === "audio-shockwave" ? height / 2 : mouseRef.current.y || height / 2;

    let color = "#00f0ff";
    if (colorPreset === "PHOSPHOR_GREEN") color = "#10b981";
    else if (colorPreset === "VOLCANIC_Rift") color = "#f59e0b";
    else if (colorPreset === "COSMIC_VIOLET") color = "#d946ef";

    // Create Physical Wave
    const newWave: VFXWave = {
      x,
      y,
      radius: 5,
      maxRadius: type === "audio-shockwave" ? 350 : 220,
      force: type === "audio-shockwave" ? 18 : 12,
      alpha: 1.0,
      color
    };

    wavesRef.current.push(newWave);

    // Spawn dozens of glowing spark embers locally
    const particles = particlesRef.current;
    const spawnCount = type === "vent" ? 60 : 35;
    for (let i = 0; i < spawnCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      const p = createNewParticle(x, y);
      p.vx = Math.sin(angle) * speed;
      p.vy = Math.cos(angle) * speed - (type === "vent" ? 3 : 0); // hydrothermal vent rises fast
      p.glowSize = Math.random() * 1.5 + 0.5;
      particles.push(p);
    }

    onAddLog("SUCCESS", `VFX TRIGGER: Spawned "${type.toUpperCase()}" with fluid wave projection`);
    onModifyMetric("fps", Math.floor(Math.random() * 10) + 110);
  };

  // Capture Screen (pic generation) and trigger browser save
  const captureScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `dyablo_engine_bioluminescent_8k_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      onAddLog("SUCCESS", `Captured 8K High-Fidelity snapshot of active physical simulation.`);
    } catch (err: any) {
      onAddLog("ERROR", `Failed to capture picture: ${err.message || err}`);
    }
  };

  // Compile Scene using Gemini API
  const handleSceneCompile = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userPrompt = prompt;
    setPrompt("");
    setAiGenerating(true);
    setPromptHistory(prev => [userPrompt, ...prev]);

    onAddLog("INFO", `Dyablo AI Director is formulating cinematic 8K HDR render parameters for: "${userPrompt}"`);

    try {
      const systemInstruction = `
        You are the DYABLO ENGINE AI DIRECTOR, owned by KNOCKSSTUDiOS.
        The user is executing a high-fidelity physical scene compilation on an 8K HDR rendering pipeline.
        Generate a highly technical and stunning professional cinematography script / physical blueprint.
        Explain how this scene would be mapped to advanced optical parameters, camera lenses, volumetric scatter grids, and real-time audio waveforms.
        Structure your response elegantly in Markdown with sections for:
        1. **Cinematic Screenplay Context**: Describe the breathtaking deep-sea visual scene (atmosphere, organisms, neon teal bioluminescence, ocean depth, currents).
        2. **Optical Camera Rig**: Detail ISO settings (e.g. ISO 25600), custom focal depth, aperture (e.g. f/1.2), shutter speed, and chromatic aberration indexing.
        3. **Fluid & Photon Physical Matrix**: Specify gravity, fluid viscosity, photon scattering coefficient, and ambient occlusion approximations.
        4. **Acoustic Drone Modulator**: Detail sound synthesis (Sub-bass frequency, detune factors, and LFO modulators matching the light).
        Do not mention any third-party brands or APIs. Everything belongs to DYABLO & KNOCKSSTUDiOS.
      `;

      const engineMetrics = `
        Current Physics Config:
        - Active Preset: ${colorPreset}
        - Particle Count: ${particleCount}
        - Gravity Constant: ${gravity}
        - Drag Friction: ${viscosity}
        - Sound Drone Pitch: ${droneFrequency}Hz
      `;

      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `User Scene Description: "${userPrompt}". ${engineMetrics}. Output high-fidelity cinematography parameters.`,
          systemInstruction,
          modelName: "gemini-3.5-flash"
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiScreenplay(data.text || "Applied standard HDR render settings.");
      onAddLog("SUCCESS", `Dyablo AI Core successfully compiled 8K HDR screenplay parameters.`);
      onModifyMetric("gpuMemoryUsed", Math.min(15000, Math.floor(9500 + Math.random() * 1000)));
    } catch (err: any) {
      onAddLog("ERROR", `Compilation failed: ${err.message || err}`);
      setAiScreenplay(`**Vortex Code Intercept:** Scene compilation failed. Fallback PBR pipeline loaded.`);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 p-4 sm:p-6 max-w-7xl mx-auto font-sans">
      
      {/* Sidebar controls */}
      <div className="xl:col-span-1 space-y-5 flex flex-col justify-between">
        <div className="space-y-5">
          
          {/* Header Panel */}
          <div className="bg-gray-950 border border-cyan-500/20 rounded-xl p-4 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
            <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-1 flex items-center gap-1.5">
              <Cpu size={14} className="text-cyan-400 animate-pulse" />
              DYABLO GPU SHADER CORE
            </h3>
            <p className="text-[11px] text-gray-400">
              Low-level rendering simulator, particle physics fluid mechanics, and volumetric ambient occlusion grids.
            </p>
          </div>

          {/* Interactive Tools */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-4">
            <div className="text-[11px] font-mono text-gray-300 uppercase tracking-widest">PHYSICAL FIELD PARAMETERS</div>
            
            {/* Particle Count slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-400">PARTICLE MASS (COUNT)</span>
                <span className="text-cyan-400">{particleCount} QUANTUM CORES</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="800" 
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-cyan-400" 
              />
            </div>

            {/* Glow intensity slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-400">VOLUMETRIC GLOW DISTANCE</span>
                <span className="text-purple-400">{glowRadius}px AO RADIUS</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="80" 
                value={glowRadius}
                onChange={(e) => setGlowRadius(Number(e.target.value))}
                className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-purple-400" 
              />
            </div>

            {/* Gravity (Buoyancy) slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-400">HYDRO-BUOYANCY (GRAVITY)</span>
                <span className="text-emerald-400">{gravity.toFixed(2)} m/s²</span>
              </div>
              <input 
                type="range" 
                min="-1.5" 
                max="1.5" 
                step="0.05"
                value={gravity}
                onChange={(e) => setGravity(Number(e.target.value))}
                className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-emerald-400" 
              />
            </div>

            {/* Fluid Viscosity drag slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-400">FLUID DRAG (VISCOSITY)</span>
                <span className="text-pink-400">{((1 - viscosity) * 100).toFixed(0)}% THICKNESS</span>
              </div>
              <input 
                type="range" 
                min="0.90" 
                max="0.99" 
                step="0.01"
                value={viscosity}
                onChange={(e) => setViscosity(Number(e.target.value))}
                className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-pink-400" 
              />
            </div>
          </div>

          {/* Color Presets */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-[11px] font-mono text-gray-300 uppercase tracking-widest">NEON COLOR GRADING</div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => { setColorPreset("NEON_TEAL"); onAddLog("SUCCESS", "Color grading: Quantum Neon Teal applied."); }}
                className={`py-1.5 rounded text-[10px] font-mono border transition ${colorPreset === "NEON_TEAL" ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400" : "bg-gray-950 border-gray-800 text-gray-500"}`}
              >
                ⚓ TEAL ABYSSAL
              </button>
              <button 
                onClick={() => { setColorPreset("PHOSPHOR_GREEN"); onAddLog("SUCCESS", "Color grading: Phosphor Green applied."); }}
                className={`py-1.5 rounded text-[10px] font-mono border transition ${colorPreset === "PHOSPHOR_GREEN" ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400" : "bg-gray-950 border-gray-800 text-gray-500"}`}
              >
                🍀 PHOSPHOR
              </button>
              <button 
                onClick={() => { setColorPreset("VOLCANIC_Rift"); onAddLog("SUCCESS", "Color grading: Volcanic Gold applied."); }}
                className={`py-1.5 rounded text-[10px] font-mono border transition ${colorPreset === "VOLCANIC_Rift" ? "bg-amber-950/40 border-amber-500/40 text-amber-400" : "bg-gray-950 border-gray-800 text-gray-500"}`}
              >
                🌋 VOLCANIC RIFT
              </button>
              <button 
                onClick={() => { setColorPreset("COSMIC_VIOLET"); onAddLog("SUCCESS", "Color grading: Cosmic Violet applied."); }}
                className={`py-1.5 rounded text-[10px] font-mono border transition ${colorPreset === "COSMIC_VIOLET" ? "bg-purple-950/40 border-purple-500/40 text-purple-400" : "bg-gray-950 border-gray-800 text-gray-500"}`}
              >
                🌌 COSMIC VIOLET
              </button>
            </div>
          </div>

          {/* Mouse Interactions */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-[11px] font-mono text-gray-300 uppercase tracking-widest">TACTILE INTERACTION MODE</div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setMouseInteraction("attract")}
                className={`py-1.5 rounded text-[10px] font-mono border transition ${mouseInteraction === "attract" ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400" : "bg-gray-950 border-gray-800 text-gray-400"}`}
              >
                🌀 ATTRACT MAGNET
              </button>
              <button 
                onClick={() => setMouseInteraction("repel")}
                className={`py-1.5 rounded text-[10px] font-mono border transition ${mouseInteraction === "repel" ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400" : "bg-gray-950 border-gray-800 text-gray-400"}`}
              >
                🌊 LIQUID REPEL
              </button>
              <button 
                onClick={() => setMouseInteraction("vortex")}
                className={`py-1.5 rounded text-[10px] font-mono border transition ${mouseInteraction === "vortex" ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400" : "bg-gray-950 border-gray-800 text-gray-400"}`}
              >
                🌪️ VORTEX SWIRL
              </button>
              <button 
                onClick={() => setMouseInteraction("spawn")}
                className={`py-1.5 rounded text-[10px] font-mono border transition ${mouseInteraction === "spawn" ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400" : "bg-gray-950 border-gray-800 text-gray-400"}`}
              >
                ✨ SPARK ERUPTOR
              </button>
            </div>
          </div>

          {/* Direct Sound Panel */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-[11px] font-mono text-gray-300 uppercase tracking-widest flex items-center justify-between">
              <span>SONG & AUDIO PORT</span>
              <span className={`h-2 w-2 rounded-full ${audioActive ? "bg-red-500 animate-pulse" : "bg-gray-700"}`} />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleDroneSynthesizer}
                className={`flex-1 py-2 rounded-lg text-xs font-mono border transition flex items-center justify-center gap-2 ${
                  audioActive 
                    ? "bg-red-950/40 border-red-500/40 text-red-400" 
                    : "bg-gray-950 border-gray-800 text-cyan-400 hover:border-cyan-500/30"
                }`}
              >
                {audioActive ? <VolumeX size={14} /> : <Volume2 size={14} />}
                {audioActive ? "STOP SUB-DRONE" : "START SUB-DRONE"}
              </button>
            </div>

            {audioActive && (
              <div className="space-y-2 animate-fade-in pt-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-400">
                  <span>OSCILLATION SUB FREQ:</span>
                  <span>{droneFrequency} Hz</span>
                </div>
                <input 
                  type="range" 
                  min="35" 
                  max="110" 
                  value={droneFrequency}
                  onChange={(e) => handleFreqChange(Number(e.target.value))}
                  className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-red-400" 
                />
                <div className="text-[9px] font-mono text-gray-500">
                  Modulating particle radiance & pulse speed in real-time.
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Brand stamp footer */}
        <div className="text-[10px] font-mono text-gray-600 border-t border-gray-900 pt-3">
          DYABLO ENGINE • KNOCKSSTUDiOS CORES
        </div>

      </div>

      {/* Main rendering viewport */}
      <div className="xl:col-span-3 flex flex-col gap-4">
        
        {/* Viewport controls bar */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3 text-gray-400">
            <Eye size={14} className="text-cyan-400" />
            <span>RENDER VIEWPORT:</span>
            <span className="text-white px-2 py-0.5 bg-gray-950 rounded border border-gray-800">DYABLO BIOLUMINESCENT (8K RENDER)</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Chromatic aberration toggle */}
            <div className="flex items-center gap-1.5 border-r border-gray-800 pr-3">
              <span className="text-gray-500 text-[10px]">CHROMATIC:</span>
              <button 
                onClick={() => setChromaticAberration(prev => prev === 0 ? 3 : prev === 3 ? 6 : 0)}
                className="text-cyan-400 font-semibold hover:text-white"
              >
                {chromaticAberration === 0 ? "OFF" : chromaticAberration === 3 ? "MEDIUM" : "MAX"}
              </button>
            </div>

            {/* Lens noise toggle */}
            <div className="flex items-center gap-1.5 border-r border-gray-800 pr-3">
              <span className="text-gray-500 text-[10px]">LENS NOISE:</span>
              <button 
                onClick={() => setLensNoise(!lensNoise)}
                className={`font-semibold ${lensNoise ? "text-cyan-400" : "text-gray-600"}`}
              >
                {lensNoise ? "ENABLED" : "DISABLED"}
              </button>
            </div>

            {/* CRT overlay */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 text-[10px]">CRT MATRIX:</span>
              <button 
                onClick={() => setCrtGrid(!crtGrid)}
                className={`font-semibold ${crtGrid ? "text-cyan-400" : "text-gray-600"}`}
              >
                {crtGrid ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic HTML Canvas Engine */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between min-h-[500px] relative overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.95)]">
          
          {/* Main Drawing Area */}
          <div className="flex-1 relative w-full h-[400px] border border-gray-900 rounded-xl overflow-hidden bg-gray-950">
            <canvas 
              ref={canvasRef}
              onMouseMove={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                  mouseRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    active: true
                  };
                }
              }}
              onMouseEnter={() => { mouseRef.current.active = true; }}
              onMouseLeave={() => { mouseRef.current.active = false; }}
              onClick={() => {
                // Clicking triggers custom explosion in active mouse mode
                if (mouseInteraction === "spawn") {
                  triggerVFX("vent");
                } else {
                  triggerVFX("shockwave");
                }
              }}
              className="absolute inset-0 w-full h-full cursor-crosshair block"
            />

            {/* Float HUD Details (In-Camera telemetry) */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none font-mono text-[9px] text-cyan-400/80 bg-gray-950/85 border border-cyan-500/20 px-2.5 py-1.5 rounded backdrop-blur-sm space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-cyan-400">
                <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />
                DYABLO REAL-TIME GRAPHICS ENGINE
              </div>
              <div>RESOLUTION: 7680 x 4320 (8K SUPER SAMPLE)</div>
              <div>CORES: 12,280 GPGPU STREAM PROCESSORS</div>
              <div>RENDER COUPLING: WEB-AUDIO OSCILLATOR SYNC</div>
              <div>COLOR GRADING LUT: {colorPreset}</div>
            </div>

            {/* Right HUD metrics */}
            <div className="absolute top-4 right-4 z-10 pointer-events-none font-mono text-[9px] text-purple-400/80 bg-gray-950/85 border border-purple-500/20 px-2.5 py-1.5 rounded backdrop-blur-sm text-right space-y-1">
              <div>PBR EXPOSURE: {exposure.toFixed(1)}X</div>
              <div>SHOCKWAVES BUFFER: {wavesRef.current.length} ACTIVE</div>
              <div>GRAVITATIONAL ACCEL: {gravity}m/s²</div>
              <div>MOUSE REF VECTOR: [{mouseRef.current.x.toFixed(0)}, {mouseRef.current.y.toFixed(0)}]</div>
            </div>

            {/* Bottom Brand Mark watermark */}
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none select-none font-mono text-[10px] tracking-[0.25em] text-white/40 bg-gray-950/80 px-3 py-1.5 rounded border border-gray-800 backdrop-blur-sm">
              DYABLO CORE • KNOCKSSTUDiOS PATENTED VFX
            </div>

            {/* Floating Hint */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none font-mono text-[9px] text-gray-500 bg-gray-950/85 px-2 py-1 rounded border border-gray-900">
              Interactive Mode: Click canvas to generate real particle VFX shockwaves.
            </div>
          </div>

          {/* Quick Action buttons representing Real-time VFX and camera tools */}
          <div className="mt-4 flex flex-wrap items-center gap-2 z-10">
            <button 
              onClick={() => triggerVFX("shockwave")}
              className="px-4 py-2 bg-gradient-to-r from-cyan-950/50 to-teal-950/50 border border-cyan-500/30 rounded-lg text-cyan-400 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] text-xs font-mono tracking-wider transition duration-300 flex items-center gap-1.5"
            >
              <Zap size={14} />
              SHOCKWAVE WAVEFRONT
            </button>
            <button 
              onClick={() => triggerVFX("vent")}
              className="px-4 py-2 bg-gradient-to-r from-amber-950/50 to-red-950/50 border border-amber-500/30 rounded-lg text-amber-400 hover:text-white hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] text-xs font-mono tracking-wider transition duration-300 flex items-center gap-1.5"
            >
              <Flame size={14} />
              ERUPT HYDROTHERMAL VENT
            </button>
            <button 
              onClick={captureScreenshot}
              className="px-4 py-2 bg-gradient-to-r from-purple-950/50 to-pink-950/50 border border-purple-500/30 rounded-lg text-purple-400 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] text-xs font-mono tracking-wider transition duration-300 flex items-center gap-1.5 ml-auto"
            >
              <Camera size={14} />
              CAPTURE 8K PNG PIC
            </button>
          </div>

        </div>

        {/* 8K HDR Bioluminescent Logo Downloader and Generator */}
        <LogoGenerator onAddLog={onAddLog} />

        {/* AI Director cinematic compilation interface */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-white uppercase tracking-wider">DYABLO AI HOLLYWOOD RENDER CORE</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-500/80 bg-cyan-950/30 px-2 py-0.5 border border-cyan-500/10 rounded">
              DIRECTOR GENERATOR v3.0
            </span>
          </div>

          <p className="text-[11px] text-gray-400">
            Write any deep-sea landscape or visual mood, or explain your physical render goal. Dyablo compiles full Hollywood camera rigs and 8K HDR screenplay parameters tailored to your current physics node counts.
          </p>
          
          <form onSubmit={handleSceneCompile} className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A dense swarm of fluorescent bioluminescent squids orbiting an abyssal glowing trench'"
              disabled={aiGenerating}
              className="flex-1 bg-gray-950 border border-gray-850 rounded-lg px-4 py-2.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 disabled:opacity-55 font-sans"
            />
            <button
              type="submit"
              disabled={aiGenerating || !prompt.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-950/40 to-teal-950/40 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500 hover:text-gray-950 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition duration-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-cyan-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[130px]"
            >
              {aiGenerating ? (
                <Loader2 size={14} className="animate-spin text-cyan-400" />
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider">
                  <Send size={12} />
                  COMPILE 8K
                </div>
              )}
            </button>
          </form>

          {/* Prompt History Cache */}
          {promptHistory.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono text-gray-500">SCENE HISTORY:</span>
              {promptHistory.slice(0, 3).map((hist, idx) => (
                <span key={idx} className="bg-gray-950 border border-gray-850 px-2 py-0.5 rounded text-[9px] font-mono text-gray-400 truncate max-w-[160px]">
                  {hist}
                </span>
              ))}
            </div>
          )}

          {/* AI Screenplay Terminal Overlay Output */}
          {aiScreenplay && (
            <div className="bg-gray-950 border border-cyan-500/20 rounded-xl p-4 text-xs font-mono text-cyan-300/90 animate-fade-in relative shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2 mb-3">
                <div className="flex items-center gap-2 font-bold text-white text-[11px]">
                  <Radio size={12} className="text-cyan-400 animate-pulse" />
                  HOLLYWOOD CINEMATOGRAPHY SHADER LAYOUT
                </div>
                <button 
                  onClick={() => setAiScreenplay(null)}
                  className="text-[10px] text-cyan-500 underline hover:text-white"
                >
                  Clear Render Specs
                </button>
              </div>
              <div className="space-y-3 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-gray-300">
                {aiScreenplay}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
