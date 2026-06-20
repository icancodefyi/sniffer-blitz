"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { WalletButton } from "@/components/WalletConnect";

const COORDINATOR_URL = process.env.NEXT_PUBLIC_COORDINATOR_URL || "http://localhost:8000";

const AGENT_CONFIG = [
  { name: "Telegram Scanner", key: "Telegram Scanner", color: "#3b82f6", phase: "scanning", icon: "📱" },
  { name: "Instagram Scanner", key: "Instagram Scanner", color: "#ec4899", phase: "scanning", icon: "📷" },
  { name: "Leak Domain Scanner", key: "Leak Domain Scanner", color: "#f59e0b", phase: "scanning", icon: "🌐" },
  { name: "Format Detector", key: "Format Detector", color: "#8b5cf6", phase: "detecting", icon: "📋" },
  { name: "Takedown Preparer", key: "Takedown Preparer", color: "#10b981", phase: "preparing", icon: "✉️" },
];

export default function InvestigationPage({ params }: { params: Promise<{ caseId: string }> }) {
  const [caseId, setCaseId] = useState<string>("");
  const [caseData, setCaseData] = useState<any>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, string>>({});
  const [activity, setActivity] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => {
      setCaseId(p.caseId);
      const stored = sessionStorage.getItem(`sniffer_image_${p.caseId}`);
      if (stored) setImagePreview(stored);
    });
  }, [params]);

  useEffect(() => {
    if (!caseId) return;
    const fetchData = async () => {
      try {
        const [caseRes, statusRes, activityRes] = await Promise.all([
          fetch(`${COORDINATOR_URL}/case/${caseId}`),
          fetch(`${COORDINATOR_URL}/agents/status`),
          fetch(`${COORDINATOR_URL}/activity`),
        ]);
        if (caseRes.ok) setCaseData(await caseRes.json());
        if (statusRes.ok) setAgentStatus(await statusRes.json());
        if (activityRes.ok) setActivity(await activityRes.json());
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [caseId]);

  const getAgentState = (name: string) => {
    const status = agentStatus[name];
    if (status === "scanning" || status === "detecting" || status === "preparing") return "active";
    if (status === "complete") return "complete";
    return "idle";
  };

  const isComplete = caseData?.status === "complete";
  const findings = caseData?.findings || [];
  const formatSpecs = caseData?.format_specs || [];
  const complaints = caseData?.complaints || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-[#e8e4de] bg-white sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Sniffer" width={28} height={28} />
            <span className="text-[21px] font-semibold tracking-tight text-[#0a0a0a]">
              sniffer
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            <WalletButton />
            {isComplete && (
              <Link href={`/report/${caseId}`} className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-80">
                View Report
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8">
        {/* Case Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-2">Investigation #{caseId}</p>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-medium leading-[1.1] tracking-tight text-[#0a0a0a]">Live Investigation</h1>
            <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${isComplete ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"}`}>
              {isComplete ? "Complete" : "In Progress"}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Image + Activity */}
          <div className="lg:col-span-1 space-y-8">
            {/* Image Preview */}
            <div className="rounded-xl border border-[#e8e4de] bg-white p-4 sticky top-20">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-3">Uploaded Content</p>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Uploaded content" className="w-full rounded-lg border border-[#e8e4de]" />
                  <div className="absolute top-2 right-2 bg-[#0a0a0a]/70 text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
                    Case #{caseId}
                  </div>
                </div>
              ) : (
                <div className="h-40 rounded-lg bg-[#fafaf9] border border-dashed border-[#e8e4de] flex items-center justify-center">
                  <p className="text-[10px] text-[#a8a29e]">No preview available</p>
                </div>
              )}
              {/* Live indicator */}
              <div className="flex items-center gap-2 mt-4">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isComplete ? "#22c55e" : "#f59e0b" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="font-mono text-[10px] text-[#6b7280]">
                  {isComplete ? "Investigation Complete" : "Live Investigation"}
                </span>
              </div>
            </div>

            {/* Activity Log */}
            <div className="rounded-xl border border-[#e8e4de] bg-white p-4">
              <div className="flex items-center gap-2 mb-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e]">Activity Log</p>
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                  {activity.slice().reverse().slice(0, 20).map((entry, i) => (
                    <motion.div
                      key={`${entry.timestamp}-${i}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 rounded-lg bg-[#fafaf9] border border-[#e8e4de]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] text-[#a8a29e]">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-600">{entry.agent}</span>
                      </div>
                      <p className="text-xs text-[#0a0a0a]">{entry.action}</p>
                      {entry.details && <p className="text-[10px] text-[#6b7280] mt-0.5">{entry.details}</p>}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Pipeline Visualization */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-[#e8e4de] bg-white p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-6">Agent Pipeline</p>

              {/* Scanner Agents */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {AGENT_CONFIG.slice(0, 3).map((agent) => {
                  const state = getAgentState(agent.name);
                  return (
                    <motion.div
                      key={agent.name}
                      className={`rounded-xl border p-4 transition-colors ${state === "active" ? "border-warning bg-warning/5" : state === "complete" ? "border-success bg-success/5" : "border-[#e8e4de] bg-[#fafaf9]"}`}
                      animate={state === "active" ? { scale: [1, 1.01, 1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{agent.icon}</span>
                        <div className={`w-3 h-3 rounded-full ${state === "active" ? "bg-warning animate-pulse-glow" : state === "complete" ? "bg-success" : "bg-[#e8e4de]"}`} style={state === "complete" ? { backgroundColor: agent.color } : {}} />
                        <span className="text-xs font-medium text-[#0a0a0a]">{agent.name}</span>
                      </div>
                      <p className="font-mono text-[10px] text-[#6b7280]">
                        {state === "active" ? "Scanning..." : state === "complete" ? "Complete" : "Waiting"}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center my-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a8a29e]">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                </motion.div>
              </div>

              {/* Findings Pool */}
              <div className="rounded-xl border border-[#e8e4de] bg-[#fafaf9] p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#a8a29e]">Findings Pool</span>
                  <span className="font-mono text-xs text-indigo-600">{findings.length} found</span>
                </div>
                {findings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {findings.map((f: any, i: number) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200"
                      >
                        {f.domain} ({f.confidence}%)
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center my-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a8a29e]">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                </motion.div>
              </div>

              {/* Format Detector */}
              <div className="mb-4">
                {(() => {
                  const agent = AGENT_CONFIG[3];
                  const state = getAgentState(agent.name);
                  return (
                    <motion.div
                      className={`rounded-xl border p-4 transition-colors ${state === "active" ? "border-warning bg-warning/5" : state === "complete" ? "border-success bg-success/5" : "border-[#e8e4de] bg-[#fafaf9]"}`}
                      animate={state === "active" ? { scale: [1, 1.01, 1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{agent.icon}</span>
                          <div className={`w-3 h-3 rounded-full ${state === "active" ? "bg-warning animate-pulse-glow" : state === "complete" ? "bg-success" : "bg-[#e8e4de]"}`} />
                          <span className="text-sm font-medium text-[#0a0a0a]">{agent.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#6b7280]">
                          {state === "active" ? "Detecting formats..." : state === "complete" ? `${formatSpecs.length} formats detected` : "Waiting"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center my-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a8a29e]">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                </motion.div>
              </div>

              {/* Takedown Preparer */}
              <div className="mb-4">
                {(() => {
                  const agent = AGENT_CONFIG[4];
                  const state = getAgentState(agent.name);
                  return (
                    <motion.div
                      className={`rounded-xl border p-4 transition-colors ${state === "active" ? "border-warning bg-warning/5" : state === "complete" ? "border-success bg-success/5" : "border-[#e8e4de] bg-[#fafaf9]"}`}
                      animate={state === "active" ? { scale: [1, 1.01, 1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{agent.icon}</span>
                          <div className={`w-3 h-3 rounded-full ${state === "active" ? "bg-warning animate-pulse-glow" : state === "complete" ? "bg-success" : "bg-[#e8e4de]"}`} />
                          <span className="text-sm font-medium text-[#0a0a0a]">{agent.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#6b7280]">
                          {state === "active" ? "Preparing complaints..." : state === "complete" ? `${complaints.length} complaints prepared` : "Waiting"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center my-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a8a29e]">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                </motion.div>
              </div>

              {/* Report */}
              <motion.div
                className={`rounded-xl border p-4 transition-colors ${isComplete ? "border-success bg-success/5" : "border-[#e8e4de] bg-[#fafaf9]"}`}
                animate={isComplete ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isComplete ? "bg-success" : "bg-[#e8e4de]"}`} />
                    <span className="text-sm font-medium text-[#0a0a0a]">Report</span>
                  </div>
                  {isComplete ? (
                    <Link href={`/report/${caseId}`} className="text-indigo-600 text-sm hover:underline">View Report →</Link>
                  ) : (
                    <span className="font-mono text-[10px] text-[#6b7280]">Generating...</span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
