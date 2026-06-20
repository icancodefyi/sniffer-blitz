"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const COORDINATOR_URL = process.env.NEXT_PUBLIC_COORDINATOR_URL || "http://localhost:8000";

const AGENT_CONFIG = [
  { name: "Telegram Scanner", key: "Telegram Scanner", color: "#3b82f6", phase: "scanning" },
  { name: "Instagram Scanner", key: "Instagram Scanner", color: "#ec4899", phase: "scanning" },
  { name: "Leak Domain Scanner", key: "Leak Domain Scanner", color: "#f59e0b", phase: "scanning" },
  { name: "Format Detector", key: "Format Detector", color: "#8b5cf6", phase: "detecting" },
  { name: "Takedown Preparer", key: "Takedown Preparer", color: "#10b981", phase: "preparing" },
];

export default function InvestigationPage({ params }: { params: Promise<{ caseId: string }> }) {
  const [caseId, setCaseId] = useState<string>("");
  const [caseData, setCaseData] = useState<any>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, string>>({});
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    params.then(p => setCaseId(p.caseId));
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
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <span className="font-semibold text-lg">Sniffer</span>
          </Link>
          {isComplete && (
            <Link href={`/report/${caseId}`} className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors">
              View Report
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Case Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-2">Investigation #{caseId}</p>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl">Live Investigation</h1>
            <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${isComplete ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"}`}>
              {isComplete ? "Complete" : "In Progress"}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pipeline Visualization */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-6">Agent Pipeline</p>

              {/* Scanner Agents */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {AGENT_CONFIG.slice(0, 3).map((agent) => {
                  const state = getAgentState(agent.name);
                  return (
                    <motion.div
                      key={agent.name}
                      className={`rounded-xl border p-4 transition-colors ${state === "active" ? "border-warning bg-warning/5" : state === "complete" ? "border-success bg-success/5" : "border-border bg-background"}`}
                      animate={state === "active" ? { scale: [1, 1.01, 1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${state === "active" ? "bg-warning animate-pulse-glow" : state === "complete" ? "bg-success" : "bg-border"}`} style={state === "complete" ? { backgroundColor: agent.color } : {}} />
                        <span className="text-xs font-medium">{agent.name}</span>
                      </div>
                      <p className="font-mono text-[10px] text-muted">
                        {state === "active" ? "Scanning..." : state === "complete" ? "Complete" : "Waiting"}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center my-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                </motion.div>
              </div>

              {/* Findings Pool */}
              <div className="rounded-xl border border-border bg-background p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Findings Pool</span>
                  <span className="font-mono text-xs text-accent">{findings.length} found</span>
                </div>
                {findings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {findings.map((f: any, i: number) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                      >
                        {f.domain} ({f.confidence}%)
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center my-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
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
                      className={`rounded-xl border p-4 transition-colors ${state === "active" ? "border-warning bg-warning/5" : state === "complete" ? "border-success bg-success/5" : "border-border bg-background"}`}
                      animate={state === "active" ? { scale: [1, 1.01, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${state === "active" ? "bg-warning animate-pulse-glow" : state === "complete" ? "bg-success" : "bg-border"}`} />
                          <span className="text-sm font-medium">{agent.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-muted">
                          {state === "active" ? "Detecting formats..." : state === "complete" ? `${formatSpecs.length} formats detected` : "Waiting"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center my-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
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
                      className={`rounded-xl border p-4 transition-colors ${state === "active" ? "border-warning bg-warning/5" : state === "complete" ? "border-success bg-success/5" : "border-border bg-background"}`}
                      animate={state === "active" ? { scale: [1, 1.01, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${state === "active" ? "bg-warning animate-pulse-glow" : state === "complete" ? "bg-success" : "bg-border"}`} />
                          <span className="text-sm font-medium">{agent.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-muted">
                          {state === "active" ? "Preparing complaints..." : state === "complete" ? `${complaints.length} complaints prepared` : "Waiting"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center my-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1.5 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                </motion.div>
              </div>

              {/* Report */}
              <motion.div
                className={`rounded-xl border p-4 transition-colors ${isComplete ? "border-success bg-success/5" : "border-border bg-background"}`}
                animate={isComplete ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isComplete ? "bg-success" : "bg-border"}`} />
                    <span className="text-sm font-medium">Report</span>
                  </div>
                  {isComplete ? (
                    <Link href={`/report/${caseId}`} className="text-accent text-sm hover:underline">View Report →</Link>
                  ) : (
                    <span className="font-mono text-[10px] text-muted">Generating...</span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <div className="rounded-xl border border-border bg-surface p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Activity Log</p>
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {activity.slice().reverse().slice(0, 20).map((entry, i) => (
                    <motion.div
                      key={`${entry.timestamp}-${i}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 rounded-lg bg-background border border-border"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] text-muted">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-accent">{entry.agent}</span>
                      </div>
                      <p className="text-xs">{entry.action}</p>
                      {entry.details && <p className="text-[10px] text-muted mt-0.5">{entry.details}</p>}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
