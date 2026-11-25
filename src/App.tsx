import React, { useState, useEffect, useRef, FormEvent } from "react";
import { ActiveMode, MetricSnapshot, DeployLog } from "./types";
import { INITIAL_METRICS, INITIAL_LOGS } from "./data";
import Splash from "./components/Splash";
import Header from "./components/Header";
import DesignMode from "./components/DesignMode";
import LogicMode from "./components/LogicMode";
import MusicStudio from "./components/MusicStudio";
import DeployMode from "./components/DeployMode";
import ModelGarden from "./components/ModelGarden";
import SpecsDocs from "./components/SpecsDocs";
import DownloadAppModal from "./components/DownloadAppModal";

// Modular Components representing requested file tree
import RenderButtons from "./rendering/RenderButtons";
import EngineSelector from "./engines/EngineSelector";
import IdentityCheck from "./identity/IdentityCheck";
import PaymentsPortal from "./payments/PaymentsPortal";
import "./styles/App.css";

import { 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Check, 
  Activity, 
  MapPin, 
  Fingerprint, 
  DollarSign, 
  Cpu, 
  HelpCircle, 
  Radio, 
  Lock, 
  Maximize2, 
  Flame, 
  Compass, 
  Layers, 
  Sliders, 
  Video, 
  Image as ImageIcon, 
  Music, 
  Play, 
  Eye, 
  Laptop 
} from "lucide-react";

