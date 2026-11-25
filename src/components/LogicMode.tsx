import { useState, useEffect, FormEvent } from "react";
import { LogicNode, LogicEdge } from "../types";
import { INITIAL_NODES, INITIAL_EDGES } from "../data";
import { Cpu, Play, Plus, RefreshCw, Code, Sparkles, Send, Loader2, Check } from "lucide-react";

interface LogicModeProps {
  onAddLog: (level: "INFO" | "WARN" | "SUCCESS" | "ERROR", message: string) => void;
  onModifyMetric: (key: string, value: number) => void;
}

export default function LogicMode({ onAddLog, onModifyMetric }: LogicModeProps) {
  const [nodes, setNodes] = useState<LogicNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<LogicEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("n-start");
  const [pulseActive, setPulseActive] = useState(false);
  const [pulseProgress, setPulseProgress] = useState(0);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [customCode, setCustomCode] = useState("");

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Generate real-time code matching the node graph
  useEffect(() => {
    const codeLines = [
      "/**",
      " * APEX LUMA Logic Thread compilation map",
      " * Owned & Operated by KNOCKSSTUDiOS",
      " * Built automatically via Vortex Code Core",
      " */",
      'import { APEXCore, PBRMaterialMatrix, SoundSynthesizer } from "@knocks/luma-engine";',
      "",
      "export async function runPipeline() {",
    ];

    nodes.forEach(node => {
      codeLines.push(`  // Node: ${node.label}`);
      codeLines.push(`  const ${node.id.replace("-", "_")} = APEXCore.registerNode("${node.id}", {`);
      codeLines.push(`    type: "${node.type}",`);
      Object.entries(node.config).forEach(([k, v]) => {
        codeLines.push(`    ${k}: ${typeof v === "number" ? v : `"${v}"`},`);
      });
      codeLines.push("  });");
      codeLines.push("");
    });

    // Add linkage edges
    codeLines.push("  // Establish edge flows");
    edges.forEach(edge => {
      codeLines.push(`  ${edge.source.replace("-", "_")}.linkOutput("${edge.sourceOutput}", ${edge.target.replace("-", "_")}, "${edge.targetInput}");`);
    });

    codeLines.push("");
    codeLines.push("  // Execute real-time render thread");
    codeLines.push("  return APEXCore.compile({");
    codeLines.push(`    nodes: [${nodes.map(n => n.id.replace("-", "_")).join(", ")}],`);
    codeLines.push("    targetPlatform: 'Snapdragon-GPU-Hardware',");
    codeLines.push("    zeroSandboxIsolation: true");
    codeLines.push("  });");
    codeLines.push("}");

    setCustomCode(codeLines.join("\n"));
  }, [nodes, edges]);

  // Simulate pulse flow along edges
  const handleTriggerPulse = () => {
    if (pulseActive) return;
    setPulseActive(true);
    setPulseProgress(0);
    onAddLog("INFO", "Compiling logic execution nodes. Deploying signal pulse...");

    // Stagger node activations as pulse passes
    setNodes(prev => prev.map(n => n.id === "n-start" ? { ...n, status: "active" } : { ...n, status: "idle" }));

    // Animate pulse
    const interval = setInterval(() => {
      setPulseProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPulseActive(false);
          // Set all nodes back to stable
          setNodes(p => p.map(n => ({ ...n, status: n.id === "n-start" || n.id === "n-output" ? "active" : "idle" })));
          onAddLog("SUCCESS", "Signal pulse reached target output node: Quantum Teal Viewport.");
          onModifyMetric("fps", 120);
          return 100;
        }

        // Stagger states
        if (prev === 25) {
          setNodes(p => p.map(n => n.id === "n-reasoner" ? { ...n, status: "active" } : n));
          onAddLog("INFO", "Orchestrator node matching input parameters. Chronos Core Reasoning computed.");
        }
        if (prev === 60) {
          setNodes(p => p.map(n => n.id === "n-transform" ? { ...n, status: "active" } : n));
        }
        if (prev === 85) {
          setNodes(p => p.map(n => n.id === "n-output" ? { ...n, status: "active" } : n));
          onModifyMetric("fps", 144);
        }

        return prev + 2.5;
      });
    }, 45);
  };

  // Add a new node to the workspace
  const handleAddCustomNode = (type: "transform" | "action" | "model") => {
    let label = "New Custom Node";
    let config: Record<string, string | number> = {};
    let inputs: string[] = ["input_data"];
    let outputs: string[] = ["output_data"];
    const id = `n-custom-${Date.now().toString().slice(-4)}`;

    switch (type) {
      case "transform":
        label = "Audio Frequency Filter";
        config = { cutoff: 440, resonance: 1.2 };
        inputs = ["raw_audio"];
        outputs = ["filtered_audio"];
        break;
      case "action":
        label = "Security Shield Guard";
        config = { policyEnforce: "Strict", encryption: "AES-256" };
        inputs = ["data_payload"];
        outputs = ["secured_payload"];
        break;
      case "model":
        label = "CODE-V3 Subcompiler";
        config = { optimizationLevel: "GPU-Heavy" };
        inputs = ["raw_logic"];
        outputs = ["compiled_binary"];
        break;
    }

    // Place it inside the bounds nicely
    const count = nodes.length;
    const x = 120 + (count % 3) * 180;
    const y = 200 + (count % 2) * 80;

    const newNode: LogicNode = {
      id,
      label,
      type,
      x,
      y,
      inputs,
      outputs,
      config,
      status: "idle",
    };

    setNodes(prev => [...prev, newNode]);

    // Create a link to the previous last node if applicable
    if (nodes.length > 0) {
      const prevNode = nodes[nodes.length - 1];
      const newEdge: LogicEdge = {
        id: `e-custom-${Date.now()}`,
        source: prevNode.id,
        target: id,
        sourceOutput: prevNode.outputs[0] || "output_data",
        targetInput: inputs[0] || "input_data"
      };
      setEdges(prev => [...prev, newEdge]);
    }

    onAddLog("SUCCESS", `Aura Visual created logical flow node: ${label}`);
  };

  // Reset node grid
  const handleResetGraph = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setSelectedNodeId("n-start");
    onAddLog("WARN", "Node logical map has been restored to factory state.");
  };

  const handleAiNodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    onAddLog("INFO", `Chronos Reasoning is evaluating logical nodes prompt: "${aiPrompt}"`);

    try {
      const systemInstruction = `
        You are APEX LUMA, a real-time system generator built for KNOCKSSTUDiOS.
        The user wants to generate code to model a specific logical system node.
        Recommend a single TypeScript configuration schema representing these nodes.
        Keep the response to 4 short bullet points outlining inputs, outputs, and parameters.
        No marketing text, no trademarks, only technical specifications.
      `;

      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `User query: "${aiPrompt}". Synthesize a node configuration schematic representing this structure.`,
          systemInstruction,
          modelName: "gemini-3.5-flash"
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      onAddLog("SUCCESS", "Vortex Code successfully designed prompt configuration structures.");
      // Inject a node representing what they asked for!
      const id = `n-ai-${Date.now().toString().slice(-4)}`;
      const newNode: LogicNode = {
        id,
        label: "AI Synthesis Component",
        type: "model",
        x: 400,
        y: 220,
        inputs: ["user_query"],
        outputs: ["generated_response"],
        config: { modelName: "Vortex-V3", confidence: "0.98", safetyGate: "Enabled" },
        status: "idle"
      };
      setNodes(prev => [...prev, newNode]);
      if (nodes.length > 0) {
        setEdges(prev => [...prev, {
          id: `e-ai-${Date.now()}`,
          source: nodes[0].id,
          target: id,
          sourceOutput: nodes[0].outputs[0] || "output",
          targetInput: "user_query"
        }]);
      }
      setAiPrompt("");
    } catch (err: any) {
      onAddLog("ERROR", `Failed node generation: ${err.message || err}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto font-sans">
      
      {/* Node Interactive Canvas Grid (7 Cols on desktop) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Canvas Controller Toolbar */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-cyan-400" />
            <span className="text-gray-300 font-bold uppercase tracking-wider">LOGIC THREAD CANVAS</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPulse}
              disabled={pulseActive}
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 border border-cyan-400/40 text-cyan-400 rounded hover:bg-cyan-400 hover:text-gray-950 transition duration-300 disabled:opacity-40"
            >
              <Play size={12} className={pulseActive ? "animate-pulse" : ""} />
              SIMULATE SIGNAL
            </button>

            <div className="h-4 w-[1px] bg-gray-800" />

            <button
              onClick={() => handleAddCustomNode("transform")}
              className="px-2 py-1 bg-gray-950 border border-gray-800 text-gray-400 rounded hover:text-white transition"
            >
              + Filter
            </button>
            <button
              onClick={() => handleAddCustomNode("action")}
              className="px-2 py-1 bg-gray-950 border border-gray-800 text-gray-400 rounded hover:text-white transition"
            >
              + Security
            </button>

            <button
              onClick={handleResetGraph}
              className="px-2 py-1 bg-gray-950 border border-gray-800 text-gray-500 rounded hover:text-red-400 transition ml-2"
              title="Reset workspace"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* Visual Node editor grid workspace */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl h-[400px] relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          {/* Subtle graph coordinates background */}
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />

          {/* SVG Connector Wires */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            {edges.map(edge => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              // Node dimensions approx 160 width, 100 height.
              // We compute relative ports
              const x1 = sourceNode.x + 160;
              const y1 = sourceNode.y + 40;
              const x2 = targetNode.x;
              const y2 = targetNode.y + 40;

              // Smooth cubic bezier line curve
              const controlDist = Math.abs(x2 - x1) * 0.45;
              const d = `M ${x1} ${y1} C ${x1 + controlDist} ${y1}, ${x2 - controlDist} ${y2}, ${x2} ${y2}`;

              return (
                <g key={edge.id}>
                  {/* Background wire border */}
                  <path 
                    d={d} 
                    fill="none" 
                    stroke="#1f2937" 
                    strokeWidth="3.5" 
                  />
                  {/* Colored main line */}
                  <path 
                    d={d} 
                    fill="none" 
                    stroke="url(#edgeGradient)" 
                    strokeWidth="1.5" 
                    className="opacity-75"
                  />
                  {/* Glowing dynamic pulse bubble */}
                  {pulseActive && (
                    <circle r="4" fill="#00F0FF" className="shadow-[0_0_10px_#00F0FF]">
                      <animateMotion dur="2.2s" repeatCount="indefinite" path={d} />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Draggable Node blocks */}
          {nodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`absolute w-[160px] rounded-xl border p-3 select-none cursor-pointer transition-all duration-300 z-10 ${
                  node.status === "active"
                    ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                    : isSelected
                    ? "bg-gray-900 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                    : "bg-gray-900/80 border-gray-800 hover:border-gray-700"
                }`}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
              >
                {/* Node Status Dot */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    node.type === "trigger" ? "bg-amber-950 text-amber-400 border border-amber-500/10" :
                    node.type === "model" ? "bg-purple-950 text-purple-400 border border-purple-500/10" :
                    node.type === "transform" ? "bg-cyan-950 text-cyan-400 border border-cyan-500/10" :
                    "bg-teal-950 text-teal-400 border border-teal-500/10"
                  }`}>
                    {node.type}
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full ${node.status === "active" ? "bg-cyan-400 animate-ping" : "bg-gray-600"}`} />
                </div>

                <div className="text-[11px] font-sans font-bold text-white tracking-wider truncate">
                  {node.label}
                </div>

                {/* Ports visualization */}
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-850/60 text-[9px] font-mono text-gray-500">
                  <div className="flex flex-col items-start gap-0.5">
                    {node.inputs.map((inp, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-cyan-400" />
                        {inp.slice(0, 5)}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col items-end gap-0.5 text-right">
                    {node.outputs.map((out, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {out.slice(0, 5)}
                        <span className="h-1 w-1 rounded-full bg-purple-400" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Logical Orchestrator Module */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <h4 className="text-xs font-mono text-white uppercase tracking-wider">REASON-V3 NODE MATRIX ARCHITECT</h4>
          </div>
          <form onSubmit={handleAiNodeSubmit} className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., 'Model a sound synthesizer connected to an audio envelope generator'"
              disabled={aiLoading}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/40"
            />
            <button
              type="submit"
              disabled={aiLoading || !aiPrompt.trim()}
              className="px-3 py-1.5 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs font-mono hover:bg-cyan-500 hover:text-gray-950 transition duration-300 flex items-center gap-1"
            >
              {aiLoading ? <Loader2 size={12} className="animate-spin text-cyan-400" /> : "GENERATE"}
            </button>
          </form>
        </div>

      </div>

      {/* Code Compiler and Node Inspector Panel (4 Cols on desktop) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Node Parameter Inspector */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3 border-b border-gray-850 pb-2">
            🔍 NODE INSPECTOR
          </div>
          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-gray-500 font-mono text-[10px]">NODE IDENTIFIER</span>
                <div className="text-white font-mono text-xs">{selectedNode.id}</div>
              </div>
              <div>
                <span className="text-gray-500 font-mono text-[10px]">LOGICAL NODE NAME</span>
                <div className="text-white font-semibold text-sm">{selectedNode.label}</div>
              </div>
              
              <div className="space-y-3">
                <span className="text-gray-400 font-mono text-[10px] uppercase block">NODE CONFIGURATION</span>
                {Object.entries(selectedNode.config).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-gray-950 px-3 py-2 rounded-lg border border-gray-850">
                    <span className="text-gray-500 font-mono tracking-wide">{key}</span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, config: { ...n.config, [key]: isNaN(Number(newVal)) ? newVal : Number(newVal) } } : n));
                        onAddLog("INFO", `Parameter updated on [${selectedNode.label}]: ${key} = ${newVal}`);
                      }}
                      className="text-right bg-transparent text-cyan-400 font-mono w-20 outline-none focus:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 font-mono py-8 text-center">
              Select a node in the graph grid to inspect and tune material shaders.
            </div>
          )}
        </div>

        {/* Live Synchronized Code Output */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3 border-b border-gray-850 pb-2">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
              <Code size={12} />
              VORTEX CORE COMPILER
            </span>
            <span className="text-[10px] font-mono text-gray-500">TypeScript Output</span>
          </div>

          <div className="relative">
            <pre className="text-[10px] font-mono text-cyan-400/80 bg-gray-950 p-4 rounded-xl border border-gray-850 overflow-x-auto h-[240px] whitespace-pre select-all leading-normal">
              <code>{customCode}</code>
            </pre>
            <div className="absolute top-2 right-2 bg-cyan-950/80 border border-cyan-500/10 px-1.5 py-0.5 rounded text-[8px] font-mono text-cyan-400 pointer-events-none">
              AUTO GEN
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
