import React, { useEffect, useState } from "react";
import {
  Sparkles, Search, Activity, FileText, Database,
  CheckCircle2, RefreshCw, AlertCircle
} from "lucide-react";

interface ScanProgressProps {
  marketplace: string;
}

export default function ScanProgress({ marketplace }: ScanProgressProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const intervals = [1200, 2400, 3600, 4800, 6000];
    const timers = intervals.map((time, idx) => setTimeout(() => setStage(idx + 1), time));
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const agents = [
    { id: 1, name: "Agent 1: Advanced Multimodal Scanner",     desc: "Sees characters, shapes, and trademark coordinates...",         doneDesc: "Scanned visual features. Found shape correlations.",      icon: <Sparkles className="w-5 h-5" /> },
    { id: 2, name: "Agent 2: Global Database Index Solver",    desc: "Reverse-searching image across 10B indexed listings...",       doneDesc: "Completed web index cross-match search.",                 icon: <Search   className="w-5 h-5" /> },
    { id: 3, name: "Agent 3: Blur Detective (Forensics)",      desc: "Checking grayscale Laplacian std-dev and Fourier bands...",    doneDesc: "Zone analysis finished. Obfuscation metrics updated.",   icon: <Activity className="w-5 h-5" /> },
    { id: 4, name: "Agent 4: Text Lexicon Decoder",            desc: "Fuzzy-matching titles and synonym soundex codes...",           doneDesc: "Spelling and synonym checks completed.",                  icon: <FileText className="w-5 h-5" /> },
    { id: 5, name: "Agent 5: Probabilistic Fusion Engine",     desc: "Cross-matching visual findings against text proxy triggers...", doneDesc: "Fused parallel agents. Finished risk weighting.",       icon: <Database className="w-5 h-5" /> }
  ];

  const progressPct = Math.round((stage / 5) * 100);

  const getTickerMsg = () => {
    if (stage === 0) return "Initializing parallel sandbox containers...";
    if (stage === 1) return "Agent 1 analyzing pixel character vectors...";
    if (stage === 2) return "Agent 2 loading corporate copyright catalogs...";
    if (stage === 3) return "Agent 3 checking if pixels contain anti-detection layers...";
    if (stage === 4) return "Agent 4 decomposing Soundex phonetics for brand tags...";
    return "Fusing decisions through probabilistic weights...";
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white border border-gray-200 rounded-3xl text-gray-900 shadow-lg space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-space font-extrabold tracking-tight text-gray-900">
          SCANNING FOR INTELLECTUAL PROPERTY RISKS
        </h3>
        <p className="text-xs text-gray-500 font-sans">
          Performing 8-second parallel fusions for {marketplace} Pre-Publication safety.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-brand-green font-bold">Progress Rate</span>
          <span className="text-[#2cff05] font-bold">{progressPct}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Agents List */}
      <div className="space-y-3">
        {agents.map((agent) => {
          const isDone = stage >= agent.id;
          const isCurrent = stage + 1 === agent.id;

          return (
            <div
              key={agent.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                isDone
                  ? "bg-blue-50 border-blue-200 text-gray-900"
                  : isCurrent
                  ? "bg-green-50 border-green-200 text-gray-900"
                  : "bg-transparent border-gray-100 text-gray-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isDone
                    ? "bg-blue-100 text-[#2cff05]"
                    : isCurrent
                    ? "bg-green-100 text-brand-green animate-spin"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {agent.icon}
                </div>
                <div>
                  <h4 className="text-sm font-space font-bold">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">
                    {isDone ? agent.doneDesc : agent.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                ) : isCurrent ? (
                  <RefreshCw className="w-4 h-4 text-brand-green animate-spin" />
                ) : (
                  <div className="w-3.5 h-3.5 bg-gray-200 rounded-full border border-gray-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Micro-ticker */}
      <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs text-gray-600 font-mono">
        <AlertCircle className="w-4 h-4 text-brand-green shrink-0 animate-bounce" />
        <span className="truncate">{getTickerMsg()}</span>
      </div>
    </div>
  );
}