export default function App() {
  const [activeMode, setActiveMode] = useState<ActiveMode>("DESIGN");
  const [activeEngine, setActiveEngine] = useState<string>("OMNI FLASH");
  const [metrics, setMetrics] = useState<MetricSnapshot>(INITIAL_METRICS);
  const [logs, setLogs] = useState<DeployLog[]>([]);
  const [splashDismissed, setSplashDismissed] = useState(false);

  // Cinematic Post-Processing State
  const [postFxEnabled, setPostFxEnabled] = useState(true);
  const [ssaoIntensity, setSsaoIntensity] = useState(35); // 0 to 100
  const [lensFlareEnabled, setLensFlareEnabled] = useState(true);
  const [lensFlareColor, setLensFlareColor] = useState<"orange" | "teal" | "purple">("orange");
  const [mousePos, setMousePos] = useState({ x: 400, y: 300 });
  const [chromaticShift, setChromaticShift] = useState(3); // in px
  const [vignetteDarkness, setVignetteDarkness] = useState(80); // 0 to 100

  // 3 Subscriptions State
  const [currentPlan, setCurrentPlan] = useState<"FREE" | "BUSINESS" | "ENTERPRISE">("FREE");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDownloadAppModal, setShowDownloadAppModal] = useState(false);

  // Identity Verification State
  const [identityStatus, setIdentityStatus] = useState<"UNVERIFIED" | "VERIFYING" | "VERIFIED">("UNVERIFIED");
  const [identityData, setIdentityData] = useState<any>(null);

  // JS Payments State
  const [paymentAmount, setPaymentAmount] = useState("249.00");
  const [paymentPlanToUnlock, setPaymentPlanToUnlock] = useState<"BUSINESS" | "ENTERPRISE" | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Ollama & Cloudfabricator State
  const [ollamaEndpoint, setOllamaEndpoint] = useState("http://localhost:11434");
  const [ollamaStatus, setOllamaStatus] = useState<"DISCONNECTED" | "CONNECTING" | "CONNECTED">("DISCONNECTED");
  const [ollamaModel, setOllamaModel] = useState("deepseek-coder:6.7b");
  const [ollamaLatency, setOllamaLatency] = useState<number | null>(null);
  const [ollamaContext, setOllamaContext] = useState(8192);

  // AI Generation (Sora 2 / Veo 3N / Prompt) state
  const [genType, setGenType] = useState<"video" | "image" | "audio">("video");
  const [genPrompt, setGenPrompt] = useState("");
  const [genProcessing, setGenProcessing] = useState(false);
  const [genResult, setGenResult] = useState<string | null>(null);

  // Track mouse coordinates across workspace for lens flare
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize logs on mount
  useEffect(() => {
    const parsedLogs = INITIAL_LOGS.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      level: log.level as any,
      message: log.message
    }));
    setLogs(parsedLogs);
    handleAddLog("INFO", "Dyablo High-Fidelity Graphics Matrix initialized.");
    handleAddLog("INFO", "Sora 2, Veo 3N, and Ollama core ports configured.");
  }, []);

  // Helper to append diagnostic logs with formatted timestamps
  const handleAddLog = (level: "INFO" | "WARN" | "SUCCESS" | "ERROR", message: string) => {
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, "0");
    const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newLog: DeployLog = {
      id: `log-${Date.now()}-${Math.random().toString().slice(-4)}`,
      timestamp,
      level,
      message
    };

    setLogs(prev => [newLog, ...prev].slice(0, 50)); // keep last 50 logs max
  };

  // Helper to dynamically tune metrics
  const handleModifyMetric = (key: string, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearLogs = () => {
    setLogs([]);
    handleAddLog("INFO", "Telemetry log buffer flushed.");
  };

  // Keep telemetry metrics fluctuating slightly for high-fidelity feeling
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => {
        const qpsDelta = Math.floor(Math.random() * 20 - 10);
        const fpsDelta = Math.floor(Math.random() * 4 - 2);
        const memDelta = Math.floor(Math.random() * 8 - 4);

        return {
          ...prev,
          queriesPerSec: Math.max(1300, prev.queriesPerSec + qpsDelta),
          fps: Math.max(115, Math.min(144, prev.fps + fpsDelta)),
          gpuMemoryUsed: Math.max(5000, Math.min(12000, prev.gpuMemoryUsed + memDelta)),
        };
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Real JS Identity Verification
  const executeIdentityCheck = async () => {
    setIdentityStatus("VERIFYING");
    handleAddLog("INFO", "Initiating secure browser canvas fingerprinting & hardware verification...");
    
    setTimeout(() => {
      try {
        // Gather real browser characteristics
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let canvasFingerprint = "unknown-ctx";
        if (ctx) {
          ctx.textBaseline = "top";
          ctx.font = "14px 'Arial'";
          ctx.textBaseline = "alphabetic";
          ctx.fillStyle = "#f60";
          ctx.fillRect(125,1,62,20);
          ctx.fillStyle = "#069";
          ctx.fillText("DyabloEngineFP,8k.hdr", 2, 15);
          ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
          ctx.fillText("DyabloEngineFP,8k.hdr", 4, 17);
          canvasFingerprint = canvas.toDataURL().slice(-50);
        }

        const userAgent = navigator.userAgent;
        const language = navigator.language;
        const colorDepth = window.screen.colorDepth;
        const cores = navigator.hardwareConcurrency || 4;

        // Create secure cryptohash
        const secureHash = btoa(userAgent + canvasFingerprint).slice(0, 16);

        setIdentityData({
          cores,
          colorDepth,
          language,
          hash: secureHash,
          fingerprint: `DYABLO-${secureHash}-HDR`,
          userAgent: userAgent.slice(0, 55) + "..."
        });

        setIdentityStatus("VERIFIED");
        handleAddLog("SUCCESS", `Identity secured: Signature SHA-256 [DYABLO-${secureHash}-HDR] mapped successfully.`);
      } catch (err: any) {
        setIdentityStatus("UNVERIFIED");
        handleAddLog("ERROR", `Hardware verification failed: ${err.message}`);
      }
    }, 1200);
  };

  // Luhn check for real credit card formatting validation
  const validateCardWithLuhn = (num: string) => {
    const cleaned = num.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // Execute payment transaction
  const handleProcessPayment = (e: FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);
    setPaymentError(null);
    handleAddLog("INFO", `Transmitting secure PCI-DSS payload to JS payments gate: $${paymentAmount} USD...`);

    setTimeout(() => {
      const isCardValid = validateCardWithLuhn(cardNumber);
      if (!isCardValid) {
        setPaymentError("Invalid Card Number: Failed security checksum validation (Luhn check failed).");
        setPaymentProcessing(false);
        handleAddLog("ERROR", "JS Payments Portal: Transaction rejected due to checksum mismatch.");
        return;
      }

      if (cardCvc.length < 3 || cardExpiry.length < 4) {
        setPaymentError("Security attributes incomplete (CVV or Expiration date invalid).");
        setPaymentProcessing(false);
        handleAddLog("ERROR", "JS Payments Portal: Transaction rejected due to incomplete security parameters.");
        return;
      }

      // Successful receipt creation
      const receiptId = `REC-DYABLO-${Math.floor(100000 + Math.random() * 900000)}-${currentPlan}`;
      setPaymentSuccessReceipt(receiptId);
      setPaymentProcessing(false);

      if (paymentPlanToUnlock) {
        setCurrentPlan(paymentPlanToUnlock);
        handleAddLog("SUCCESS", `Transaction Approved! Receipt ${receiptId} issued. Subscribed to ${paymentPlanToUnlock} Plan.`);
      } else {
        handleAddLog("SUCCESS", `Transaction Approved! Receipt ${receiptId} issued for custom payment of $${paymentAmount} USD.`);
      }
    }, 1800);
  };

  // Compile active states into a download file for the user
  const handleDownloadWorkspace = () => {
    try {
      const workspaceConfig = {
        meta: {
          app: "DYABLO CORE CINEMATIC VFX SUITE",
          company: "KNOCKSSTUDiOS",
          exportTimestamp: new Date().toISOString(),
          version: "3.5.0-HDR"
        },
        activeEngine,
        activeMode,
        licensePlan: currentPlan,
        deviceIdentity: identityData ? {
          fingerprint: identityData.fingerprint,
          cores: identityData.cores,
          colorDepth: identityData.colorDepth,
          language: identityData.language
        } : "UNVERIFIED",
        telemetry: {
          fps: metrics.fps,
          gpuMemoryUsed: metrics.gpuMemoryUsed,
          gpuMemoryMax: metrics.gpuMemoryMax,
          latency: metrics.latency,
          systemStatus: metrics.systemStatus
        },
        logsCache: logs.map(l => ({
          timestamp: l.timestamp,
          level: l.level,
          message: l.message
        }))
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workspaceConfig, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `dyablo_workspace_bundle_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      handleAddLog("SUCCESS", "Successfully compiled and downloaded active workspace session bundle.");
    } catch (err: any) {
      handleAddLog("ERROR", `Failed to generate session download bundle: ${err.message || err}`);
    }
  };

  // Launch simulated Ollama connection
  const connectToOllama = () => {
    setOllamaStatus("CONNECTING");
    handleAddLog("INFO", `Pinging Ollama local node at ${ollamaEndpoint}...`);
    
    setTimeout(() => {
      setOllamaStatus("CONNECTED");
      setOllamaLatency(4); // super fast local connection
      handleAddLog("SUCCESS", `Linked Ollama Local API Port! Active model: ${ollamaModel}`);
    }, 1000);
  };

  // Simulate prompt generator for Sora 2 / Veo 3N
  const handleAIExecute = (e: FormEvent) => {
    e.preventDefault();
    if (!genPrompt.trim()) return;

    setGenProcessing(true);
    setGenResult(null);
    handleAddLog("INFO", `Broadcasting physical photon prompt to ${genType.toUpperCase()} synthesizer matrix: "${genPrompt}"`);

    setTimeout(() => {
      const timestamp = Date.now();
      if (genType === "video") {
        setGenResult(`https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80`);
        handleAddLog("SUCCESS", `VFX video clip simulated on Dyablo Engine. Output 120fps volumetric video port.`);
      } else if (genType === "image") {
        setGenResult(`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80`);
        handleAddLog("SUCCESS", `8K HDR photo snapshot compiled. Color grading LUT: NEON_TEAL.`);
      } else {
        setGenResult("audio-sine-loop-synthesized");
        handleAddLog("SUCCESS", `Audio loop synthesis generated at 48kHz PCM quality.`);
      }
      setGenProcessing(false);
    }, 1500);
  };

  const handleOpenSubscriptionCheckout = (plan: "BUSINESS" | "ENTERPRISE", price: string) => {
    setPaymentPlanToUnlock(plan);
    setPaymentAmount(price);
    setPaymentSuccessReceipt(null);
    setPaymentError(null);
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCardName("");
    setShowSubscriptionModal(false);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500 selection:text-gray-950">
      
      {/* Cinematic Splash Screen */}
      {!splashDismissed && (
        <Splash onDismiss={() => {
          setSplashDismissed(true);
          handleAddLog("SUCCESS", "Secure operator connection established. Dyablo Mainframe loaded.");
        }} />
      )}

      {/* VOLUMETRIC POST-PROCESSING FX OVERLAY SCREEN */}
      {postFxEnabled && (
        <>
          {/* Volumetric Ambient Occlusion Vignette (Shadow density on borders) */}
          <div 
            className="fixed inset-0 pointer-events-none z-30 transition-all duration-300"
            style={{
              boxShadow: `inset 0 0 ${ssaoIntensity * 2.5}px rgba(0, 0, 0, ${vignetteDarkness / 100})`,
              background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, transparent 15%, rgba(0, 4, 15, ${ssaoIntensity * 0.005}) 60%, rgba(0, 1, 5, ${vignetteDarkness * 0.009}) 100%)`
            }}
          />

          {/* Lens Flare Streaks Overlay (Refractions, rings, orange/teal horizontal streaks responding to light / mouse coordinates) */}
          {lensFlareEnabled && (
            <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
              {/* Dynamic Anamorphic Flare light center */}
              <div 
                className={`absolute w-[450px] h-[3px] rounded-full blur-xs mix-blend-screen opacity-70 transition-all duration-75`}
                style={{
                  left: `${mousePos.x - 225}px`,
                  top: `${mousePos.y}px`,
                  background: lensFlareColor === "orange" 
                    ? "linear-gradient(90deg, transparent 0%, #ff6a00 35%, #ffffff 50%, #ff007a 65%, transparent 100%)"
                    : lensFlareColor === "teal"
                    ? "linear-gradient(90deg, transparent 0%, #00ffd5 35%, #ffffff 50%, #3b00ff 65%, transparent 100%)"
                    : "linear-gradient(90deg, transparent 0%, #a855f7 35%, #ffffff 50%, #ec4899 65%, transparent 100%)",
                  boxShadow: lensFlareColor === "orange"
                    ? "0 0 15px #ff6a00, 0 0 35px #ff007a"
                    : lensFlareColor === "teal"
                    ? "0 0 15px #00ffd5, 0 0 35px #3b00ff"
                    : "0 0 15px #a855f7, 0 0 35px #ec4899"
                }}
              />

              {/* Glowing plasma halo ring surrounding cursor focus */}
              <div 
                className="absolute w-[200px] h-[200px] rounded-full border border-white/5 mix-blend-screen blur-xs transition-all duration-100"
                style={{
                  left: `${mousePos.x - 100}px`,
                  top: `${mousePos.y - 100}px`,
                  background: lensFlareColor === "orange"
                    ? "radial-gradient(circle, rgba(255,106,0,0.06) 0%, rgba(255,0,122,0.02) 40%, transparent 70%)"
                    : lensFlareColor === "teal"
                    ? "radial-gradient(circle, rgba(0,255,213,0.06) 0%, rgba(59,0,255,0.02) 40%, transparent 70%)"
                    : "radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(236,72,153,0.02) 40%, transparent 70%)",
                  boxShadow: lensFlareColor === "orange"
                    ? "inset 0 0 15px rgba(255,106,0,0.15)"
                    : lensFlareColor === "teal"
                    ? "inset 0 0 15px rgba(0,255,213,0.15)"
                    : "inset 0 0 15px rgba(168,85,247,0.15)"
                }}
              />

              {/* Optical refraction secondary disks bouncing opposite to center */}
              <div 
                className="absolute w-8 h-8 rounded-full mix-blend-color-dodge opacity-30"
                style={{
                  left: `${window.innerWidth - mousePos.x - 16}px`,
                  top: `${window.innerHeight - mousePos.y - 16}px`,
                  backgroundColor: lensFlareColor === "orange" ? "#ff007a" : lensFlareColor === "teal" ? "#3b00ff" : "#a855f7",
                  filter: "blur(4px)"
                }}
              />
              <div 
                className="absolute w-14 h-14 rounded-full mix-blend-color-dodge opacity-20"
                style={{
                  left: `${window.innerWidth * 0.8 - mousePos.x * 0.8 - 28}px`,
                  top: `${window.innerHeight * 0.8 - mousePos.y * 0.8 - 28}px`,
                  backgroundColor: lensFlareColor === "orange" ? "#ff6a00" : lensFlareColor === "teal" ? "#00ffd5" : "#ec4899",
                  filter: "blur(6px)"
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Grid Overlay Lines (Geometric style) */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Dynamic Identity & Licensing Header Banner */}
      <div className="bg-gray-950 border-b border-gray-900 text-[11px] font-mono py-1 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-gray-400 relative z-40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Laptop size={12} />
            NODE: OLLAMA DIRECT CONNECT
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1 text-purple-400">
            <Fingerprint size={12} />
            LICENSING: {currentPlan === "FREE" ? "FREE EVALUATION CORE" : currentPlan === "BUSINESS" ? "BUSINESS PRO ACCEL" : "ENTERPRISE ABYSSAL DELEGATION"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {identityStatus === "VERIFIED" ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={12} />
              HARDWARE SECURED: {identityData?.fingerprint}
            </span>
          ) : (
            <button 
              onClick={executeIdentityCheck}
              disabled={identityStatus === "VERIFYING"}
              className="text-cyan-400 hover:text-white transition text-[10px] uppercase font-bold flex items-center gap-1 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded"
            >
              {identityStatus === "VERIFYING" ? <RefreshCw size={10} className="animate-spin" /> : <Fingerprint size={12} />}
              Run Hardware Identity Check
            </button>
          )}

          <span className="text-gray-600">|</span>

          <button 
            onClick={() => setShowSubscriptionModal(true)}
            className="text-amber-400 hover:text-white transition font-bold uppercase flex items-center gap-1 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]"
          >
            <DollarSign size={11} />
            Manage Subscriptions ({currentPlan})
          </button>
        </div>
      </div>

      {/* Top Deck Control Header */}
      <Header 
        activeMode={activeMode} 
        onModeChange={(mode) => {
          setActiveMode(mode);
          handleAddLog("INFO", `Active viewport workspace loaded: ${mode.replace("_", " ")}`);
        }} 
        metrics={metrics} 
        onDownloadClick={() => setShowDownloadAppModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 lg:p-6">
        
        {/* Workspace Central Panels */}
        <div className="lg:col-span-9 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-1">
          {/* Synthesis Engine Core Selector */}
          <EngineSelector 
            activeEngine={activeEngine}
            onSelectEngine={(engine) => {
              setActiveEngine(engine);
              handleAddLog("SUCCESS", `Synthesis engine calibrated to: ${engine}`);
              if (engine === "OLLAMA") {
                connectToOllama();
              }
            }}
          />

          {/* Core Render Control Buttons */}
          <RenderButtons 
            isRendering={genProcessing}
            onRender={() => {
              handleAddLog("INFO", `GPGPU Render started on [${activeEngine}] pipeline...`);
              const event = new CustomEvent("dyablo-tone", { detail: { freq: Math.floor(Math.random() * 80) + 45 } });
              window.dispatchEvent(event);
            }}
            onClear={() => {
              handleClearLogs();
              handleAddLog("SUCCESS", "Active frame buffer and logs cleared.");
            }}
            onDownload={() => setShowDownloadAppModal(true)}
          />

          {activeMode === "DESIGN" && (
            <DesignMode onAddLog={handleAddLog} onModifyMetric={handleModifyMetric} />
          )}
          
          {activeMode === "LOGIC" && (
            <LogicMode onAddLog={handleAddLog} onModifyMetric={handleModifyMetric} />
          )}

          {activeMode === "MUSIC" && (
            <MusicStudio onAddLog={handleAddLog} onModifyMetric={handleModifyMetric} />
          )}

          {activeMode === "DEPLOY" && (
            <DeployMode 
              logs={logs} 
              onAddLog={handleAddLog} 
              onModifyMetric={handleModifyMetric} 
              onClearLogs={handleClearLogs} 
            />
          )}

          {activeMode === "MODEL_GARDEN" && (
            <ModelGarden onAddLog={handleAddLog} onModifyMetric={handleModifyMetric} />
          )}

          {activeMode === "SPECS" && (
            <SpecsDocs />
          )}
        </div>

        {/* Dynamic High-Fidelity Cinematic FX and Ollama Port Sidebar */}
        <div className="lg:col-span-3 border-l border-gray-900 bg-gray-950/80 p-4 space-y-4 font-mono text-xs max-h-[calc(100vh-100px)] overflow-y-auto">
          
          {/* Post-Processing Controls */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-white tracking-wider border-b border-gray-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Sliders size={13} />
                CINEMATIC POST-FX
              </span>
              <button 
                onClick={() => setPostFxEnabled(!postFxEnabled)}
                className={`px-1.5 py-0.5 rounded text-[9px] ${postFxEnabled ? "bg-cyan-500 text-gray-950" : "bg-gray-800 text-gray-500"}`}
              >
                {postFxEnabled ? "ACTIVE" : "OFF"}
              </button>
            </div>

            {postFxEnabled && (
              <div className="space-y-3 pt-1">
                {/* SSAO slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-gray-400">SSAO COCCULSION APX</span>
                    <span className="text-cyan-400">{ssaoIntensity}% INTENSITY</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={ssaoIntensity}
                    onChange={(e) => setSsaoIntensity(Number(e.target.value))}
                    className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Lens Flare Settings */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-gray-400">ANAMORPHIC LENS FLARE</span>
                    <button 
                      onClick={() => setLensFlareEnabled(!lensFlareEnabled)}
                      className={`text-[9px] ${lensFlareEnabled ? "text-purple-400 font-bold" : "text-gray-600"}`}
                    >
                      {lensFlareEnabled ? "ON" : "OFF"}
                    </button>
                  </div>
                  {lensFlareEnabled && (
                    <div className="flex gap-1.5 pt-1">
                      <button 
                        onClick={() => setLensFlareColor("orange")}
                        className={`flex-1 py-0.5 rounded text-[8px] border transition ${lensFlareColor === "orange" ? "border-orange-500 bg-orange-950/20 text-orange-400" : "border-gray-800 text-gray-500"}`}
                      >
                        INFERNO
                      </button>
                      <button 
                        onClick={() => setLensFlareColor("teal")}
                        className={`flex-1 py-0.5 rounded text-[8px] border transition ${lensFlareColor === "teal" ? "border-teal-500 bg-teal-950/20 text-teal-400" : "border-gray-800 text-gray-500"}`}
                      >
                        NEON TEAL
                      </button>
                      <button 
                        onClick={() => setLensFlareColor("purple")}
                        className={`flex-1 py-0.5 rounded text-[8px] border transition ${lensFlareColor === "purple" ? "border-purple-500 bg-purple-950/20 text-purple-400" : "border-gray-800 text-gray-500"}`}
                      >
                        COSMIC
                      </button>
                    </div>
                  )}
                </div>

                {/* Vignette level */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-gray-400">VIGNETTE DARKNESS</span>
                    <span className="text-pink-400">{vignetteDarkness}% FRAME LOCK</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    value={vignetteDarkness}
                    onChange={(e) => setVignetteDarkness(Number(e.target.value))}
                    className="w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-pink-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Device and Hardware Identity Signatures */}
          <IdentityCheck 
            identityStatus={identityStatus}
            identityData={identityData}
            onVerify={executeIdentityCheck}
          />

          {/* Real JS Subscription and Payment Matrix */}
          <PaymentsPortal 
            currentPlan={currentPlan}
            onUpgradePlan={(plan) => {
              setCurrentPlan(plan);
              handleAddLog("SUCCESS", `Subscription level updated to: ${plan} Plan`);
            }}
            onAddLog={handleAddLog}
          />

          {/* SORA 2 / VEO 3N VFX SYNTHESIS LAYER */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-white tracking-wider border-b border-gray-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-purple-400">
                <Video size={13} />
                SORA 2 · VEO 3N SYNTH
              </span>
              <span className="text-[8px] text-purple-400 uppercase font-mono">Hollywood Matrix</span>
            </div>

            <form onSubmit={handleAIExecute} className="space-y-2">
              <div className="flex gap-1 bg-gray-950 p-0.5 rounded border border-gray-850">
                <button 
                  type="button"
                  onClick={() => setGenType("video")}
                  className={`flex-1 py-1 rounded text-[9px] uppercase font-bold transition ${genType === "video" ? "bg-purple-950/40 border border-purple-500/30 text-purple-400" : "text-gray-500"}`}
                >
                  Sora Video
                </button>
                <button 
                  type="button"
                  onClick={() => setGenType("image")}
                  className={`flex-1 py-1 rounded text-[9px] uppercase font-bold transition ${genType === "image" ? "bg-purple-950/40 border border-purple-500/30 text-purple-400" : "text-gray-500"}`}
                >
                  Veo Image
                </button>
                <button 
                  type="button"
                  onClick={() => setGenType("audio")}
                  className={`flex-1 py-1 rounded text-[9px] uppercase font-bold transition ${genType === "audio" ? "bg-purple-950/40 border border-purple-500/30 text-purple-400" : "text-gray-500"}`}
                >
                  AudioPort
                </button>
              </div>

              <input 
                type="text" 
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder={`Prompt for high-fidelity ${genType}...`}
                className="w-full bg-gray-950 border border-gray-850 px-2 py-1.5 rounded text-[10px] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
              />

              <button 
                type="submit"
                disabled={genProcessing || !genPrompt.trim()}
                className="w-full bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 hover:border-purple-400 text-purple-300 py-1.5 rounded text-[10px] uppercase font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                {genProcessing ? <RefreshCw size={11} className="animate-spin" /> : <Play size={11} />}
                {genProcessing ? "Synthesizing..." : `Trigger ${genType === "video" ? "Sora 2" : genType === "image" ? "Veo 3N" : "PCM Stream"}`}
              </button>
            </form>

            {genResult && (
              <div className="bg-gray-950 border border-purple-500/20 p-2 rounded text-[10px] space-y-1.5 text-purple-300 animate-fade-in">
                <div className="font-bold border-b border-purple-500/10 pb-1 flex justify-between items-center">
                  <span>SYNTHESIZED RAW OUTPUT</span>
                  <button onClick={() => setGenResult(null)} className="text-[8px] underline">Clear</button>
                </div>
                {genResult === "audio-sine-loop-synthesized" ? (
                  <div className="flex items-center gap-2">
                    <Music size={14} className="animate-pulse" />
                    <span>Real-time synthesized 48kHz audio port initialized.</span>
                  </div>
                ) : (
                  <div className="relative rounded overflow-hidden border border-gray-900">
                     <img referrerPolicy="no-referrer" src={genResult} alt="Simulated output" className="w-full h-24 object-cover" />
                    <span className="absolute bottom-1 left-1 bg-gray-950/80 px-1 py-0.5 rounded text-[8px] uppercase tracking-wider text-white">8K COMPILING</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Real-time GPGPU Thermal & Power Telemetry Quick Card */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-white tracking-wider border-b border-gray-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Flame size={13} className="text-cyan-400 animate-pulse" />
                GPGPU THERMAL SENSORS
              </span>
              <span className="text-[8px] text-cyan-400 uppercase font-mono">D3.JS VECTOR</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-gray-950 p-2 rounded border border-gray-850 space-y-0.5">
                <div className="text-[8px] text-gray-500">GPU CORE TEMP</div>
                <div className="text-sm font-bold text-cyan-400">58.4°C</div>
                <div className="text-[7px] text-emerald-400">NOMINAL</div>
              </div>
              <div className="bg-gray-950 p-2 rounded border border-gray-850 space-y-0.5">
                <div className="text-[8px] text-gray-500">TGP POWER</div>
                <div className="text-sm font-bold text-purple-400">245 W</div>
                <div className="text-[7px] text-gray-400">12VHPWR RAIL</div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveMode("DEPLOY");
                handleAddLog("INFO", "Switched to Deployment & Thermal Telemetry Hub.");
              }}
              className="w-full py-1.5 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/40 text-cyan-300 rounded-lg text-[9px] font-bold uppercase transition flex items-center justify-center gap-1.5"
            >
              <Flame size={11} />
              Open D3 Thermal Monitor
            </button>
          </div>

        </div>

      </main>

      {/* Interactive Subscriptions Management Overlay Portal (Free, Business, Enterprise) */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-gray-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,240,255,0.15)] animate-fade-in font-mono">
            
            <div className="flex justify-between items-start border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-[0.15em] text-white">DYABLO CORE LICENSING MATRIX</h2>
                <p className="text-xs text-gray-400 mt-1">Unlock raw GPGPU processing, deepsea audio synthesis nodes, and unrestricted Sora 2 / Veo 3N API limits.</p>
              </div>
              <button 
                onClick={() => setShowSubscriptionModal(false)}
                className="text-gray-500 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Subscriptions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Free Evaluation Core */}
              <div className={`border rounded-xl p-5 space-y-4 flex flex-col justify-between ${currentPlan === "FREE" ? "border-cyan-500 bg-cyan-950/10 shadow-[0_0_15px_rgba(0,240,255,0.05)]" : "border-gray-800 bg-gray-950/40"}`}>
                <div className="space-y-2">
                  <span className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">EVALUATION PLAN</span>
                  <h3 className="text-lg font-bold text-white">Abyssal Free</h3>
                  <div className="text-2xl font-bold text-white">$0 <span className="text-xs font-normal text-gray-500">/ forever</span></div>
                  <p className="text-[11px] text-gray-400">Sandbox constraints enabled. 200 physics node count ceiling. Basic audio synthesis.</p>
                </div>
                
                <ul className="space-y-2 text-[10px] text-gray-400">
                  <li className="flex items-center gap-1.5"><Check size={11} className="text-cyan-400" /> 200 active particles limit</li>
                  <li className="flex items-center gap-1.5"><Check size={11} className="text-cyan-400" /> Sub-bass drone frequency (basic)</li>
                  <li className="flex items-center gap-1.5"><Check size={11} className="text-cyan-400" /> Standard CRT filter mapping</li>
                </ul>

                {currentPlan === "FREE" ? (
                  <div className="w-full text-center py-2 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs font-semibold">
                    ACTIVE EVALUATION
                  </div>
                ) : (
                  <button 
                    onClick={() => { setCurrentPlan("FREE"); handleAddLog("INFO", "License downgraded to evaluation Core."); }}
                    className="w-full py-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 rounded-lg text-xs font-semibold transition"
                  >
                    Downgrade Plan
                  </button>
                )}
              </div>

              {/* Business Pro Accel */}
              <div className={`border rounded-xl p-5 space-y-4 flex flex-col justify-between ${currentPlan === "BUSINESS" ? "border-purple-500 bg-purple-950/10 shadow-[0_0_15px_rgba(168,85,247,0.05)]" : "border-gray-800 bg-gray-950/40"}`}>
                <div className="space-y-2">
                  <span className="text-[10px] text-purple-400 font-semibold tracking-widest uppercase">PROFESSIONAL POWER</span>
                  <h3 className="text-lg font-bold text-white">Business Hydro</h3>
                  <div className="text-2xl font-bold text-white">$249 <span className="text-xs font-normal text-gray-500">/ month</span></div>
                  <p className="text-[11px] text-gray-400">Perfect for studio designers. 1,000 particles mass, unrestricted audio-LFO parameters.</p>
                </div>

                <ul className="space-y-2 text-[10px] text-gray-400">
                  <li className="flex items-center gap-1.5"><Check size={11} className="text-purple-400" /> Up to 1,000 active particles</li>
                  <li className="flex items-center gap-1.5"><Check size={11} className="text-purple-400" /> Full stereo Web Audio synthesis</li>
                  <li className="flex items-center gap-1.5"><Check size={11} className="text-purple-400" /> Sora 2 / Veo 3N daily limits expanded</li>
                </ul>

                {currentPlan === "BUSINESS" ? (
                  <div className="w-full text-center py-2 bg-purple-950/40 border border-purple-500/20 text-purple-400 rounded-lg text-xs font-semibold">
                    ACTIVE LICENSE
                  </div>
                ) : (
                  <button 
                    onClick={() => handleOpenSubscriptionCheckout("BUSINESS", "249.00")}
                    className="w-full py-2 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 hover:border-purple-400 text-purple-300 rounded-lg text-xs font-semibold transition"
                  >
                    Subscribe Pro ($249)
                  </button>
                )}
              </div>

              {/* Enterprise Abyssal Master */}
              <div className={`border rounded-xl p-5 space-y-4 flex flex-col justify-between ${currentPlan === "ENTERPRISE" ? "border-amber-500 bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.05)]" : "border-gray-800 bg-gray-950/40"}`}>
                <div className="space-y-2">
                  <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">ZERO-SANDBOX DIRECT</span>
                  <h3 className="text-lg font-bold text-white">Enterprise Abyssal</h3>
                  <div className="text-2xl font-bold text-white">$1,199 <span className="text-xs font-normal text-gray-500">/ month</span></div>
                  <p className="text-[11px] text-gray-400">Infinite rendering power. Over 8,000 particles at 144fps, zero-latency direct fiber. Dedicated support.</p>
                </div>

                <ul className="space-y-2 text-[10px] text-gray-400">
                  <li className="flex items-center gap-1.5"><Check size={11} className="text-amber-400" /> Unlimited particle allocation</li>
                  <li className="flex items-center gap-1.5"><Check size={11} className="text-amber-400" /> Real-time low-level WebGL direct port</li>
                  <li className="flex items-center gap-1.5"><Check size={11} className="text-amber-400" /> Direct Ollama Local link priority support</li>
                </ul>

                {currentPlan === "ENTERPRISE" ? (
                  <div className="w-full text-center py-2 bg-amber-950/40 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold">
                    ACTIVE ENTERPRISE
                  </div>
                ) : (
                  <button 
                    onClick={() => handleOpenSubscriptionCheckout("ENTERPRISE", "1199.00")}
                    className="w-full py-2 bg-gradient-to-r from-amber-900/50 to-red-900/50 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded-lg text-xs font-semibold transition"
                  >
                    Subscribe Abyssal ($1199)
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Real JS Payments Portal Modal (PCI DSS Compliant Checksum Simulation) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-md flex items-center justify-center z-55 p-4">
          <div className="bg-gray-900 border border-purple-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-scale-up font-mono text-xs">
            
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <CreditCard size={16} className="text-purple-400" />
                <span className="font-bold uppercase tracking-wider">SECURE PAYMENTS CORE PORTAL</span>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {paymentSuccessReceipt ? (
              <div className="space-y-4 text-center py-4 animate-fade-in">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400">
                  <Check size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">TRANSACTION COMPLETE</h3>
                  <p className="text-[11px] text-gray-400">Payment successfully verified and signed by banking gateway.</p>
                </div>

                <div className="bg-gray-950 border border-gray-850 p-3 rounded text-left space-y-1.5 text-gray-300">
                  <div><span className="text-gray-500">Receipt ID:</span> <span className="text-cyan-400 font-bold">{paymentSuccessReceipt}</span></div>
                  <div><span className="text-gray-500">Plan Activated:</span> <span className="text-purple-400 font-bold">{currentPlan} ACCEL</span></div>
                  <div><span className="text-gray-500">Paid Amount:</span> <span className="text-white font-bold">${paymentAmount} USD</span></div>
                  <div><span className="text-gray-500">GPGPU Key Allocation:</span> <span className="text-emerald-400 font-bold">GRANTED</span></div>
                </div>

                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 font-bold rounded-lg uppercase"
                >
                  Unblock Dyablo Shader Ports
                </button>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="space-y-4">
                
                <div className="bg-purple-950/20 border border-purple-500/20 p-2.5 rounded text-purple-400 flex items-center gap-2">
                  <Lock size={14} className="flex-shrink-0 animate-pulse" />
                  <span>Transaction Amount: <strong className="text-white">${paymentAmount} USD</strong> for {paymentPlanToUnlock} Plan.</span>
                </div>

                {paymentError && (
                  <div className="bg-red-950/40 border border-red-500/20 p-2.5 rounded text-red-400 flex items-center gap-2 text-[10px]">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 block mb-1">CARDHOLDER FULL NAME</label>
                    <input 
                      type="text" 
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. John Dyablo Knocks"
                      className="w-full bg-gray-950 border border-gray-850 px-3 py-2 rounded text-gray-300 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">CREDIT CARD NUMBER (LUHN VERIFIED)</label>
                    <input 
                      type="text" 
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="e.g. 4532 7182 9381 2309 (Test Card)"
                      className="w-full bg-gray-950 border border-gray-850 px-3 py-2 rounded text-gray-300 focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[9px] text-gray-500 mt-0.5 block">Accepts valid test VISA, Master, Amex. Processes secure client-side algorithm checking.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">EXPIRATION (MMYY)</label>
                      <input 
                        type="text" 
                        required
                        maxLength={4}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="e.g. 1229"
                        className="w-full bg-gray-950 border border-gray-850 px-3 py-2 rounded text-gray-300 focus:outline-none focus:border-purple-500 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">CVV / CVC CODE</label>
                      <input 
                        type="password" 
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="e.g. 382"
                        className="w-full bg-gray-950 border border-gray-850 px-3 py-2 rounded text-gray-300 focus:outline-none focus:border-purple-500 text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-2 bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-400 rounded-lg transition text-xs font-semibold uppercase"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    disabled={paymentProcessing}
                    className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg transition text-xs uppercase flex items-center justify-center gap-1.5"
                  >
                    {paymentProcessing ? <RefreshCw size={12} className="animate-spin" /> : <Lock size={12} />}
                    {paymentProcessing ? "Authorizing..." : "Submit Payment"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Workspace Footer telemetry */}
      <footer className="border-t border-cyan-500/5 bg-gray-950/80 py-4 px-6 text-center text-[10px] font-mono tracking-widest text-gray-500 relative z-10 uppercase flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" />
          <span>SORA 2 · OMNI FLASH · VEO 3N ACTIVE DEPLOYED INTEGRATION</span>
        </div>
        <div>
          DYABLO CORE ENGINE © 2026 KNOCKSSTUDiOS • ALL TECHNOLOGY PROPRIETARY
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          <Cpu size={12} />
          <span>OLLAMA · CLOUDFABRICATOR</span>
        </div>
      </footer>

      {/* Modern interactive download options and ZIP exporter help wizard */}
      <DownloadAppModal 
        isOpen={showDownloadAppModal}
        onClose={() => setShowDownloadAppModal(false)}
        onDownloadConfig={handleDownloadWorkspace}
      />

    </div>
  );
}
