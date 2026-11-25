import { useState, useEffect } from "react";
import { DeployLog } from "../types";
import { Terminal, Cpu, RefreshCw, Activity, AlertTriangle, ShieldCheck, Play, ArrowRight, Loader2, Flame, Layers } from "lucide-react";
import ThermalMonitor from "./ThermalMonitor";

interface DeployModeProps {
  logs: DeployLog[];
  onAddLog: (level: "INFO" | "WARN" | "SUCCESS" | "ERROR", message: string) => void;
  onModifyMetric: (key: string, value: number) => void;
  onClearLogs: () => void;
}

export default function DeployMode({ logs, onAddLog, onModifyMetric, onClearLogs }: DeployModeProps) {
  const [environment, setEnvironment] = useState<"snapdragon" | "edge" | "cloud">("snapdragon");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [telemetryViewTab, setTelemetryViewTab] = useState<"ALL" | "THERMAL" | "LOGS">("ALL");
  
  // Failover simulation state
  const [isHealed, setIsHealed] = useState(true);
  const [healingStage, setHealingStage] = useState<string | null>(null);

  // Triggering the automated pipeline deployment sequence
  const handleDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployStep(1);
    onClearLogs();
    onAddLog("INFO", "Initializing APEX LUMA production packaging compiler...");
    
    setTimeout(() => {
      setDeployStep(2);
      onAddLog("INFO", "Compiling PBR raytracer pipelines & WebGL fragment assets...");
    }, 1200);

    setTimeout(() => {
      setDeployStep(3);
      onAddLog("INFO", "Integrating Web Audio PCM synthetics. Verifying AudioPort paths...");
    }, 2400);

    setTimeout(() => {
      setDeployStep(4);
      onAddLog("INFO", "Applying Zero-Sandbox policy isolation layers. Enforcing secure RBAC rules...");
    }, 3600);

    setTimeout(() => {
      setDeployStep(5);
      onAddLog("SUCCESS", `Deploy succeeded! Active on environment cluster: ${environment.toUpperCase()}`);
      onModifyMetric("latency", 14);
      onModifyMetric("queriesPerSec", Math.floor(1800 + Math.random() * 200));
      setIsDeploying(false);
      setDeployStep(0);
    }, 4800);
  };

  // Trigger self-healing thread simulation
  const handleTriggerFailover = () => {
    if (!isHealed) return;
    setIsHealed(false);
    onAddLog("ERROR", "CRITICAL THREAD LATENCY SPIKE (480ms) detected on Sound Synthesis Engine!");
    onModifyMetric("latency", 480);
    onModifyMetric("fps", 24);
    setHealingStage("NODE_ISOLATION");

    setTimeout(() => {
      onAddLog("WARN", "Orchestrator self-healing triggered. Initiating Chronos Reasoning Core diagnostics...");
      setHealingStage("REASONING_DIAGNOSTICS");
    }, 1500);

    setTimeout(() => {
      onAddLog("INFO", "Diagnostics: detected sound node parameter overload. Injecting Vortex Code patch thread...");
      setHealingStage("VORTEX_PATCHING");
    }, 3200);

    setTimeout(() => {
      onAddLog("INFO", "Applying secure zero-downtime rollback to stable revision: v3.12-rev4...");
      setHealingStage("ROLLING_BACK");
    }, 4800);

    setTimeout(() => {
      setIsHealed(true);
      setHealingStage(null);
      onAddLog("SUCCESS", "Self-healing thread complete. Sound Synthesis Engine successfully restored to peak health. Latency normal.");
      onModifyMetric("latency", 16);
      onModifyMetric("fps", 120);
    }, 6500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto font-sans">
      
      {/* Left controls side panel (5 cols) */}
      <div className="xl:col-span-5 space-y-6">
        
        {/* Module description */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
          <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-1 flex items-center gap-1.5">
            <Cpu size={12} />
            RUNTIME OPERATIONS
          </h3>
          <p className="text-[11px] text-gray-400">
            Package and ship your designed application logic models to physical edge platforms. Realize zero-sandbox native isolation metrics instantly.
          </p>
        </div>

        {/* Environment Cluster Selector */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-4">
          <div className="text-xs font-mono text-gray-300 uppercase tracking-wider">TARGET ENVIRONMENT DEPLOY</div>
          
          <div className="space-y-2">
            <button
              onClick={() => { setEnvironment("snapdragon"); onAddLog("INFO", "Target cluster altered: Snapdragon-GPU (Device Edge)"); }}
              className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                environment === "snapdragon"
                  ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                  : "bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-750"
              }`}
            >
              <div className="font-semibold text-xs mb-0.5">🐉 Snapdragon GPU (Device Edge)</div>
              <div className="text-[10px] text-gray-500 font-sans">Direct GPU-grade physics rendering optimization, engineered for Snapdragon hardware.</div>
            </button>

            <button
              onClick={() => { setEnvironment("edge"); onAddLog("INFO", "Target cluster altered: Local Edge Hub Gateway"); }}
              className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                environment === "edge"
                  ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                  : "bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-750"
              }`}
            >
              <div className="font-semibold text-xs mb-0.5">🌐 Local Edge Hub Gateway</div>
              <div className="text-[10px] text-gray-500 font-sans">Microservice execution with high-speed caching and real-time state synclink.</div>
            </button>

            <button
              onClick={() => { setEnvironment("cloud"); onAddLog("INFO", "Target cluster altered: Core Cloud Matrix (Global Scale)"); }}
              className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                environment === "cloud"
                  ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                  : "bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-750"
              }`}
            >
              <div className="font-semibold text-xs mb-0.5">🌌 Core Cloud Matrix (Global Scale)</div>
              <div className="text-[10px] text-gray-500 font-sans">Multi-region distributed pipeline for handling concurrent traffic and heavy AI rendering.</div>
            </button>
          </div>

          <button
            onClick={handleDeploy}
            disabled={isDeploying || !isHealed}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition duration-300 font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            {isDeploying ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                PACKAGING COMPILATION MATRIX...
              </>
            ) : (
              <>
                <Play size={13} />
                ENGAGE COMPILATION & DEPLOY
              </>
            )}
          </button>
        </div>

        {/* Self Healing Module Trigger */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">FAILOVER COMPILER</span>
            <span className={`px-2 py-0.5 rounded text-[8px] font-mono border uppercase ${isHealed ? "bg-teal-950 text-teal-400 border-teal-500/20" : "bg-red-950 text-red-400 border-red-500/20 animate-pulse"}`}>
              {isHealed ? "Pipeline Green" : "Healing Active"}
            </span>
          </div>

          <p className="text-[10px] text-gray-500 leading-relaxed">
            Test the platform's self-healing capabilities. Triggering a simulated latency spike will prompt Chronos Reasoning to analyze the error logs, deploy a Vortex code patch, and perform a zero-downtime cluster rollback.
          </p>

          <button
            onClick={handleTriggerFailover}
            disabled={!isHealed || isDeploying}
            className={`w-full py-2 border rounded-lg font-mono text-xs font-semibold transition duration-300 flex items-center justify-center gap-1.5 ${
              isHealed 
                ? "bg-red-950/20 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-gray-950 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                : "bg-gray-950 border-gray-900 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isHealed ? (
              <>
                <AlertTriangle size={13} />
                SIMULATE HARDWARE OVERLOAD
              </>
            ) : (
              <div className="flex items-center gap-2 text-cyan-400">
                <Loader2 size={13} className="animate-spin text-cyan-400" />
                <span>
                  {healingStage === "NODE_ISOLATION" && "ISOLATING FAULTY CORES..."}
                  {healingStage === "REASONING_DIAGNOSTICS" && "CHRONOS GENERATING PLAN..."}
                  {healingStage === "VORTEX_PATCHING" && "VORTEX WRITING HOTFIX CODE..."}
                  {healingStage === "ROLLING_BACK" && "ROLLING BACK SECURE REVISION..."}
                </span>
              </div>
            )}
          </button>
        </div>

      </div>

      {/* Right Operations Log Terminal & D3 Thermal Monitor (7 cols) */}
      <div className="xl:col-span-7 flex flex-col gap-4">
        
        {/* Telemetry Hub Header & View Switcher */}
        <div className="flex items-center justify-between bg-gray-900/60 border border-gray-800 rounded-xl p-2.5 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white font-bold tracking-wider uppercase">HARDWARE TELEMETRY & AUDIT MATRIX</span>
          </div>
          <div className="flex bg-gray-950 border border-gray-850 rounded-lg p-0.5">
            <button
              onClick={() => setTelemetryViewTab("ALL")}
              className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase transition flex items-center gap-1 ${
                telemetryViewTab === "ALL" 
                  ? "bg-cyan-950 border border-cyan-500/40 text-cyan-300" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Layers size={10} />
              ALL-IN-ONE
            </button>
            <button
              onClick={() => setTelemetryViewTab("THERMAL")}
              className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase transition flex items-center gap-1 ${
                telemetryViewTab === "THERMAL" 
                  ? "bg-cyan-950 border border-cyan-500/40 text-cyan-300" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Flame size={10} />
              D3 THERMAL
            </button>
            <button
              onClick={() => setTelemetryViewTab("LOGS")}
              className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase transition flex items-center gap-1 ${
                telemetryViewTab === "LOGS" 
                  ? "bg-cyan-950 border border-cyan-500/40 text-cyan-300" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Terminal size={10} />
              LOG AUDIT
            </button>
          </div>
        </div>

        {/* Deployment Stepper Progress HUD */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 space-y-4">
          <div className="text-xs font-mono text-gray-300 uppercase tracking-wider">PIPELINE STAGE VISUALIZER</div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {[
              { num: 1, label: "BOOT" },
              { num: 2, label: "PBR COMPILER" },
              { num: 3, label: "AUDIO SYNC" },
              { num: 4, label: "ISOLATION" }
            ].map((step, idx) => {
              const isActive = deployStep === step.num;
              const isPast = deployStep > step.num || deployStep === 0;
              return (
                <div key={step.num} className="flex-1 flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-mono text-xs transition duration-300 ${
                    isActive 
                      ? "bg-cyan-950/60 border-cyan-400 text-cyan-400 shadow-[0_0_10px_#00F0FF] animate-pulse" 
                      : isPast 
                      ? "bg-teal-950/60 border-teal-500/40 text-teal-400" 
                      : "bg-gray-950 border-gray-800 text-gray-600"
                  }`}>
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <div className={`text-[10px] font-mono uppercase tracking-wider ${isActive ? "text-cyan-400 font-bold" : isPast ? "text-teal-400" : "text-gray-500"}`}>
                      {step.label}
                    </div>
                    <div className="text-[9px] text-gray-600 uppercase">
                      {isActive ? "COMPILING" : isPast ? "RESOLVED" : "PENDING"}
                    </div>
                  </div>
                  {idx < 3 && <ArrowRight size={12} className="text-gray-800 hidden sm:block" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* D3 Real-Time Thermal & Power Monitor Panel */}
        {(telemetryViewTab === "ALL" || telemetryViewTab === "THERMAL") && (
          <ThermalMonitor onAddLog={onAddLog} onModifyMetric={onModifyMetric} />
        )}

        {/* Real-Time Terminal Logger console */}
        {(telemetryViewTab === "ALL" || telemetryViewTab === "LOGS") && (
          <div className={`bg-gray-950 border border-gray-800 rounded-2xl p-4 flex flex-col ${telemetryViewTab === "LOGS" ? "h-[500px]" : "h-[320px]"} shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]`}>
            <div className="flex items-center justify-between border-b border-gray-850 pb-2 mb-3">
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                <Terminal size={12} />
                SYSTEM SHADER FEED (OPERATIONAL AUDIT)
              </span>
              <button 
                onClick={onClearLogs}
                className="text-[10px] font-mono text-gray-600 hover:text-cyan-400 transition"
              >
                Flush Audit Buffer
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] pr-2 scrollbar-thin">
              {logs.map((log) => {
                let badgeColor = "text-cyan-500";
                if (log.level === "WARN") badgeColor = "text-amber-500";
                if (log.level === "ERROR") badgeColor = "text-red-500";
                if (log.level === "SUCCESS") badgeColor = "text-teal-400";

                return (
                  <div key={log.id} className="flex items-start gap-2 py-0.5 border-b border-gray-900/40 hover:bg-gray-900/10">
                    <span className="text-gray-600 shrink-0 select-none">[{log.timestamp}]</span>
                    <span className={`shrink-0 font-bold tracking-wider select-none ${badgeColor}`}>
                      {log.level}
                    </span>
                    <span className="text-gray-300 leading-normal">{log.message}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-850/60 flex items-center justify-between text-[9px] font-mono text-gray-600">
              <span>ACTIVE SECURITY POLICY: strict-hardware-isolation-v3</span>
              <span>AUDIT CACHE COMPLIANT</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
