import { FirstPartyModel, LogicNode, LogicEdge, MetricSnapshot } from "./types";

export const FIRST_PARTY_MODELS: FirstPartyModel[] = [
  {
    id: "m-reason",
    name: "LUMA Synthesis Reasoner",
    codename: "REASON-V3-ORCHESTRATOR",
    description: "Multi-layered cognitive planner that handles high-level application architecture, database topology layout, and multi-step logic pathways.",
    parameters: "135B Active",
    purpose: "Logic Orchestration & Flow Verification",
    status: "Online",
    accentColor: "from-cyan-500 to-teal-500",
  },
  {
    id: "m-code",
    name: "LUMA Codex Generator",
    codename: "CODE-V3-SYNTHESIZER",
    description: "Ultra-fast low-level compiler. Synthesizes fully optimized system code, handles native asset pipelines, and generates secure microservice schemas.",
    parameters: "85B Active",
    purpose: "Code Refactoring & Dynamic Compilation",
    status: "Online",
    accentColor: "from-purple-500 to-indigo-500",
  },
  {
    id: "m-visual",
    name: "LUMA Visual Composer",
    codename: "VISUAL-V3-RAYTRACE",
    description: "PBR Material engine & UI generator. Controls fluid visual state hierarchies, 3D viewport illumination maps, and cinematic transition flows.",
    parameters: "105B Active",
    purpose: "Real-Time 2D/3D Rendering & UI Design",
    status: "Online",
    accentColor: "from-pink-500 to-rose-500",
  },
  {
    id: "m-simulation",
    name: "LUMA Flow Emulator",
    codename: "SIMULATE-V3-WARP",
    description: "Stress-testing agent. Simulates virtual user concurrency, models network degradation spikes, and predicts logic loop memory leaks.",
    parameters: "45B Active",
    purpose: "Simulations, Error Correction & Hardening",
    status: "Standby",
    accentColor: "from-emerald-500 to-green-500",
  }
];

export const INITIAL_NODES: LogicNode[] = [
  {
    id: "n-start",
    label: "On Motion Trigger",
    type: "trigger",
    x: 80,
    y: 120,
    inputs: [],
    outputs: ["triggered_at", "velocity"],
    config: { sensitivity: 85 },
    status: "active",
  },
  {
    id: "n-reasoner",
    label: "REASON-V3 Agent Core",
    type: "model",
    x: 280,
    y: 80,
    inputs: ["trigger_signal", "payload"],
    outputs: ["cognitive_map", "confidence"],
    config: { depth: 10, confidenceThreshold: 0.92 },
    status: "idle",
  },
  {
    id: "n-transform",
    label: "PBR Material Matrix",
    type: "transform",
    x: 500,
    y: 180,
    inputs: ["cognitive_map", "mesh_data"],
    outputs: ["rendered_texture_map", "draw_duration"],
    config: { roughness: 0.12, metalness: 0.95 },
    status: "idle",
  },
  {
    id: "n-output",
    label: "Quantum Teal Viewport",
    type: "output",
    x: 740,
    y: 150,
    inputs: ["rendered_texture_map", "illumination_data"],
    outputs: [],
    config: { resolution: "2K", frames: 60 },
    status: "active",
  }
];

export const INITIAL_EDGES: LogicEdge[] = [
  {
    id: "e1",
    source: "n-start",
    target: "n-reasoner",
    sourceOutput: "triggered_at",
    targetInput: "trigger_signal",
  },
  {
    id: "e2",
    source: "n-reasoner",
    target: "n-transform",
    sourceOutput: "cognitive_map",
    targetInput: "cognitive_map",
  },
  {
    id: "e3",
    source: "n-transform",
    target: "n-output",
    sourceOutput: "rendered_texture_map",
    targetInput: "rendered_texture_map",
  }
];

export const INITIAL_METRICS: MetricSnapshot = {
  fps: 120,
  gpuMemoryUsed: 6144,
  gpuMemoryMax: 16384,
  latency: 18,
  queriesPerSec: 1450,
  uptime: 345600,
};

export const INITIAL_LOGS = [
  { id: "1", timestamp: "10:01:04", level: "INFO", message: "APEX LUMA engine warm booted successfully on Snapdragon Gen 8 Platform." },
  { id: "2", timestamp: "10:01:05", level: "INFO", message: "V3 Model garden mounted: REASON-V3, CODE-V3, and VISUAL-V3 are online." },
  { id: "3", timestamp: "10:01:06", level: "SUCCESS", message: "PBR raytracing core initial state matched to host hardware. Vertex cache cleared." },
  { id: "4", timestamp: "10:02:15", level: "INFO", message: "Dynamic orchestration loop established. Core pipeline latency verified at 18ms." },
  { id: "5", timestamp: "10:05:40", level: "WARN", message: "SIMULATE-V3-WARP is operating in eco mode due to background visual compilation." }
];

export const AUDIO_SYNTHS = [
  { id: "s-pad", name: "Deep Space Quantum Pad", frequency: 110, volume: 0.6, type: "sawtooth" as OscillatorType, active: false, waveColor: "text-cyan-400" },
  { id: "s-neon", name: "Neon Teal Laser Pulse", frequency: 220, volume: 0.5, type: "triangle" as OscillatorType, active: false, waveColor: "text-teal-400" },
  { id: "s-engine", name: "Core Reactor LFO Drone", frequency: 55, volume: 0.7, type: "sine" as OscillatorType, active: false, waveColor: "text-purple-400" },
  { id: "s-bell", name: "Celestial Crystal Bell", frequency: 440, volume: 0.4, type: "sine" as OscillatorType, active: false, waveColor: "text-pink-400" },
];
