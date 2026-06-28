import React, { useState } from "react";
import {
  ShieldCheck, AlertTriangle, AlertOctagon, Lightbulb,
  ChevronDown, Activity, Sparkles, Database, FileText, Search
} from "lucide-react";
import { ScanResult, VerdictType } from "../types";
import RiskMeter from "./RiskMeter";

interface ResultDashboardProps {
  scan: ScanResult;
  onReset?: () => void;
}

export default function ResultDashboard({ scan, onReset }: ResultDashboardProps) {
  const [openSection, setOpenSection] = useState<string>("geminiVision");

  const subScoreKeys = [
    { label: "Visual Reference Risk",   val: scan.subScores.visualRisk,   desc: "Direct overlaps against protected character visuals or catalog templates." },
    { label: "Text Lexicon Risk",        val: scan.subScores.textRisk,      desc: "Unlicensed brand keywords or phrases identified in titles or descriptions." },
    { label: "Metadata Evasion Risk",    val: scan.subScores.metadataRisk,  desc: "Franchise tags or hidden context pointers listed in backing tags." },
    { label: "Cross-Modal Convergence",  val: scan.subScores.crossModal,    desc: "Co-occurrence of blurred pixels matched with evasion synonyms." },
    { label: "Obfuscation Signature",    val: scan.subScores.obfuscation,   desc: "Pixel Gaussian tampering, sharpness spikes or artificial blurs." }
  ];

  const getBarColor = (val: number) => {
    if (val < 0.40) return "bg-[#2cff05]";
    if (val < 0.75) return "bg-amber-400";
    return "bg-red-500";
  };

  const getVerdictBanner = (verdict: VerdictType) => {
    switch (verdict) {
      case "BLOCK_LISTING":
        return {
          border: "border-red-300",
          bg: "bg-red-50",
          icon: <AlertOctagon className="w-8 h-8 text-red-500 shrink-0" />,
          title: "HIGH RISK — DO NOT PUBLISH",
          titleColor: "text-red-600",
          desc: "This listing contains heavy intellectual property overlaps. Publishing is highly likely to cause automatic store suspension."
        };
      case "MANUAL_REVIEW":
        return {
          border: "border-amber-300",
          bg: "bg-amber-50",
          icon: <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />,
          title: "CAUTION — MANUAL REVIEW REQUIRED",
          titleColor: "text-amber-600",
          desc: "We found moderate risk indicators, blurry areas, or evasive text keywords. Double check elements before publishing."
        };
      case "SAFE_TO_PUBLISH":
      default:
        return {
          border: "border-green-300",
          bg: "bg-green-50",
          icon: <ShieldCheck className="w-8 h-8 text-[#2cff05] shrink-0" />,
          title: "CLEAR — SAFE TO PUBLISH",
          titleColor: "text-green-600",
          desc: "No intellectual property infringement, fuzzy phonetic synonyms or hidden tags were detected. Your listing matches standard compliance guidelines."
        };
    }
  };

  const banner = getVerdictBanner(scan.verdict);

  const accordions = [
    { key: "geminiVision",   label: "Agent 1: Deep Vision Analysis",          value: scan.chainOfThought.geminiVision,   icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
    { key: "cloudVision",    label: "Agent 2: Reverse Visual Query Matcher",   value: scan.chainOfThought.cloudVision,    icon: <Search   className="w-4 h-4 text-blue-500"   /> },
    { key: "blurDetective",  label: "Agent 3: Pixel Forensic Analyzer",        value: scan.chainOfThought.blurDetective,  icon: <Activity className="w-4 h-4 text-sky-500"    /> },
    { key: "textDecoder",    label: "Agent 4: Natural Spelling Decoder",        value: scan.chainOfThought.textDecoder,    icon: <FileText className="w-4 h-4 text-indigo-500" /> },
    { key: "fusionEngine",   label: "Agent 5: Probabilistic Fusion Engine",     value: scan.chainOfThought.fusionEngine,   icon: <Database className="w-4 h-4 text-emerald-500"/> }
  ];

  const card = "bg-white border border-gray-200 rounded-2xl";

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-1 py-4">

      {/* VERDICT BANNER */}
      <div className={`p-5 border-2 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 ${banner.bg} ${banner.border}`}>
        {banner.icon}
        <div className="flex-1">
          <h2 className={`text-lg font-space font-extrabold tracking-tight mb-1 ${banner.titleColor}`}>{banner.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">{banner.desc}</p>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="shrink-0 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl text-sm font-space font-bold transition-colors cursor-pointer"
          >
            Scan Another Listing
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="md:col-span-5 space-y-5">
          <RiskMeter score={scan.riskScore} confidence={scan.confidenceScore} />

          {/* DETECTED IP PROFILE */}
          <div className={`p-5 ${card} space-y-4`}>
            <h4 className="font-space font-bold text-gray-500 text-xs uppercase tracking-widest border-b border-gray-100 pb-3">
              Matched IP Catalog Profile
            </h4>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-sans">Identified Associated Brand / Attribute:</p>
              <div className="text-xl font-space font-extrabold text-[#2323ff]">
                {scan.detectedBrand !== "None" ? scan.detectedBrand : "No Licensed Brand Target"}
              </div>
            </div>
            {scan.violationVectors.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-gray-500 font-medium">Flagged Violation Vectors:</p>
                <div className="flex flex-wrap gap-1.5">
                  {scan.violationVectors.map((vec, i) => (
                    <span key={i} className="px-2.5 py-1 text-[10px] font-mono font-bold bg-red-50 border border-red-300 text-red-600 rounded">
                      {vec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* UPLOADED IMAGE PREVIEW */}
          <div className={`p-5 ${card}`}>
            <h4 className="font-space font-bold text-gray-500 text-xs uppercase tracking-widest mb-3">
              Uploaded Analysis Target
            </h4>
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
              <img src={scan.imageUrl} alt="Product visual" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-7 space-y-5">

          {/* SUB-SCORES */}
          <div className={`p-5 ${card} space-y-5`}>
            <div>
              <h3 className="font-space font-bold text-gray-900 text-base">Individual Agent Threat Assessment</h3>
              <p className="text-xs text-gray-500 mt-1">Weighted probabilities that make up the final score.</p>
            </div>
            <div className="space-y-4">
              {subScoreKeys.map((bar, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-space font-semibold text-gray-700">{bar.label}</span>
                    <span className="font-mono text-gray-900 font-extrabold">{Math.round(bar.val * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${getBarColor(bar.val)}`}
                      style={{ width: `${bar.val * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 font-sans leading-relaxed">{bar.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* COMPLIANCE CHECKLIST */}
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <h3 className="font-space font-extrabold text-amber-700 text-sm">Required Compliance Checklist</h3>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
              {scan.optimizationAdvice}
            </div>
          </div>

          {/* CHAIN OF THOUGHT ACCORDION */}
          <div className="space-y-3">
            <div>
              <h3 className="font-space font-bold text-gray-900 text-base">Pre-Publication Forensics Logs</h3>
              <p className="text-xs text-gray-500 mt-1">Collapsible reasoning traces from each AI scanner layer.</p>
            </div>
            <div className="space-y-2">
              {accordions.map((item) => {
                const isOpen = openSection === item.key;
                return (
                  <div key={item.key} className={`${card} overflow-hidden`}>
                    <button
                      onClick={() => setOpenSection(isOpen ? "" : item.key)}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 text-sm font-space font-semibold text-gray-700">
                        {item.icon}
                        {item.label}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                        <p className="text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {item.value}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
