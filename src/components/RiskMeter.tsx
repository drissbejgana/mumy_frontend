import React, { useEffect, useState } from "react";
import { ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

interface RiskMeterProps {
  score: number; // 0 to 100
  confidence: number; // 0 to 100
}

export default function RiskMeter({ score, confidence }: RiskMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  // Semicircle gauge logic:
  // Circumference for r=80 is 2 * PI * 80 = 502.6. Semicircle = 251.3
  const radius = 80;
  const strokeWidth = 12;
  const strokeDash = 251.3;
  const strokeOffset = strokeDash - (strokeDash * animatedScore) / 100;

  // Semicircle angle in deg for needle: score runs 0 -> 100, maps to -90 -> 90 degrees
  const needleRotation = -90 + (180 * animatedScore) / 100;

  // Color gradient
  const getGaugeColor = (val: number) => {
    if (val < 40) return "#2cff05"; // neon green
    if (val < 75) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const getVerdictLabel = (val: number) => {
    if (val < 40) return { label: "LOW RISK", color: "text-brand-green", bg: "bg-brand-green/10 border-brand-green/30" };
    if (val < 75) return { label: "MODERATE RISK", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30" };
    return { label: "CRITICAL RISK", color: "text-red-500", bg: "bg-red-500/10 border-red-500/30" };
  };

  const verdict = getVerdictLabel(score);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <h3 className="font-space font-semibold text-gray-700 text-sm mb-4 uppercase tracking-wide">
        Intellectual Property Check
      </h3>

      <div className="relative w-56 h-32 flex justify-center items-end overflow-hidden mb-2">
        <svg className="w-48 h-24" viewBox="0 0 180 90">
          {/* Background Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled Danger Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke={getGaugeColor(animatedScore)}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Needle Pointer Pin */}
        <div 
          className="absolute bottom-0 left-1/2 w-2 h-16 bg-gray-800 rounded-full origin-bottom transition-all duration-1000 ease-out"
          style={{
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
          }}
        >
          <div className="absolute top-0 left-1/2 -translateX-1/2 w-4 h-4 bg-gray-800 rounded-full -mt-2"></div>
        </div>
        
        {/* Core Pin Center */}
        <div className="absolute bottom-0 left-1/2 -translateX-1/2 w-8 h-4 bg-gray-800 rounded-t-full"></div>
      </div>

      <div className="text-center">
        <div className="text-3xl font-space font-extrabold text-gray-900 leading-none mb-1">
          {score}%
        </div>
        <div className={`inline-flex items-center px-4 py-1 rounded-full border text-xs font-mono font-bold uppercase mb-2 ${verdict.bg} ${verdict.color}`}>
          {verdict.label}
        </div>
        <p className="text-xs text-gray-400 font-medium">
          Detection Confidence: <span className="text-gray-600 font-bold">{confidence}%</span>
        </p>
      </div>
    </div>
  );
}
