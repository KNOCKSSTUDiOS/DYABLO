import React from "react";
import { X, FolderArchive, Github, Settings, Download, ExternalLink, HelpCircle } from "lucide-react";

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadConfig: () => void;
}

export default function DownloadAppModal({ isOpen, onClose, onDownloadConfig }: DownloadAppModalProps) {
  if (!isOpen) return null;

  return (
    <div id="download-app-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div id="download-app-modal-content" className="relative w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-950 p-6 font-mono text-xs shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-gray-500 hover:bg-gray-900 hover:text-white transition"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-4">
          <div className="h-10 w-10 rounded-lg bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Download size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Download & Export Application</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Choose your preferred export/download methodology</p>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Method 1: Export to ZIP (Native Platform Tool) */}
          <div className="rounded-xl border border-cyan-500/15 bg-cyan-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white font-bold">
                <FolderArchive size={16} className="text-cyan-400" />
                1. DOWNLOAD SOURCE AS ZIP
              </span>
              <span className="px-2 py-0.5 rounded text-[8px] bg-cyan-900/40 text-cyan-300 font-bold border border-cyan-500/20 uppercase">
                RECOMMENDED
              </span>
            </div>
            
            <p className="text-gray-300 leading-relaxed text-[11px] font-sans">
              You can download the entire, fully compiled React & Tailwind source code bundle as a ZIP file right from the AI Studio Workspace:
            </p>

            <div className="bg-gray-950 border border-gray-900 rounded-lg p-3 space-y-2 text-[10px] text-gray-400">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">STEP 1:</span>
                <span>Look at the top-right corner of Google AI Studio.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">STEP 2:</span>
                <span>Click the <strong className="text-white">"Settings"</strong> menu (cog icon) or the <strong className="text-white">"Export"</strong> action bar.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">STEP 3:</span>
                <span>Select <strong className="text-cyan-300">"Export to ZIP"</strong> to instantly download your ready-to-run package!</span>
              </div>
            </div>
          </div>

          {/* Method 2: Export to GitHub (Platform integration) */}
          <div className="rounded-xl border border-gray-850 bg-gray-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white font-bold">
                <Github size={16} className="text-purple-400" />
                2. EXPORT TO GITHUB
              </span>
              <span className="px-2 py-0.5 rounded text-[8px] bg-purple-950/40 text-purple-300 border border-purple-500/20 font-bold uppercase">
                INTEGRATION
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed text-[11px] font-sans">
              Want to publish your repository or host it immediately? You can export directly to your GitHub accounts:
            </p>

            <div className="bg-gray-950 border border-gray-900 rounded-lg p-3 space-y-2 text-[10px] text-gray-400">
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">ACTION:</span>
                <span>Open Settings in the top-right menu and link your GitHub account to create a repository automatically.</span>
              </div>
            </div>
          </div>

          {/* Method 3: Download Local State/Telemetry (One-click) */}
          <div className="rounded-xl border border-gray-850 bg-gray-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white font-bold">
                <Settings size={16} className="text-pink-400" />
                3. DOWNLOAD WORKSPACE CONFIG
              </span>
              <span className="px-2 py-0.5 rounded text-[8px] bg-pink-950/40 text-pink-300 border border-pink-500/20 font-bold uppercase">
                SESSION
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed text-[11px] font-sans">
              Download your current active GPGPU parameters, shader engines, active system diagnostics, and operator logs:
            </p>

            <button
              id="btn-modal-dl-config"
              onClick={() => {
                onDownloadConfig();
                onClose();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-lg text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(219,39,119,0.3)] hover:shadow-[0_0_25px_rgba(219,39,119,0.5)] active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Download size={13} />
              DOWNLOAD WORKSPACE JSON
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-gray-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-300 rounded-lg text-xs font-bold uppercase transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
