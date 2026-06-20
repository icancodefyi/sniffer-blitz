"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { WalletButton } from "@/components/WalletConnect";

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
        <main className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-[#6b7280] mb-2">Unable to load report</p>
            <Link href={`/investigation/${caseId}`} className="text-indigo-600 text-sm hover:underline">
              ← Back to Investigation
            </Link>
          </div>
        </main>
      );
    }
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#6b7280]">Loading...</p>
      </main>
    );
  }

  const findings = caseData.findings || [];
  const formatSpecs = caseData.format_specs || [];
  const complaints = caseData.complaints || [];
  const reportHash = caseData.report_hash;

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
            <Link href={`/investigation/${caseId}`} className="text-[#6b7280] text-sm hover:text-[#0a0a0a] transition-colors">
              ← Back to Investigation
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8">
        {/* Case Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-2">Report #{caseId}</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.1] tracking-tight text-[#0a0a0a] mb-4">Investigation Report</h1>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 rounded-lg border border-[#e8e4de] bg-white">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29e] mb-1">Findings</p>
              <p className="text-2xl font-semibold text-[#0a0a0a]">{findings.length}</p>
            </div>
            <div className="px-4 py-2 rounded-lg border border-[#e8e4de] bg-white">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29e] mb-1">Formats</p>
              <p className="text-2xl font-semibold text-[#0a0a0a]">{formatSpecs.length}</p>
            </div>
            <div className="px-4 py-2 rounded-lg border border-[#e8e4de] bg-white">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29e] mb-1">Complaints</p>
              <p className="text-2xl font-semibold text-[#0a0a0a]">{complaints.length}</p>
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
            <p className="text-sm text-[#6b7280] mb-2">This report is stored on Monad blockchain. The hash below proves the report is tamper-proof.</p>
            <div className="font-mono text-xs bg-white/50 rounded-lg p-3 break-all border border-success/20">
              <span className="text-[#a8a29e]">Report Hash: </span>
              <span className="text-[#0a0a0a]">{reportHash}</span>
            </div>
          </motion.div>
        )}

        {/* Findings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-[#e8e4de] bg-white p-6 mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-4">Findings ({findings.length})</p>
          {findings.length === 0 ? (
            <p className="text-[#6b7280] text-sm">No findings.</p>
          ) : (
            <div className="space-y-3">
              {findings.map((f: any, i: number) => (
                <div key={i} className="p-4 rounded-lg border border-[#e8e4de] bg-[#fafaf9]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm text-[#0a0a0a]">{f.domain}</p>
                      <p className="font-mono text-xs text-[#6b7280] break-all">{f.url}</p>
                    </div>
                    <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${f.confidence >= 90 ? "bg-danger/20 text-danger border-danger/30" : f.confidence >= 80 ? "bg-warning/20 text-warning border-warning/30" : "bg-muted/20 text-muted border-muted/30"}`}>
                      {f.confidence}% match
                    </span>
                  </div>
                  {f.metadata && (
                    <div className="font-mono text-[10px] text-[#6b7280] mt-2">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-[#e8e4de] bg-white p-6 mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-4">Takedown Formats Detected ({formatSpecs.length})</p>
            <div className="space-y-3">
              {formatSpecs.map((f: any, i: number) => (
                <div key={i} className="p-4 rounded-lg border border-[#e8e4de] bg-[#fafaf9]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-[#0a0a0a]">{f.platform}</p>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200">
                      {f.formatType}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#6b7280]">Contact: {f.contact}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Complaints */}
        {complaints.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-[#e8e4de] bg-white p-6 mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-4">Prepared Complaints ({complaints.length})</p>
            <div className="space-y-4">
              {complaints.map((c: any, i: number) => {
                return (
                  <div key={i} className="p-4 rounded-lg border border-[#e8e4de] bg-[#fafaf9]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm text-[#0a0a0a]">{c.platform}</p>
                        <p className="font-mono text-[10px] text-[#6b7280]">{c.format || c.formatType}</p>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border bg-success/20 text-success border-success/30">
                        Ready to Send
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-mono text-[10px] text-[#a8a29e] mb-1">To:</p>
                        <p className="font-mono text-[#0a0a0a]">{c.contact}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] text-[#a8a29e] mb-1">Subject:</p>
                        <p className="font-medium text-[#0a0a0a]">{c.subject}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] text-[#a8a29e] mb-1">Body:</p>
                        <pre className="font-sans text-xs whitespace-pre-wrap bg-white rounded p-3 border border-[#e8e4de] text-[#0a0a0a]">{c.body}</pre>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(c.contact)}&su=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.body)}`;
                          window.open(gmailUrl, "_blank");
                        }}
                        className="px-3 py-1.5 bg-[#0a0a0a] text-white rounded-full text-xs font-medium hover:opacity-75 transition-opacity"
                      >
                        Open in Gmail
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${c.subject}\n\n${c.body}`);
                        }}
                        className="px-3 py-1.5 border border-[#e8e4de] rounded-full text-xs font-medium text-[#0a0a0a] hover:bg-[#fafaf9] transition-colors"
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-[#e8e4de] bg-white p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-success">Case Sealed</p>
          </div>
          <div className="space-y-2 text-sm text-[#0a0a0a]">
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
