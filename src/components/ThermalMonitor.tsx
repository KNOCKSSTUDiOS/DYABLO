import React, { useEffect, useRef, useState, useId } from "react";
import * as d3 from "d3";
import { 
  Flame, 
  Zap, 
  Activity, 
  Gauge, 
  Cpu, 
  Play, 
  Pause, 
  RefreshCw, 
  AlertTriangle, 
  Sliders, 
  Wind, 
  Maximize2 
} from "lucide-react";

export interface ThermalDataPoint {
  time: number;
  coreTemp: number;     // Core temperature in °C
  hotspotTemp: number;  // Hotspot / Junction in °C
  vramTemp: number;     // VRAM Memory in °C
  powerWatts: number;   // Board power in Watts (e.g., 220W - 450W)
  voltage: number;      // Core Voltage in Volts (e.g., 0.95V - 1.15V)
  fanRpm: number;       // Fan speed in RPM
}

interface CoreSensor {
  id: string;
  name: string;
  temp: number;
  power: number;
  status: "NORMAL" | "WARM" | "HOT" | "CRITICAL";
}

interface ThermalMonitorProps {
  onAddLog?: (level: "INFO" | "WARN" | "SUCCESS" | "ERROR", message: string) => void;
  onModifyMetric?: (key: string, value: number) => void;
  className?: string;
}

