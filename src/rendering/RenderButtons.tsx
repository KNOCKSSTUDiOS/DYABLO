import React from "react";
import { Zap, Trash2, Cpu, Sparkles, Download } from "lucide-react";

interface RenderButtonsProps {
  onRender: () => void;
  onClear: () => void;
  onDownload: () => void;
  isRendering?: boolean;
}

export default function RenderButtons({ onRender, onClear, onDownload, isRendering = false }: RenderButtonsProps) {
  return (
    <div id="render-buttons-panel" className="bg-gray-900/40 border border-gray-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[10px] text-gray-400 uppercase tracking-widest">GPGPU GRAPHICS CONTROL PORT:</span>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <button
          id="btn-trigger-render"
          onClick={onRender}
          disabled={isRendering}
          className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-bold rounded-lg text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 flex items-center justify-center gap-2"
        >
          {isRendering ? (
            <>
              <span className="h-3 w-3 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
              RENDERING CORE...
            </>
          ) : (
            <>
              <Zap size={14} fill="currentColor" />
              RENDER SCENE
            </>
          )}
        </button>

        <button
          id="btn-download-workspace"
          onClick={onDownload}
          className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] active:scale-95 flex items-center justify-center gap-2"
        >
          <Download size={14} />
          DOWNLOAD BUNDLE
        </button>

        <button
          id="btn-clear-frame"
          onClick={onClear}
          className="flex-1 sm:flex-initial px-4 py-2 bg-gray-950 border border-gray-800 hover:border-red-500/40 hover:text-red-400 text-gray-400 font-semibold rounded-lg text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          CLEAR FRAME
        </button>
      </div>
    </div>
  );
}
