import { Shield, Cpu, Layers, Terminal, Sparkles, Check, Bookmark, HeartCrack } from "lucide-react";

export default function SpecsDocs() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 font-sans space-y-8">
      
      {/* Header Deck */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-950/50 border border-cyan-500/20 rounded-md text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3">
              CLOUD FABRICATOR • Architectural Map
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest font-sans uppercase">
              APEX LUMA SPECIFICATION PROFILE
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Official system blueprints detailing the real-time, GPU-grade, zero-sandbox engine designed exclusively for KNOCKSSTUDiOS operational clusters.
            </p>
          </div>
          <div className="text-xs font-mono text-gray-500 bg-gray-950 px-3 py-2 border border-gray-850 rounded-lg shrink-0">
            <div>DOC ID: LUMA-V3-SPEC</div>
            <div>STATUS: CONFIDENTIAL</div>
            <div>VER: 3.12-RELEASE</div>
          </div>
        </div>
      </div>

      {/* Bento Blueprint Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Core Engine Layers */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu size={16} />
            <h3 className="text-xs font-mono tracking-widest uppercase font-semibold text-white">
              CORE ENGINE LAYERS
            </h3>
          </div>
          
          <p className="text-xs text-gray-400 leading-relaxed">
            APEX LUMA is divided into 4 tightly-coupled native execution modules, bypassing typical sandbox degradation constraints:
          </p>

          <div className="space-y-3 font-mono text-[10px]">
            <div className="bg-gray-950 border border-gray-850 p-2.5 rounded-lg">
              <span className="text-cyan-400 font-bold block mb-0.5">1. GPU RENDERING MODULE</span>
              <span className="text-gray-500 font-sans text-[11px] block leading-normal">
                Direct hardware shader compile targeting Snapdragon GPU and high-fidelity 2D/3D visual output.
              </span>
            </div>
            <div className="bg-gray-950 border border-gray-850 p-2.5 rounded-lg">
              <span className="text-purple-400 font-bold block mb-0.5">2. ORCHESTRATION PIPELINE</span>
              <span className="text-gray-500 font-sans text-[11px] block leading-normal">
                Mediates task threads between model garden cores (Chronos, Vortex, Aura) with low latency.
              </span>
            </div>
            <div className="bg-gray-950 border border-gray-850 p-2.5 rounded-lg">
              <span className="text-teal-400 font-bold block mb-0.5">3. ZERO-SANDBOX ISOLATION</span>
              <span className="text-gray-500 font-sans text-[11px] block leading-normal">
                Strict operating-system-level process containment providing native performance without security risk.
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Model Garden Topology */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles size={16} />
            <h3 className="text-xs font-mono tracking-widest uppercase font-semibold text-white">
              MODEL GARDEN TOPOLOGY
            </h3>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Our first-party LLM models act as self-contained specialist modules, avoiding latency loops of generic external models:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white font-mono block">Chronos Reasoning (Reasoner)</span>
                <span className="text-gray-500 text-[11px]">Compiles multi-step cognitive plans and verifies data structures.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white font-mono block">Vortex Code (Codex)</span>
                <span className="text-gray-500 text-[11px]">Generates complete low-level TypeScript scripts, optimizing loops automatically.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white font-mono block">Aura Visual (Materials)</span>
                <span className="text-gray-500 text-[11px]">Computes lighting parameters, material reflectivity, and component hierarchies.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white font-mono block">Specter Simulation (Emulator)</span>
                <span className="text-gray-500 text-[11px]">Tests execution nodes, measures memory overhead, and applies repairs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Non-Sandbox Protection Layers */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-teal-400">
            <Shield size={16} />
            <h3 className="text-xs font-mono tracking-widest uppercase font-semibold text-white">
              NON-SANDBOX PROTECTIONS
            </h3>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            APEX LUMA targets raw hardware execution. To protect host infrastructure, we enforce three distinct defense rings:
          </p>

          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex items-center justify-between p-2.5 bg-gray-950 border border-gray-850 rounded-lg">
              <span className="text-gray-400">RING-0: KERNEL ISOLATION</span>
              <span className="text-teal-400 font-semibold uppercase">Enforced</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-950 border border-gray-850 rounded-lg">
              <span className="text-gray-400">RING-1: MEMORY ROW GUARD</span>
              <span className="text-teal-400 font-semibold uppercase">Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-950 border border-gray-850 rounded-lg">
              <span className="text-gray-400">RING-2: SHADER BLOCK POLICY</span>
              <span className="text-teal-400 font-semibold uppercase">Standard</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-950 border border-gray-850 rounded-lg">
              <span className="text-gray-400">RING-3: DYNAMIC RBAC SECURE</span>
              <span className="text-teal-400 font-semibold uppercase">Enabled</span>
            </div>
          </div>
        </div>

      </div>

      {/* Deep-dive Technical Section */}
      <div className="bg-gray-900/20 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
          <Terminal size={14} />
          ARCHITECTURAL MEMORANDUM FROM CLOUD FABRICATOR
        </h3>
        
        <p className="text-xs text-gray-400 leading-relaxed space-y-2">
          APEX LUMA is more than a compiler; it is an integrated graphics-and-logic fabric. By mapping visual node hierarchies (<code className="text-cyan-400 font-mono text-[11px]">LogicMode</code>) directly onto highly accelerated shader matrices (<code className="text-cyan-400 font-mono text-[11px]">DesignMode</code>), APEX LUMA bypasses traditional interpreter overheads. Audio compilation utilizes the hardware's native PCM AudioPort pipeline, solving external SDK bottlenecks completely. 
        </p>

        <p className="text-xs text-gray-400 leading-relaxed">
          Through the embedded **Self-Healing Loop**, the orchestration core continuously monitors latency fluctuations and memory leaks. In the event of a cluster failure, APEX LUMA triggers an immediate micro-rollback, keeping live user sessions operational with zero latency degradation. This architecture has been designed from the ground up to establish the absolute peak of real-time application development.
        </p>
      </div>

    </div>
  );
}
