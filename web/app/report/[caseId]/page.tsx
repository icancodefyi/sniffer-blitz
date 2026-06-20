"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const COORDINATOR_URL = process.env.NEXT_PUBLIC_COORDINATOR_URL || "http://localhost:8000";

export default function ReportPage({ params }: { params: Promise<{ caseId: string }> }) {
  const [caseId, setCaseId] = useState<string>("");
  const [caseData, setCaseData] = useState<any>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    params.then(p => setCaseId(p.caseId));
  }, [params]);

  useEffect(() => {
    if (!caseId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`${COORDINATOR_URL}/case/${caseId}`);
        if (res.ok) {
          const data = await res.json();
          setCaseData(data);
        } else {
          console.error("Failed to fetch case:", res.status);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    const timeout = setTimeout(() => setLoadingTimeout(true), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [caseId]);

  if (!caseData) {
    if (loadingTimeout) {
      return (
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted mb-2">Unable to load report</p>
            <Link href={`/investigation/${caseId}`} className="text-accent text-sm hover:underline">
              ← Back to Investigation
            </Link>
          </div>
        </main>
      );
    }
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </main>
    );
  }

  const findings = caseData.findings || [];
  const formatSpecs = caseData.format_specs || [];
  const complaints = caseData.complaints || [];
  const reportHash = caseData.report_hash;

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
          <Link href={`/investigation/${caseId}`} className="text-accent text-sm hover:underline">
            ← Back to Investigation
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Case Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-2">Report #{caseId}</p>
          <h1 className="font-serif text-4xl mb-4">Investigation Report</h1>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 rounded-lg border border-border bg-surface">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">Findings</p>
              <p className="text-2xl font-semibold">{findings.length}</p>
            </div>
            <div className="px-4 py-2 rounded-lg border border-border bg-surface">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">Formats</p>
              <p className="text-2xl font-semibold">{formatSpecs.length}</p>
            </div>
            <div className="px-4 py-2 rounded-lg border border-border bg-surface">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">Complaints</p>
              <p className="text-2xl font-semibold">{complaints.length}</p>
            </div>
          </div>
        </motion.div>

        {/* On-Chain Proof */}
        {reportHash && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-success/30 bg-success/5 p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-success">On-Chain Proof</p>
            </div>
            <p className="text-sm mb-2">This report is stored on Monad blockchain. The hash below proves the report is tamper-proof.</p>
            <div className="font-mono text-xs bg-background/50 rounded-lg p-3 break-all">
              <span className="text-muted">Report Hash: </span>
              <span className="text-foreground">{reportHash}</span>
            </div>
          </motion.div>
        )}

        {/* Findings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-surface p-6 mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-4">Findings ({findings.length})</p>
          {findings.length === 0 ? (
            <p className="text-muted text-sm">No findings.</p>
          ) : (
            <div className="space-y-3">
              {findings.map((f: any, i: number) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-background">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{f.domain}</p>
                      <p className="font-mono text-xs text-muted break-all">{f.url}</p>
                    </div>
                    <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${f.confidence >= 90 ? "bg-danger/20 text-danger border-danger/30" : f.confidence >= 80 ? "bg-warning/20 text-warning border-warning/30" : "bg-muted/20 text-muted border-muted/30"}`}>
                      {f.confidence}% match
                    </span>
                  </div>
                  {f.metadata && (
                    <div className="font-mono text-[10px] text-muted mt-2">
                      {(() => {
                        try {
                          const meta = JSON.parse(f.metadata);
                          return Object.entries(meta).map(([k, v]) => (
                            <span key={k} className="mr-4">{k}: {String(v)}</span>
                          ));
                        } catch { return null; }
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Format Specs */}
        {formatSpecs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-surface p-6 mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-4">Takedown Formats Detected ({formatSpecs.length})</p>
            <div className="space-y-3">
              {formatSpecs.map((f: any, i: number) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{f.platform}</p>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border bg-accent/10 text-accent border-accent/20">
                      {f.formatType}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted">Contact: {f.contact}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Complaints */}
        {complaints.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-surface p-6 mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-4">Prepared Complaints ({complaints.length})</p>
            <div className="space-y-4">
              {complaints.map((c: any, i: number) => {
                return (
                  <div key={i} className="p-4 rounded-lg border border-border bg-background">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">{c.platform}</p>
                        <p className="font-mono text-[10px] text-muted">{c.format || c.formatType}</p>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border bg-success/20 text-success border-success/30">
                        Ready to Send
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-mono text-[10px] text-muted mb-1">To:</p>
                        <p className="font-mono">{c.contact}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] text-muted mb-1">Subject:</p>
                        <p className="font-medium">{c.subject}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] text-muted mb-1">Body:</p>
                        <pre className="font-sans text-xs whitespace-pre-wrap bg-background/50 rounded p-3 border border-border">{c.body}</pre>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          const mailto = `mailto:${c.contact}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.body)}`;
                          window.open(mailto);
                        }}
                        className="px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-hover transition-colors"
                      >
                        Open in Email
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${c.subject}\n\n${c.body}`);
                        }}
                        className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-background transition-colors"
                      >
                        Copy Text
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Case Sealed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-success">Case Sealed</p>
          </div>
          <div className="space-y-2 text-sm">
            <p>✓ {findings.length} matches found across {new Set(findings.map((f: any) => f.domain)).size} platforms</p>
            <p>✓ {formatSpecs.length} takedown formats detected</p>
            <p>✓ {complaints.length} complaints prepared and ready to send</p>
            <p>✓ Report stored on-chain with hash: <span className="font-mono text-xs">{reportHash?.slice(0, 20)}...</span></p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
