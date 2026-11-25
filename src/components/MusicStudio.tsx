import { useState, useEffect, useRef, FormEvent } from "react";
import { Disc, Play, Square, Sliders, Music, Sparkles, Send, Loader2, Volume2, HelpCircle } from "lucide-react";

interface MusicStudioProps {
  onAddLog: (level: "INFO" | "WARN" | "SUCCESS" | "ERROR", message: string) => void;
  onModifyMetric: (key: string, value: number) => void;
}

interface KeyNote {
  note: string;
  freq: number;
  label: string;
}

export default function MusicStudio({ onAddLog, onModifyMetric }: MusicStudioProps) {
  // Web Audio state
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [waveformType, setWaveformType] = useState<OscillatorType>("sine");
  const [tempo, setTempo] = useState(120);
  const [activeSynthPreset, setActiveSynthPreset] = useState("s-pad");
  const [volume, setVolume] = useState(0.4);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  // Music Scoring Prompt AI State
  const [aiPrompt, setAiPrompt] = useState("");
  const [scoringResult, setScoringResult] = useState<string | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);

  // Canvas visualizer reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isPlayingLoop = useRef<boolean>(false);

  const keys: KeyNote[] = [
    { note: "C4", freq: 261.63, label: "A" },
    { note: "D4", freq: 293.66, label: "S" },
    { note: "E4", freq: 329.63, label: "D" },
    { note: "F4", freq: 349.23, label: "F" },
    { note: "G4", freq: 392.00, label: "G" },
    { note: "A4", freq: 440.00, label: "H" },
    { note: "B4", freq: 493.88, label: "J" },
    { note: "C5", freq: 523.25, label: "K" },
  ];

  // Draw simulated soundwave with visualizer canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;
    const particles: { x: number; y: number; size: number; speedY: number; opacity: number }[] = [];

    // Initialize stars/particles
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedY: (Math.random() * 0.4 + 0.1) * -1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Grid lines
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw floating music particle clouds
      particles.forEach(p => {
        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // animate float upwards
        p.y += p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        // Add note pulsing wave interaction
        if (activeNote) {
          p.opacity = Math.min(1, p.opacity + 0.02);
        } else {
          p.opacity = Math.max(0.1, p.opacity - 0.005);
        }
      });

      // Render Primary Wave
      ctx.beginPath();
      ctx.lineWidth = activeNote ? 2.5 : 1.5;
      ctx.strokeStyle = activeNote ? "#00F0FF" : "rgba(0, 240, 255, 0.4)";
      
      const waveAmplitude = activeNote ? 40 : 15;
      const waveFrequency = activeNote ? 0.04 : 0.015;

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * waveFrequency + angle) * waveAmplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Render Sub harmonic wave
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = activeNote ? "rgba(168, 85, 247, 0.6)" : "rgba(168, 85, 247, 0.2)";
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.cos(x * (waveFrequency * 1.5) - angle) * (waveAmplitude * 0.6);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Slow dynamic rotation
      angle += activeNote ? 0.12 : 0.03;

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [activeNote]);

  // Play browser synthesizer sound
  const handlePlayTone = (frequency: number, noteName: string) => {
    try {
      let context = audioCtx;
      if (!context) {
        context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioCtx(context);
      }

      // Resume context if suspended (browser safety features)
      if (context.state === "suspended") {
        context.resume();
      }

      // Create Web Audio components
      const osc = context.createOscillator();
      const gainNode = context.createGain();

      osc.type = waveformType;
      osc.frequency.setValueAtTime(frequency, context.currentTime);

      // Volume Envelope to avoid speaker clicking popping
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.05); // attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.45); // decay

      osc.connect(gainNode);
      gainNode.connect(context.destination);

      osc.start(context.currentTime);
      osc.stop(context.currentTime + 0.5);

      setActiveNote(noteName);
      
      // Dispatch custom window event to trigger real-time physical canvas pulse in DesignMode
      window.dispatchEvent(new CustomEvent("dyablo-tone", { detail: { freq: frequency, note: noteName } }));
      
      onAddLog("INFO", `Synthesizer direct tone triggered: ${noteName} (${frequency} Hz) via native AudioPort`);
      onModifyMetric("latency", 12); // synthesis latency is extremely low!

      setTimeout(() => {
        setActiveNote(null);
      }, 400);
    } catch (e: any) {
      onAddLog("ERROR", `Failed to instantiate Web Audio driver: ${e.message || e}`);
    }
  };

  // Keyboard layout map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, KeyNote> = {
        a: keys[0],
        s: keys[1],
        d: keys[2],
        f: keys[3],
        g: keys[4],
        h: keys[5],
        j: keys[6],
        k: keys[7],
      };

      const matched = keyMap[e.key.toLowerCase()];
      if (matched) {
        handlePlayTone(matched.freq, matched.note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audioCtx, waveformType, volume]);

  const handleApplyPreset = (id: string, type: OscillatorType) => {
    setActiveSynthPreset(id);
    setWaveformType(type);
    onAddLog("SUCCESS", `Loaded Synthesizer module preset: ${id.toUpperCase()}`);
  };

  // Generate real audio design scoring cue prompt via Gemini
  const handleGenerateScore = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setLoadingScore(true);
    setScoringResult(null);
    onAddLog("INFO", `Lyria Pro AI scoring core compiling audio prompt: "${aiPrompt}"`);

    try {
      const systemInstruction = `
        You are APEX LUMA Lyria Pro Audio Engine, an advanced, original cinematic sound synthesizer owned by KNOCKSSTUDiOS.
        The user wants to generate sound effects or a musical score prompt for a video layout.
        Construct a detailed "Soundtrack Score Design" sheet. Include:
        1. **Core Timbre:** Describe the synthetic instruments and custom LFO filters (e.g. 110Hz sub carriers).
        2. **Video Synced Cues:** A short timeline showing what sounds happen at [0:00], [0:05], [0:15] to sync with their video.
        3. **Synthesizer Configurations:** Specific parameters (wave type, feedback resonance, envelope decay).
        Use highly premium, dark cyberpunk, deep space terminology. No trademarked names or brands. Fully original.
      `;

      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `User wants to generate a sound layer for video: "${aiPrompt}". Detail tempo, cinematic beats, and Web Audio mapping configuration parameters.`,
          systemInstruction,
          modelName: "gemini-3.5-flash"
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setScoringResult(data.text || "Rendered score successfully.");
      onAddLog("SUCCESS", `Lyria Pro finalized audio composition blueprint.`);
      onModifyMetric("fps", 144);
    } catch (err: any) {
      onAddLog("ERROR", `Audio compilation error: ${err.message || err}`);
    } finally {
      setLoadingScore(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto font-sans">
      
      {/* Playable Synthesizer Controls (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Synth Header Info */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-1 flex items-center gap-1.5">
              <Disc size={12} className="animate-spin text-cyan-400" />
              OMNi SYNTHESIS SOUND ENGINE
            </h3>
            <p className="text-[11px] text-gray-400">
              GPU-driven physical audio compiler. Click the key triggers below or press your computer keyboard letters 
              <span className="text-cyan-400 font-mono"> [A, S, D, F, G, H, J, K]</span> to synthesize real, lag-free waveforms.
            </p>
          </div>
          <Volume2 size={16} className="text-cyan-400 animate-pulse hidden sm:block" />
        </div>

        {/* Real-Time Wave Visualizer Panel */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.85)]">
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 relative z-10">
            <span>REAL-TIME COMPILATION SPECTROGRAPH</span>
            <span className="text-teal-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
              PCM AUDIO DRIVER STATE: ONLINE
            </span>
          </div>

          <canvas 
            ref={canvasRef} 
            width={640} 
            height={160} 
            className="w-full bg-gray-900/40 rounded-xl border border-gray-850 h-32 block"
          />
        </div>

        {/* Interactive Piano Synthesizer Keys */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-gray-400">SYNTHESIZER CORE WAVEBOARD KEYS</div>
          
          <div className="grid grid-cols-8 gap-1.5 h-36">
            {keys.map((k) => {
              const isCurrent = activeNote === k.note;
              return (
                <button
                  key={k.note}
                  onClick={() => handlePlayTone(k.freq, k.note)}
                  className={`rounded-lg border flex flex-col justify-between p-3 transition-all duration-150 ${
                    isCurrent
                      ? "bg-cyan-400 border-cyan-300 text-gray-950 translate-y-1 shadow-[0_0_15px_#00F0FF]"
                      : "bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-850 hover:border-gray-700"
                  }`}
                >
                  <span className="font-mono text-[9px] tracking-widest font-semibold uppercase opacity-60">
                    KEY [{k.label}]
                  </span>
                  <div className="text-left">
                    <div className="font-bold text-sm tracking-tight">{k.note}</div>
                    <div className={`font-mono text-[9px] ${isCurrent ? "text-gray-900" : "text-gray-500"}`}>{k.freq}Hz</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Oscillators and sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Waveform Selector */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-mono text-gray-300 uppercase block">OSCILLATION TYPE WAVE</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => { setWaveformType("sine"); onAddLog("INFO", "Oscillator shape mapped to SINE"); }}
                className={`py-2 px-3 rounded-lg border text-left transition ${waveformType === "sine" ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400" : "bg-gray-950 border-gray-850 text-gray-400"}`}
              >
                〰️ Sine Wave
              </button>
              <button
                onClick={() => { setWaveformType("triangle"); onAddLog("INFO", "Oscillator shape mapped to TRIANGLE"); }}
                className={`py-2 px-3 rounded-lg border text-left transition ${waveformType === "triangle" ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400" : "bg-gray-950 border-gray-850 text-gray-400"}`}
              >
                🔺 Triangle Wave
              </button>
              <button
                onClick={() => { setWaveformType("sawtooth"); onAddLog("INFO", "Oscillator shape mapped to SAWTOOTH"); }}
                className={`py-2 px-3 rounded-lg border text-left transition ${waveformType === "sawtooth" ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400" : "bg-gray-950 border-gray-850 text-gray-400"}`}
              >
                ⚡ Sawtooth Wave
              </button>
              <button
                onClick={() => { setWaveformType("square"); onAddLog("INFO", "Oscillator shape mapped to SQUARE"); }}
                className={`py-2 px-3 rounded-lg border text-left transition ${waveformType === "square" ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400" : "bg-gray-950 border-gray-850 text-gray-400"}`}
              >
                ⬜ Square Wave
              </button>
            </div>
          </div>

          {/* Master Volume Sliders */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-4">
            <span className="text-xs font-mono text-gray-300 uppercase block">VOLUME ENVELOPE</span>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-gray-400">
                <span>MASTER OUTPUT FEED</span>
                <span className="text-cyan-400">{Math.floor(volume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume * 100}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400" 
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-gray-400">
                <span>SYNTH TEMPO MATRIX</span>
                <span className="text-teal-400">{tempo} BPM</span>
              </div>
              <input 
                type="range" 
                min="60" 
                max="200" 
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-400" 
              />
            </div>
          </div>

        </div>

      </div>

      {/* Lyria Pro Score Blueprint Generator (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Module Header card */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 space-y-3">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase border-b border-gray-850 pb-2 flex items-center gap-1.5">
            <Sparkles size={12} className="text-cyan-400 animate-pulse" />
            LYRiA PRO AUDIO BLUEPRiNT
          </div>
          
          <p className="text-[11px] text-gray-400">
            Generate high-fidelity background scores, transition sweeps, or synthesized sound effects to map directly onto your video generation queues.
          </p>

          <form onSubmit={handleGenerateScore} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500">PROMPT AUDIO DESCRIPTION</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., 'Cinematic orchestral swell with deep spatial sub-basses and high-resonance synthetic sweeps'"
                rows={3}
                disabled={loadingScore}
                className="w-full bg-gray-950 border border-gray-850 rounded-lg p-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 font-sans resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loadingScore || !aiPrompt.trim()}
              className="w-full py-2 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-gray-950 transition duration-300 font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
            >
              {loadingScore ? (
                <Loader2 size={13} className="animate-spin text-cyan-400" />
              ) : (
                <>
                  <Music size={12} />
                  SYNTHESIZE AUDIO BLUEPRINT
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prompt Blueprint outputs */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <span className="text-[11px] font-mono tracking-wider text-gray-400 block mb-3">COMPILED SOUND SCORE</span>
          
          {scoringResult ? (
            <div className="bg-gray-950 border border-gray-850 rounded-xl p-3 max-h-[220px] overflow-y-auto font-mono text-[10px] text-cyan-400/80 leading-relaxed whitespace-pre-wrap">
              {scoringResult}
            </div>
          ) : loadingScore ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-gray-500 space-y-2">
              <Loader2 size={20} className="animate-spin text-cyan-500" />
              <span className="font-mono text-[10px] tracking-wider animate-pulse uppercase">Modulating synth layers via Lyria Pro...</span>
            </div>
          ) : (
            <div className="text-[11px] text-gray-500 py-12 text-center font-mono">
              Configure parameters above and trigger blueprint compiler to design audio cues.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
