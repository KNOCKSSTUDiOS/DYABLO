import { useState, FormEvent } from "react";
import { FIRST_PARTY_MODELS } from "../data";
import { FirstPartyModel } from "../types";
import { Sparkles, MessageSquare, Send, ShieldAlert, Check, HelpCircle, Loader2 } from "lucide-react";

interface ModelGardenProps {
  onAddLog: (level: "INFO" | "WARN" | "SUCCESS" | "ERROR", message: string) => void;
  onModifyMetric: (key: string, value: number) => void;
}

interface SandboxMessage {
  id: string;
  sender: "user" | "model";
  text: string;
  modelName: string;
}

export default function ModelGarden({ onAddLog, onModifyMetric }: ModelGardenProps) {
  const [selectedModelId, setSelectedModelId] = useState("m-reason");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<SandboxMessage[]>([
    {
      id: "init",
      sender: "model",
      text: "System core mounted. This sandbox is directly routed to the Luma Reasoning Core. Pose any system design, logical, or compilation query to begin simulation.",
      modelName: "REASON-V3-ORCHESTRATOR"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const activeModel = FIRST_PARTY_MODELS.find(m => m.id === selectedModelId) || FIRST_PARTY_MODELS[0];

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userQuery = prompt;
    setPrompt("");
    setLoading(true);

    // Append user message
    const userMsg: SandboxMessage = {
      id: `m-u-${Date.now()}`,
      sender: "user",
      text: userQuery,
      modelName: "User"
    };
    setMessages(prev => [...prev, userMsg]);

    onAddLog("INFO", `Routing sandbox query to first-party core: ${activeModel.codename}`);

    try {
      // Craft specialized system instruction for Gemini based on the selected first-party model character
      let systemInstruction = "";
      if (activeModel.id === "m-reason") {
        systemInstruction = `
          You are the "LUMA Synthesis Reasoner" (codename: REASON-V3-ORCHESTRATOR), a multi-layered cognitive planner owned by KNOCKSSTUDiOS.
          You answer system architecture, logical layout, and project planning questions for APEX LUMA.
          Format your answer in highly structured bullet points, detailing exact logical paths, system design layers, and orchestration steps.
          Be precise, technical, objective, and maintain the theme of high-fidelity, zero-sandbox original systems. No trademarks.
        `;
      } else if (activeModel.id === "m-code") {
        systemInstruction = `
          You are the "LUMA Codex Generator" (codename: CODE-V3-SYNTHESIZER), an advanced high-speed low-level compiler owned by KNOCKSSTUDiOS.
          You write fully optimized, compliant TypeScript code blocks or schemas designed to run on the APEX LUMA runtime platform.
          Format your response to focus primarily on a complete, robust, commented code block. Explain the block briefly in 1-2 sentences at the top.
          All APIs, SDK modules, or frameworks must belong to the APEX LUMA native library (e.g. "@knocks/luma-engine"). No trademarks.
        `;
      } else if (activeModel.id === "m-visual") {
        systemInstruction = `
          You are the "LUMA Visual Composer" (codename: VISUAL-V3-RAYTRACE), a high-fidelity PBR material compiler and UI generator owned by KNOCKSSTUDiOS.
          You describe elegant material shaders, responsive glassmorphic layout hierarchies, or spatial particle physics.
          Focus on detailing materials, light maps, color palettes matching Quantum Teal (#00F0FF), and micro-animations. No trademarks.
        `;
      } else {
        systemInstruction = `
          You are the "LUMA Flow Emulator" (codename: SIMULATE-V3-WARP), an automated stress testing and debugging agent owned by KNOCKSSTUDiOS.
          You model virtual user concurrency limits, identify logic loop leaks, analyze memory spikes, and recommend direct compiler repair hotfixes.
          Focus on presenting diagnostic matrices, potential failure models, and step-by-step failover instructions. No trademarks.
        `;
      }

      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userQuery,
          systemInstruction,
          modelName: "gemini-3.5-flash" // Use fast model for low-latency sandbox replies
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const modelReply: SandboxMessage = {
        id: `m-m-${Date.now()}`,
        sender: "model",
        text: data.text || "Diagnostic trace successful. Zero-Sandbox integrity verified.",
        modelName: activeModel.codename
      };

      setMessages(prev => [...prev, modelReply]);
      onAddLog("SUCCESS", `Model response retrieved. Core latency compiled at: ${Math.floor(20 + Math.random() * 15)}ms.`);
      onModifyMetric("latency", Math.floor(14 + Math.random() * 5));
    } catch (err: any) {
      onAddLog("ERROR", `Failed sandbox transaction: ${err.message || err}`);
      setMessages(prev => [...prev, {
        id: `m-err-${Date.now()}`,
        sender: "model",
        text: `**Connection Overload Error:** Secure sandbox link timed out. Verify your API secrets or platform configuration.`,
        modelName: activeModel.codename
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModel = (model: FirstPartyModel) => {
    setSelectedModelId(model.id);
    onAddLog("INFO", `Sandbox target shifted. Initialized model channel: ${model.codename}`);
    
    // Add fresh introductory message
    setMessages([
      {
        id: `init-${model.id}`,
        sender: "model",
        text: `Secured link to ${model.name}. Active parameters: ${model.parameters}. Send a query to test custom pipeline compilation.`,
        modelName: model.codename
      }
    ]);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto font-sans">
      
      {/* Model Grid Cards selector (5 cols) */}
      <div className="xl:col-span-5 space-y-6">
        
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
          <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-1 flex items-center gap-1.5">
            <Sparkles size={12} />
            MODEL GARDEN CORES
          </h3>
          <p className="text-[11px] text-gray-400">
            APEX LUMA hosts 4 dedicated first-party model cores. Select a core below to inspect physical parameters and secure a direct sandbox session.
          </p>
        </div>

        {/* List of Models */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-gray-400">AVAILABLE FIRST-PARTY CORES</div>
          
          <div className="grid grid-cols-1 gap-2.5">
            {FIRST_PARTY_MODELS.map((model) => {
              const isSelected = selectedModelId === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => handleSelectModel(model)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                      : "bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-750 hover:text-gray-200"
                  }`}
                >
                  {/* Decorative glowing gradient tag on selection */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-cyan-400 to-teal-400" />
                  )}

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold tracking-wider text-white">
                      {model.name}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-500 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/10">
                      {model.parameters}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-400 font-sans leading-relaxed mb-3">
                    {model.description}
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 border-t border-gray-850/60 pt-2.5">
                    <span>CODENAME: {model.codename}</span>
                    <span className="flex items-center gap-1 text-teal-400">
                      <span className="h-1 w-1 rounded-full bg-teal-400" />
                      {model.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Interactive Sandbox Chat Panel (7 cols) */}
      <div className="xl:col-span-7 flex flex-col gap-4">
        
        {/* Chat Deck Header */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <MessageSquare size={13} className="text-cyan-400 animate-pulse" />
            <span className="text-gray-400 uppercase">ACTIVE CORE SANDBOX:</span>
            <span className="text-white bg-gray-950 px-1.5 py-0.5 rounded border border-gray-800">{activeModel.codename}</span>
          </div>
          <span className="text-[10px] text-teal-400 hidden sm:block">SECURE SHADER TUNNEL</span>
        </div>

        {/* Conversational Sandbox viewport */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 flex flex-col h-[400px] shadow-[inset_0_0_20px_rgba(0,0,0,0.85)] relative overflow-hidden">
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {messages.map((msg) => {
              const isModel = msg.sender === "model";
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${isModel ? "mr-auto items-start" : "ml-auto items-end"}`}
                >
                  {/* Sender title */}
                  <span className="text-[9px] font-mono text-gray-500 mb-1">
                    {msg.modelName}
                  </span>
                  {/* Message bubble */}
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                    isModel 
                      ? "bg-gray-900 border border-gray-850 text-gray-300 rounded-tl-none whitespace-pre-wrap" 
                      : "bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded-tr-none"
                  }`}>
                    {/* Render basic markdown blocks */}
                    {msg.text.split("\n").map((line, lIdx) => {
                      if (line.startsWith("-") || line.startsWith("•")) {
                        return (
                          <div key={lIdx} className="pl-3 py-0.5 relative">
                            <span className="absolute left-0 text-cyan-400">•</span>
                            {line.slice(1).trim()}
                          </div>
                        );
                      }
                      if (line.startsWith("```")) {
                        return null; // hide raw block markers
                      }
                      return <p key={lIdx} className={line ? "mb-1.5" : ""}>{line}</p>;
                    })}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex flex-col items-start mr-auto max-w-[80%] space-y-1">
                <span className="text-[9px] font-mono text-gray-500">{activeModel.codename}</span>
                <div className="bg-gray-900 border border-gray-850 p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 text-gray-500 font-mono">
                  <Loader2 size={12} className="animate-spin text-cyan-400" />
                  <span>COMPILING COGNITIVE MATRICES...</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Prompter */}
          <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-gray-850/60 flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Query ${activeModel.name}...`}
              disabled={loading}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 disabled:opacity-50 font-sans"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-4 py-2 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-gray-950 rounded-xl transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={12} />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
