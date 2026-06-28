import React, { useEffect, useState } from "react";

interface RiskMeterProps {
  score: number;
  confidence: number;
}

export default function RiskMeter({ score, confidence }: RiskMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 150);
    return () => clearTimeout(timer);
  }, [score]);

  const strokeDash = 251.3;
  const strokeOffset = strokeDash - (strokeDash * animatedScore) / 100;
  const needleRotation = -90 + (180 * animatedScore) / 100;

  const getGaugeColor = (val: number) => {
    if (val < 40) return "#2cff05";
    if (val < 75) return "#f59e0b";
    return "#ef4444";
  };

  const getVerdictLabel = (val: number) => {
    if (val < 40) return { label: "LOW RISK",      color: "text-brand-green",  bg: "bg-brand-green/10 border-brand-green/30" };
    if (val < 75) return { label: "MODERATE RISK", color: "text-amber-500",    bg: "bg-amber-100 border-amber-300" };
    return              { label: "CRITICAL RISK",  color: "text-red-600",      bg: "bg-red-50 border-red-300" };
  };

  const verdict = getVerdictLabel(score);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="font-space font-semibold text-gray-500 text-xs mb-4 uppercase tracking-widest">
        Intellectual Property Check
      </h3>

      <div className="relative w-56 h-32 flex justify-center items-end overflow-hidden mb-2">
        <svg className="w-48 h-24" viewBox="0 0 180 90">
          {/* Background Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={12}
            strokeLinecap="round"
          />
          {/* Filled Danger Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke={getGaugeColor(animatedScore)}
            strokeWidth={12}
            strokeDasharray={strokeDash}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-1.5 h-16 bg-gray-700 rounded-full origin-bottom transition-all duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-700 rounded-full -mt-1.5" />
        </div>

        {/* Center pin */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-3.5 bg-white border-t border-gray-200 rounded-t-full" />
      </div>

      <div className="text-center">
        <div className="text-3xl font-space font-extrabold text-gray-900 leading-none mb-1">
          {score}%
        </div>
        <div className={`inline-flex items-center px-4 py-1 rounded-full border text-xs font-mono font-bold uppercase mb-2 ${verdict.bg} ${verdict.color}`}>
          {verdict.label}
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Detection Confidence: <span className="text-gray-700 font-bold">{confidence}%</span>
        </p>
      </div>
    </div>
  );
}
