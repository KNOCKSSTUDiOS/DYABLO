import React from "react";
import { Fingerprint, ShieldCheck, ShieldAlert, Cpu, Layers, RefreshCw } from "lucide-react";

interface IdentityCheckProps {
  identityStatus: "UNVERIFIED" | "VERIFYING" | "VERIFIED";
  identityData: {
    cores: number;
    colorDepth: number;
    language: string;
    hash: string;
    fingerprint: string;
    userAgent: string;
  } | null;
  onVerify: () => void;
}

export default function IdentityCheck({ identityStatus, identityData, onVerify }: IdentityCheckProps) {
  return (
    <div id="identity-check-panel" className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <div className="flex items-center gap-2 text-white font-bold tracking-wider">
          <Fingerprint size={16} className="text-cyan-400" />
          <span>DEVICE IDENTITY MATRIX</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
          identityStatus === "VERIFIED" 
            ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-400" 
            : identityStatus === "VERIFYING"
            ? "bg-cyan-950/40 border border-cyan-500/20 text-cyan-400"
            : "bg-red-950/40 border border-red-500/20 text-red-400"
        }`}>
          {identityStatus}
        </span>
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed">
        Verify system authenticity using non-spoofable high-performance browser rendering parameters, Canvas 2D image hashing, and CPU concurrency signatures.
      </p>

      {identityStatus === "VERIFIED" && identityData ? (
        <div className="bg-gray-950 border border-gray-850 p-3 rounded-lg space-y-2 text-[10px] animate-fade-in">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold border-b border-gray-900 pb-1.5 mb-1.5">
            <ShieldCheck size={14} />
            HARDWARE SECURE: IDENTIFIED
          </div>
          <div className="grid grid-cols-2 gap-2 text-gray-400">
            <div>
              <span className="text-gray-500">SIGNATURE CODE:</span>{" "}
              <span className="text-cyan-400 font-bold">{identityData.fingerprint}</span>
            </div>
            <div>
              <span className="text-gray-500">CORES DETECTED:</span>{" "}
              <span className="text-white">{identityData.cores} PROCESSORS</span>
            </div>
            <div>
              <span className="text-gray-500">COLOR DEPTH:</span>{" "}
              <span className="text-white">{identityData.colorDepth}-BIT TRUE COLOR</span>
            </div>
            <div>
              <span className="text-gray-500">SYSTEM LANGUAGE:</span>{" "}
              <span className="text-white">{identityData.language.toUpperCase()}</span>
            </div>
            <div className="col-span-2 border-t border-gray-900/60 pt-2 mt-1">
              <span className="text-purple-400 font-bold">LICENSED OPERATOR:</span>{" "}
              <span className="text-white">KNOCKSSTUDiOS</span>
            </div>
            <div className="col-span-2">
              <span className="text-purple-400 font-bold">VERIFIED EMAIL:</span>{" "}
              <span className="text-pink-400 font-mono">KNOCKSSTUDiOS@hollywoodimaging.studio</span>
            </div>
          </div>
          <div className="text-[9px] text-gray-500 truncate border-t border-gray-900 pt-1.5 mt-1.5">
            UA: {identityData.userAgent}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-950 border border-gray-850 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-amber-500" />
            <span className="text-gray-400 text-[10px]">NO VERIFIED SIGNATURE ON FILE</span>
          </div>
          
          <button
            id="btn-trigger-identity-verification"
            onClick={onVerify}
            disabled={identityStatus === "VERIFYING"}
            className="px-3 py-1.5 bg-cyan-950/40 hover:bg-cyan-500 hover:text-gray-950 text-cyan-400 border border-cyan-500/20 rounded font-bold uppercase transition duration-300 flex items-center gap-1.5 disabled:opacity-50"
          >
            {identityStatus === "VERIFYING" ? (
              <>
                <RefreshCw size={11} className="animate-spin" />
                SECURING...
              </>
            ) : (
              <>
                <Fingerprint size={12} />
                SECURE HARDWARE ID
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
