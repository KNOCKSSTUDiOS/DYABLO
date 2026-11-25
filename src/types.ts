export interface LogicNode {
  id: string;
  label: string;
  type: "trigger" | "action" | "transform" | "output" | "model";
  x: number;
  y: number;
  inputs: string[];
  outputs: string[];
  config: Record<string, string | number>;
  status: "idle" | "active" | "error";
}

export interface LogicEdge {
  id: string;
  source: string;
  target: string;
  sourceOutput: string;
  targetInput: string;
}

export interface MetricSnapshot {
  fps: number;
  gpuMemoryUsed: number; // in MB
  gpuMemoryMax: number;  // in MB
  latency: number;       // in ms
  queriesPerSec: number;
  uptime: number;        // in seconds
}

export interface DeployLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
  message: string;
}

export interface FirstPartyModel {
  id: string;
  name: string;
  codename: string;
  description: string;
  parameters: string;
  purpose: string;
  status: "Online" | "Standby" | "Calibrating";
  accentColor: string;
}

export type ActiveMode = "DESIGN" | "LOGIC" | "MUSIC" | "DEPLOY" | "MODEL_GARDEN" | "SPECS";