export default function ThermalMonitor({ onAddLog, onModifyMetric, className = "" }: ThermalMonitorProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const gaugeRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Monitoring control states
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [activeMetricView, setActiveMetricView] = useState<"ALL" | "TEMP" | "POWER">("ALL");
  const [stressMode, setStressMode] = useState<boolean>(false);
  const [fanCurvePreset, setFanCurvePreset] = useState<"AUTO" | "AGGRESSIVE" | "SILENT">("AUTO");

  // Core telemetry series state
  const historyRef = useRef<ThermalDataPoint[]>([]);
  const [currentSample, setCurrentSample] = useState<ThermalDataPoint>({
    time: Date.now(),
    coreTemp: 58,
    hotspotTemp: 68,
    vramTemp: 64,
    powerWatts: 245,
    voltage: 1.02,
    fanRpm: 1850,
  });

  // Multi-core cluster distribution (8 GPGPU Streaming Multiprocessor clusters)
  const [coreSensors, setCoreSensors] = useState<CoreSensor[]>([
    { id: "sm-0", name: "SM Core 0", temp: 58, power: 32, status: "NORMAL" },
    { id: "sm-1", name: "SM Core 1", temp: 59, power: 34, status: "NORMAL" },
    { id: "sm-2", name: "SM Core 2", temp: 63, power: 38, status: "WARM" },
    { id: "sm-3", name: "SM Core 3", temp: 61, power: 35, status: "WARM" },
    { id: "sm-4", name: "SM Core 4", temp: 57, power: 30, status: "NORMAL" },
    { id: "sm-5", name: "SM Core 5", temp: 60, power: 33, status: "NORMAL" },
    { id: "sm-6", name: "SM Core 6", temp: 66, power: 41, status: "WARM" },
    { id: "sm-7", name: "SM Core 7", temp: 62, power: 36, status: "WARM" },
  ]);

  // Unique SVG IDs to avoid conflicts
  const idPrefix = useId().replace(/:/g, "");

  // Initialize baseline historical series
  useEffect(() => {
    const initialData: ThermalDataPoint[] = [];
    const now = Date.now();
    for (let i = 40; i >= 0; i--) {
      const t = now - i * 1000;
      const baseTemp = 55 + Math.sin(i * 0.2) * 5 + (Math.random() * 2 - 1);
      initialData.push({
        time: t,
        coreTemp: Math.round(baseTemp * 10) / 10,
        hotspotTemp: Math.round((baseTemp + 10 + Math.random() * 3) * 10) / 10,
        vramTemp: Math.round((baseTemp + 6 + Math.random() * 2) * 10) / 10,
        powerWatts: Math.round(230 + Math.sin(i * 0.15) * 25 + Math.random() * 15),
        voltage: Math.round((1.01 + Math.sin(i * 0.1) * 0.04) * 100) / 100,
        fanRpm: Math.round(1800 + Math.sin(i * 0.2) * 200),
      });
    }
    historyRef.current = initialData;
    setCurrentSample(initialData[initialData.length - 1]);
  }, []);

  // Real-time telemetry generator loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const prev = historyRef.current[historyRef.current.length - 1] || {
        coreTemp: 58,
        hotspotTemp: 68,
        vramTemp: 64,
        powerWatts: 245,
        voltage: 1.02,
        fanRpm: 1850,
      };

      // Base targets depend on stress mode and fan curve
      let targetCore = stressMode ? 78 : 58;
      let targetPower = stressMode ? 385 : 240;

      if (fanCurvePreset === "AGGRESSIVE") {
        targetCore -= 6;
      } else if (fanCurvePreset === "SILENT") {
        targetCore += 5;
      }

      // Smooth random walk towards target
      const coreDelta = (targetCore - prev.coreTemp) * 0.15 + (Math.random() * 3 - 1.5);
      const newCore = Math.max(35, Math.min(95, prev.coreTemp + coreDelta));
      const newHotspot = Math.max(newCore + 5, Math.min(108, newCore + 10 + (Math.random() * 3 - 1.5)));
      const newVram = Math.max(newCore + 2, Math.min(100, newCore + 6 + (Math.random() * 2 - 1)));

      const powerDelta = (targetPower - prev.powerWatts) * 0.2 + (Math.random() * 18 - 9);
      const newPower = Math.max(90, Math.min(450, Math.round(prev.powerWatts + powerDelta)));

      const newVoltage = Math.max(0.85, Math.min(1.25, Math.round((0.95 + (newPower / 450) * 0.2 + (Math.random() * 0.02 - 0.01)) * 100) / 100));

      let fanBase = fanCurvePreset === "AGGRESSIVE" ? 2400 : fanCurvePreset === "SILENT" ? 1200 : 1800;
      const newFanRpm = Math.round(fanBase + ((newCore - 50) / 40) * 1000 + (Math.random() * 50 - 25));

      const newPoint: ThermalDataPoint = {
        time: Date.now(),
        coreTemp: Math.round(newCore * 10) / 10,
        hotspotTemp: Math.round(newHotspot * 10) / 10,
        vramTemp: Math.round(newVram * 10) / 10,
        powerWatts: newPower,
        voltage: newVoltage,
        fanRpm: Math.max(800, Math.min(3200, newFanRpm)),
      };

      historyRef.current = [...historyRef.current.slice(-50), newPoint];
      setCurrentSample(newPoint);

      // Update individual core sensors
      setCoreSensors(prevSensors =>
        prevSensors.map((sensor, idx) => {
          const variance = Math.sin(Date.now() / 1000 + idx) * 3 + (Math.random() * 2 - 1);
          const coreT = Math.round((newCore + variance) * 10) / 10;
          const coreP = Math.round(((newPower / 8) + (variance * 0.8)) * 10) / 10;
          let status: "NORMAL" | "WARM" | "HOT" | "CRITICAL" = "NORMAL";
          if (coreT >= 84) status = "CRITICAL";
          else if (coreT >= 75) status = "HOT";
          else if (coreT >= 62) status = "WARM";

          return {
            ...sensor,
            temp: coreT,
            power: coreP,
            status,
          };
        })
      );

      // Trigger automatic log alert if thermals exceed thresholds
      if (newHotspot > 92 && onAddLog) {
        onAddLog("WARN", `Thermal Warning: GPU Hotspot junction exceeded threshold: ${Math.round(newHotspot)}°C! Fan throttling at ${newFanRpm} RPM`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, stressMode, fanCurvePreset, onAddLog]);

  // Convert Celsius to Display Unit
  const toDisplayTemp = (celsius: number) => {
    if (tempUnit === "F") {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius * 10) / 10;
  };

  // D3 Real-Time Multi-Metric Timeseries Chart Rendering
  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const data: ThermalDataPoint[] = historyRef.current;
    if (data.length < 2) return;

    const width = 640;
    const height = 190;
    const margin = { top: 16, right: 54, bottom: 26, left: 44 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define Gradients and Drop Shadows
    const defs = svg.append("defs");

    // Core Temp Gradient Fill
    const coreGrad = defs
      .append("linearGradient")
      .attr("id", `${idPrefix}-core-grad`)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    coreGrad.append("stop").attr("offset", "0%").attr("stop-color", "#00F0FF").attr("stop-opacity", 0.35);
    coreGrad.append("stop").attr("offset", "100%").attr("stop-color", "#00F0FF").attr("stop-opacity", 0.0);

    // Hotspot Temp Gradient Fill
    const hotGrad = defs
      .append("linearGradient")
      .attr("id", `${idPrefix}-hot-grad`)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    hotGrad.append("stop").attr("offset", "0%").attr("stop-color", "#F43F5E").attr("stop-opacity", 0.28);
    hotGrad.append("stop").attr("offset", "100%").attr("stop-color", "#F43F5E").attr("stop-opacity", 0.0);

    // Power Watts Gradient Fill
    const powerGrad = defs
      .append("linearGradient")
      .attr("id", `${idPrefix}-power-grad`)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    powerGrad.append("stop").attr("offset", "0%").attr("stop-color", "#A855F7").attr("stop-opacity", 0.3);
    powerGrad.append("stop").attr("offset", "100%").attr("stop-color", "#A855F7").attr("stop-opacity", 0.0);

    // Glow filter for highlighted lines
    const glowFilter = defs
      .append("filter")
      .attr("id", `${idPrefix}-chart-glow`)
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");
    glowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "blur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // X Scale (Time)
    const minTime = data[0]?.time ?? Date.now() - 50000;
    const maxTime = data[data.length - 1]?.time ?? Date.now();
    const xScale = d3.scaleLinear().domain([minTime, maxTime]).range([0, innerWidth]);

    // Y Scale Left (Temperature: 30°C to 110°C)
    const yScaleTemp = d3.scaleLinear().domain([30, 110]).range([innerHeight, 0]);

    // Y Scale Right (Power: 50W to 480W)
    const yScalePower = d3.scaleLinear().domain([50, 480]).range([innerHeight, 0]);

    // Background Grid lines
    const yGrid = d3.axisLeft(yScaleTemp).ticks(4).tickSize(-innerWidth).tickFormat(() => "");
    g.append("g")
      .attr("class", "grid")
      .call(yGrid)
      .selectAll("line")
      .attr("stroke", "rgba(255, 255, 255, 0.04)")
      .attr("stroke-dasharray", "3,3");
    g.selectAll(".grid .domain").remove();

    // Critical Thermal Threshold Line (85°C Warning)
    const thresholdY = yScaleTemp(85);
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", thresholdY)
      .attr("y2", thresholdY)
      .attr("stroke", "rgba(239, 68, 68, 0.35)")
      .attr("stroke-dasharray", "4,4")
      .attr("stroke-width", 1);

    g.append("text")
      .attr("x", 6)
      .attr("y", thresholdY - 4)
      .attr("fill", "rgba(239, 68, 68, 0.6)")
      .attr("font-size", "8px")
      .attr("font-family", "monospace")
      .text("CRITICAL THERMAL LIMIT (85°C)");

    // D3 Line & Area Generators
    const areaCore = d3
      .area<ThermalDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.time))
      .y0(innerHeight)
      .y1(d => yScaleTemp(d.coreTemp));

    const lineCore = d3
      .line<ThermalDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.time))
      .y(d => yScaleTemp(d.coreTemp));

    const lineHotspot = d3
      .line<ThermalDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.time))
      .y(d => yScaleTemp(d.hotspotTemp));

    const lineVram = d3
      .line<ThermalDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.time))
      .y(d => yScaleTemp(d.vramTemp));

    const areaPower = d3
      .area<ThermalDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.time))
      .y0(innerHeight)
      .y1(d => yScalePower(d.powerWatts));

    const linePower = d3
      .line<ThermalDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.time))
      .y(d => yScalePower(d.powerWatts));

    // Render Power Area & Line if Active
    if (activeMetricView === "ALL" || activeMetricView === "POWER") {
      g.append("path")
        .datum(data)
        .attr("fill", `url(#${idPrefix}-power-grad)`)
        .attr("d", areaPower);

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#A855F7")
        .attr("stroke-width", 2)
        .attr("filter", `url(#${idPrefix}-chart-glow)`)
        .attr("d", linePower);
    }

    // Render Temperature Areas & Lines if Active
    if (activeMetricView === "ALL" || activeMetricView === "TEMP") {
      // Core Area
      g.append("path")
        .datum(data)
        .attr("fill", `url(#${idPrefix}-core-grad)`)
        .attr("d", areaCore);

      // VRAM Line
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#10B981")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,2")
        .attr("d", lineVram);

      // Hotspot Line
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#F43F5E")
        .attr("stroke-width", 1.5)
        .attr("d", lineHotspot);

      // Core Line (Thickest)
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#00F0FF")
        .attr("stroke-width", 2.2)
        .attr("filter", `url(#${idPrefix}-chart-glow)`)
        .attr("d", lineCore);
    }

    // Latest Point Pulses
    const lastPoint = data[data.length - 1];
    if (lastPoint) {
      if (activeMetricView === "ALL" || activeMetricView === "TEMP") {
        g.append("circle")
          .attr("cx", xScale(lastPoint.time))
          .attr("cy", yScaleTemp(lastPoint.coreTemp))
          .attr("r", 4)
          .attr("fill", "#00F0FF")
          .attr("stroke", "#020813")
          .attr("stroke-width", 1.5);
      }

      if (activeMetricView === "ALL" || activeMetricView === "POWER") {
        g.append("circle")
          .attr("cx", xScale(lastPoint.time))
          .attr("cy", yScalePower(lastPoint.powerWatts))
          .attr("r", 4)
          .attr("fill", "#A855F7")
          .attr("stroke", "#020813")
          .attr("stroke-width", 1.5);
      }
    }

    // Left Axis (Temperature °C)
    const leftAxis = d3.axisLeft(yScaleTemp).ticks(4).tickFormat(d => `${d}°C`);
    const leftAxisGroup = g.append("g").attr("class", "axis axis-left").call(leftAxis);
    leftAxisGroup.selectAll("text").attr("fill", "#00F0FF").attr("font-size", "9px").attr("font-family", "monospace");
    leftAxisGroup.selectAll("line").attr("stroke", "#1E293B");
    leftAxisGroup.select(".domain").attr("stroke", "#1E293B");

    // Right Axis (Power Watts)
    const rightAxis = d3.axisRight(yScalePower).ticks(4).tickFormat(d => `${d}W`);
    const rightAxisGroup = g
      .append("g")
      .attr("class", "axis axis-right")
      .attr("transform", `translate(${innerWidth},0)`)
      .call(rightAxis);
    rightAxisGroup.selectAll("text").attr("fill", "#A855F7").attr("font-size", "9px").attr("font-family", "monospace");
    rightAxisGroup.selectAll("line").attr("stroke", "#1E293B");
    rightAxisGroup.select(".domain").attr("stroke", "#1E293B");

    // Bottom Axis (Relative Time in Seconds)
    const bottomAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => {
        const diffSeconds = Math.round((maxTime - Number(d)) / 1000);
        return diffSeconds === 0 ? "NOW" : `-${diffSeconds}s`;
      });
    const bottomAxisGroup = g
      .append("g")
      .attr("class", "axis axis-bottom")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(bottomAxis);
    bottomAxisGroup.selectAll("text").attr("fill", "#64748B").attr("font-size", "8px").attr("font-family", "monospace");
    bottomAxisGroup.selectAll("line").attr("stroke", "#1E293B");
    bottomAxisGroup.select(".domain").attr("stroke", "#1E293B");
    bottomAxisGroup.selectAll("text").attr("fill", "#64748B").attr("font-size", "8px").attr("font-family", "monospace");
    bottomAxisGroup.selectAll("line").attr("stroke", "#1E293B");
    bottomAxisGroup.select(".domain").attr("stroke", "#1E293B");
  }, [currentSample, activeMetricView, idPrefix]);

  // D3 Gauge / Radial Arc Rendering for Headroom & Load
  useEffect(() => {
    if (!gaugeRef.current) return;

    const svg = d3.select(gaugeRef.current);
    svg.selectAll("*").remove();

    const width = 160;
    const height = 110;
    const radius = 68;

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height - 10})`);

    const defs = svg.append("defs");
    const arcGrad = defs
      .append("linearGradient")
      .attr("id", `${idPrefix}-gauge-grad`)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    arcGrad.append("stop").attr("offset", "0%").attr("stop-color", "#00F0FF");
    arcGrad.append("stop").attr("offset", "60%").attr("stop-color", "#A855F7");
    arcGrad.append("stop").attr("offset", "100%").attr("stop-color", "#F43F5E");

    // Background Track Arc (-Math.PI / 2 to Math.PI / 2)
    const arcBackground = d3
      .arc()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)
      .cornerRadius(4);

    g.append("path")
      .attr("d", arcBackground as any)
      .attr("fill", "rgba(255, 255, 255, 0.06)");

    // Active Value Arc (0% to 100% mapped between 30°C and 100°C)
    const ratio = Math.max(0, Math.min(1, (currentSample.coreTemp - 30) / 70));
    const activeAngle = -Math.PI / 2 + ratio * Math.PI;

    const arcForeground = d3
      .arc()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(activeAngle)
      .cornerRadius(4);

    g.append("path")
      .attr("d", arcForeground as any)
      .attr("fill", `url(#${idPrefix}-gauge-grad)`);

    // Needle or Center Text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -14)
      .attr("fill", "#FFFFFF")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("font-family", "monospace")
      .text(`${toDisplayTemp(currentSample.coreTemp)}°${tempUnit}`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 2)
      .attr("fill", "#94A3B8")
      .attr("font-size", "8px")
      .attr("font-family", "monospace")
      .text(`CORE TEMP`);
  }, [currentSample, tempUnit, idPrefix]);

  const toggleStressTest = () => {
    const nextStress = !stressMode;
    setStressMode(nextStress);
    if (onAddLog) {
      if (nextStress) {
        onAddLog("WARN", "GPU Thermal Stress Mode ENGAGED: Artificial FP32 raytracing workload running (TGP target ~400W).");
      } else {
        onAddLog("INFO", "GPU Thermal Stress Mode DISENGAGED: Returning to balanced idle profile.");
      }
    }
  };

  return (
    <div 
      id="gpu-thermal-monitor-panel" 
      ref={containerRef}
      className={`bg-gray-900/70 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.05)] font-sans ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <Flame size={18} className="animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                GPGPU THERMAL & POWER D3 MONITOR
              </h3>
              <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                currentSample.coreTemp > 75 
                  ? "bg-rose-950/50 text-rose-400 border-rose-500/30 animate-pulse" 
                  : "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
              }`}>
                {currentSample.coreTemp > 75 ? "THERMAL ELEVATED" : "THERMAL NOMINAL"}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">
              Real-time D3.js vector engine · Multi-rail wattage & SM junction telemetry
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          {/* Pause / Resume Button */}
          <button
            id="btn-thermal-toggle-stream"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1 font-bold ${
              isRunning 
                ? "bg-gray-950 border-gray-800 text-gray-400 hover:text-white" 
                : "bg-amber-950/40 border-amber-500/30 text-amber-400 animate-pulse"
            }`}
            title={isRunning ? "Pause Telemetry Stream" : "Resume Telemetry Stream"}
          >
            {isRunning ? <Pause size={11} /> : <Play size={11} />}
            <span>{isRunning ? "LIVE STREAM" : "PAUSED"}</span>
          </button>

          {/* Metric View Filter Toggle */}
          <div className="flex bg-gray-950 border border-gray-800 rounded-lg p-0.5">
            {(["ALL", "TEMP", "POWER"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setActiveMetricView(mode)}
                className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition ${
                  activeMetricView === mode
                    ? "bg-cyan-950 border border-cyan-500/40 text-cyan-300"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Unit Toggle */}
          <button
            onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
            className="px-2 py-1 bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-300 rounded-lg font-bold"
          >
            °{tempUnit}
          </button>

          {/* Stress Test Mode Button */}
          <button
            id="btn-thermal-stress-test"
            onClick={toggleStressTest}
            className={`px-2.5 py-1.5 rounded-lg border font-bold transition flex items-center gap-1 ${
              stressMode 
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse" 
                : "bg-gray-950 border-gray-800 text-red-400 hover:border-red-500/40"
            }`}
          >
            <Zap size={11} />
            <span>{stressMode ? "STRESS ACTIVE" : "BURN-IN TEST"}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 font-mono">
        {/* Core Temp */}
        <div className="bg-gray-950/80 border border-gray-800/80 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[9px] text-gray-500">
            <span>GPU CORE</span>
            <Flame size={11} className="text-cyan-400" />
          </div>
          <div className="text-base font-bold text-cyan-400">
            {toDisplayTemp(currentSample.coreTemp)}°{tempUnit}
          </div>
          <div className="text-[8px] text-gray-500">Target: &lt; 72°C</div>
        </div>

        {/* Hotspot Temp */}
        <div className="bg-gray-950/80 border border-gray-800/80 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[9px] text-gray-500">
            <span>JUNCTION HOTSPOT</span>
            <AlertTriangle size={11} className="text-rose-400" />
          </div>
          <div className="text-base font-bold text-rose-400">
            {toDisplayTemp(currentSample.hotspotTemp)}°{tempUnit}
          </div>
          <div className="text-[8px] text-gray-500">Peak Delta: +{(currentSample.hotspotTemp - currentSample.coreTemp).toFixed(1)}°</div>
        </div>

        {/* VRAM Temp */}
        <div className="bg-gray-950/80 border border-gray-800/80 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[9px] text-gray-500">
            <span>VRAM IC TEMP</span>
            <Cpu size={11} className="text-emerald-400" />
          </div>
          <div className="text-base font-bold text-emerald-400">
            {toDisplayTemp(currentSample.vramTemp)}°{tempUnit}
          </div>
          <div className="text-[8px] text-gray-500">GDDR6X Array</div>
        </div>

        {/* Total Board Power */}
        <div className="bg-gray-950/80 border border-gray-800/80 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[9px] text-gray-500">
            <span>TGP BOARD POWER</span>
            <Zap size={11} className="text-purple-400" />
          </div>
          <div className="text-base font-bold text-purple-400">
            {currentSample.powerWatts} <span className="text-[10px] font-normal text-purple-300">W</span>
          </div>
          <div className="text-[8px] text-gray-500">Limit: 450W Max</div>
        </div>

        {/* Core Voltage */}
        <div className="bg-gray-950/80 border border-gray-800/80 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[9px] text-gray-500">
            <span>VDD CORE VOLTS</span>
            <Activity size={11} className="text-teal-400" />
          </div>
          <div className="text-base font-bold text-teal-400">
            {currentSample.voltage.toFixed(2)} <span className="text-[10px] font-normal text-teal-300">V</span>
          </div>
          <div className="text-[8px] text-gray-500">Rail: 12VHPWR</div>
        </div>

        {/* Fan Speed */}
        <div className="bg-gray-950/80 border border-gray-800/80 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[9px] text-gray-500">
            <span>COOLING FANS</span>
            <Wind size={11} className="text-sky-400 animate-spin" style={{ animationDuration: `${Math.max(0.6, 3 - (currentSample.fanRpm / 1500))}s` }} />
          </div>
          <div className="text-base font-bold text-sky-400">
            {currentSample.fanRpm} <span className="text-[10px] font-normal text-sky-300">RPM</span>
          </div>
          <div className="text-[8px] text-gray-500">Preset: {fanCurvePreset}</div>
        </div>
      </div>

      {/* Main D3 Vector Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Real-time D3 Timeseries Graph (8 cols) */}
        <div className="lg:col-span-8 bg-gray-950 border border-gray-800 rounded-xl p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between font-mono text-[9px] text-gray-400 border-b border-gray-900 pb-1.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF]" />
                CORE TEMP (°C)
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_6px_#F43F5E]" />
                HOTSPOT
              </span>
              <span className="flex items-center gap-1 text-purple-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_6px_#A855F7]" />
                TGP POWER (W)
              </span>
            </div>
            <span className="text-gray-600">D3.JS VECTOR STREAM (50 SAMPLES)</span>
          </div>

          {/* SVG Canvas for D3 */}
          <div className="w-full overflow-hidden">
            <svg 
              ref={chartRef} 
              viewBox="0 0 640 190" 
              className="w-full h-auto block select-none"
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[8px] text-gray-500 pt-1 border-t border-gray-900">
            <span>Interpolation: Monotone X Hermite Spline</span>
            <span>Hardware Polling Rate: 1000ms</span>
          </div>
        </div>

        {/* Radial Arc Gauge + Fan Profile Controls (4 cols) */}
        <div className="lg:col-span-4 bg-gray-950 border border-gray-800 rounded-xl p-3.5 flex flex-col justify-between space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-gray-900 pb-1.5 text-[10px] text-gray-400">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <Gauge size={12} />
              THERMAL HEADROOM
            </span>
            <span className="text-[9px] text-gray-500">T_JUNCTION MAX: 105°C</span>
          </div>

          {/* D3 Gauge SVG */}
          <div className="flex justify-center items-center py-1">
            <svg 
              ref={gaugeRef} 
              viewBox="0 0 160 110" 
              className="w-40 h-auto block"
            />
          </div>

          {/* Fan Acoustic Curve Tuning */}
          <div className="space-y-1.5 pt-1 border-t border-gray-900 text-[9px]">
            <div className="flex justify-between text-gray-400">
              <span>FAN ACOUSTIC PROFILE:</span>
              <span className="text-cyan-400 font-bold">{fanCurvePreset}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(["AUTO", "AGGRESSIVE", "SILENT"] as const).map(preset => (
                <button
                  key={preset}
                  onClick={() => {
                    setFanCurvePreset(preset);
                    if (onAddLog) {
                      onAddLog("INFO", `Cooling Fan profile updated to: ${preset}`);
                    }
                  }}
                  className={`py-1 rounded text-[8px] font-bold uppercase border transition ${
                    fanCurvePreset === preset
                      ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-400"
                      : "bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Streaming Multiprocessor (SM) Multi-Core Thermal Heatmap Strip */}
      <div className="bg-gray-950 border border-gray-800/80 rounded-xl p-3 space-y-2.5 font-mono text-[9px]">
        <div className="flex items-center justify-between text-gray-400 border-b border-gray-900 pb-1.5">
          <span className="flex items-center gap-1.5 text-white font-bold">
            <Cpu size={12} className="text-purple-400" />
            STREAMING MULTIPROCESSOR (SM) CORE THERMAL SENSORS & POWER DRAW
          </span>
          <span className="text-gray-500">8 GPC ARRAY SENSORS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {coreSensors.map(sensor => {
            let statusColor = "border-cyan-500/20 bg-cyan-950/15 text-cyan-400";
            let barColor = "bg-cyan-400";
            if (sensor.status === "WARM") {
              statusColor = "border-purple-500/20 bg-purple-950/15 text-purple-400";
              barColor = "bg-purple-400";
            } else if (sensor.status === "HOT" || sensor.status === "CRITICAL") {
              statusColor = "border-rose-500/30 bg-rose-950/20 text-rose-400";
              barColor = "bg-rose-400";
            }

            const fillPercent = Math.max(10, Math.min(100, ((sensor.temp - 40) / 50) * 100));

            return (
              <div 
                key={sensor.id} 
                className={`border rounded-lg p-2 space-y-1.5 transition-all duration-300 ${statusColor}`}
              >
                <div className="flex justify-between items-center text-[8px] font-bold">
                  <span>{sensor.name}</span>
                  <span>{sensor.status}</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {toDisplayTemp(sensor.temp)}°{tempUnit}
                </div>
                <div className="text-[8px] text-gray-400">
                  {sensor.power} W draw
                </div>
                {/* Visual heat fill bar */}
                <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${barColor} transition-all duration-500`} 
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
