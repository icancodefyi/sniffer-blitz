"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const COORDINATOR_URL = process.env.NEXT_PUBLIC_COORDINATOR_URL || "http://localhost:8000";

interface Agent {
  name: string;
  status: string;
  specialty: string;
}

interface ActivityEntry {
  timestamp: string;
  agent: string;
  action: string;
  details: string;
}

export default function HomePage() {
  const [agents, setAgents] = useState<Record<string, string>>({});
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [agentsRes, activityRes, casesRes] = await Promise.all([
          fetch(`${COORDINATOR_URL}/agents/status`),
          fetch(`${COORDINATOR_URL}/activity`),
          fetch(`${COORDINATOR_URL}/cases`),
        ]);
        if (agentsRes.ok) setAgents(await agentsRes.json());
        if (activityRes.ok) setActivity(await activityRes.json());
        if (casesRes.ok) setCases(await casesRes.json());
      } catch (e) {}
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const agentCards: Agent[] = [
    { name: "Telegram Scanner", status: agents["Telegram Scanner"] || "idle", specialty: "Scans Telegram channels for leaked content" },
    { name: "Instagram Scanner", status: agents["Instagram Scanner"] || "idle", specialty: "Scans Instagram for leaked content" },
    { name: "Leak Domain Scanner", status: agents["Leak Domain Scanner"] || "idle", specialty: "Scans known leak domains" },
    { name: "Format Detector", status: agents["Format Detector"] || "idle", specialty: "Detects platform takedown formats" },
    { name: "Takedown Preparer", status: agents["Takedown Preparer"] || "idle", specialty: "Prepares complaints in correct formats" },
  ];

  const statusColor = (status: string) => {
    if (status === "scanning" || status === "detecting" || status === "preparing") return "bg-warning/20 text-warning border-warning/30";
    if (status === "complete") return "bg-success/20 text-success border-success/30";
    return "bg-border/50 text-muted border-border";
  };

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <span className="font-semibold text-lg">Sniffer</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted ml-2">Agent-Powered</span>
          </div>
          <Link href="/investigate" className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors">
            Start Investigation
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-4">Autonomous Agent Investigation Platform</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6">
            Agents investigate.<br/>
            <span className="text-muted">Blockchain proves.</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mb-8">
            AI agents autonomously scan for leaked content, detect takedown formats, and prepare complaints. Every step recorded on-chain. Victims receive tamper-proof certificates.
          </p>
          <div className="flex gap-4">
            <Link href="/investigate" className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors">
              Start Investigation
            </Link>
            <a href="#agents" className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-surface transition-colors">
              View Agents
            </a>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-8">How It Works</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Upload Content", desc: "Victim uploads leaked image. Agents are dispatched to scan multiple sources." },
            { step: "02", title: "Agents Investigate", desc: "5 specialized agents scan, detect formats, and prepare complaints autonomously." },
            { step: "03", title: "Get Certificate", desc: "Tamper-proof certificate with on-chain proof. Ready for takedowns and legal action." },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-xl border border-border bg-surface">
              <p className="font-mono text-[11px] text-accent mb-3">{item.step}</p>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Registry */}
      <section id="agents" className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-8">Agent Registry</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentCards.map((agent) => (
            <div key={agent.name} className="p-5 rounded-xl border border-border bg-surface">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">{agent.name}</h4>
                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${statusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-muted text-xs">{agent.specialty}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
        <div className="flex items-center gap-3 mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Live Activity</p>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
        </div>
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          {activity.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">No activity yet. Start an investigation to see agents in action.</div>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {activity.slice().reverse().slice(0, 20).map((entry, i) => (
                <div key={i} className="px-5 py-3 flex items-start gap-4">
                  <span className="font-mono text-[10px] text-muted whitespace-nowrap mt-0.5">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent whitespace-nowrap mt-0.5 w-32">
                    {entry.agent}
                  </span>
                  <span className="text-sm">{entry.action}</span>
                  {entry.details && <span className="text-muted text-sm ml-auto">{entry.details}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Cases */}
      {cases.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-8">Recent Investigations</p>
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted">Case ID</th>
                  <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted">Status</th>
                  <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted">Findings</th>
                  <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted">Complaints</th>
                  <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cases.map((c) => (
                  <tr key={c.case_id} className="hover:bg-background/50">
                    <td className="px-5 py-3 font-mono text-xs">#{c.case_id}</td>
                    <td className="px-5 py-3">
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${c.status === "complete" ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm">{c.findings_count}</td>
                    <td className="px-5 py-3 text-sm">{c.complaints_count}</td>
                    <td className="px-5 py-3">
                      <Link href={`/report/${c.case_id}`} className="text-accent text-sm hover:underline">View Report</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-muted text-sm">Sniffer - Agent-Powered Investigation Platform</p>
          <p className="font-mono text-[10px] text-muted">Built on Monad</p>
        </div>
      </footer>
    </main>
  );
}
