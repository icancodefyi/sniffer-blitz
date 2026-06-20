"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { WalletButton, PayButton } from "@/components/WalletConnect";

const COORDINATOR_URL = process.env.NEXT_PUBLIC_COORDINATOR_URL || "http://localhost:8000";

export default function InvestigatePage() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sources, setSources] = useState({ telegram: true, instagram: true, leak_domains: true });
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setConnected(!!sessionStorage.getItem("sniffer_wallet"));
    const check = setInterval(() => setConnected(!!sessionStorage.getItem("sniffer_wallet")), 1000);
    return () => clearInterval(check);
  }, []);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }, [handleFile]);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Generate a simple hash for demo (non-blocking)
      const imageHash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      const selectedSources = Object.entries(sources).filter(([, v]) => v).map(([k]) => k);

      if (selectedSources.length === 0) {
        alert("Please select at least one source to scan");
        setLoading(false);
        return;
      }

      const res = await fetch(`${COORDINATOR_URL}/investigate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_hash: imageHash, sources: selectedSources }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.case_id) {
        router.push(`/investigation/${data.case_id}`);
      } else {
        throw new Error("No case ID returned from server");
      }
    } catch (e) {
      console.error("Investigation failed:", e);
      alert(`Failed to start investigation: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

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
          </div>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-4 sm:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Ornament */}
          <div aria-hidden="true" className="mb-6 flex items-center gap-3 opacity-50">
            <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
              <path d="M46 6C38 2 25 2 21 12C17 22 25 31 34 29C43 27 45 18 39 14C33 10 24 14 26 21" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="26" cy="21" r="1.5" fill="#818cf8" />
            </svg>
            <svg width="50" height="34" viewBox="0 0 50 34" fill="none" className="-scale-x-100">
              <path d="M46 6C38 2 25 2 21 12C17 22 25 31 34 29C43 27 45 18 39 14C33 10 24 14 26 21" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="26" cy="21" r="1.5" fill="#818cf8" />
            </svg>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-3">Start Investigation</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.1] tracking-tight text-[#0a0a0a] mb-2">Upload Content</h1>
          <p className="text-[17px] leading-[1.7] text-[#6b7280] mb-8">Upload the leaked image. Agents will scan multiple sources and prepare takedown complaints.</p>

          {/* Upload Zone */}
          <div
            className={`rounded-xl border-2 border-dashed transition-colors mb-8 ${dragOver ? "border-indigo-400 bg-indigo-50" : "border-[#e8e4de] bg-white"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="p-6">
                <div className="relative">
                  <img src={preview} alt="Upload preview" className="w-full max-h-64 object-contain rounded-lg" />
                  <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#0a0a0a]/80 text-white flex items-center justify-center hover:bg-[#0a0a0a] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>
                <p className="text-center text-[#6b7280] text-sm mt-3">{file?.name}</p>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center py-16 cursor-pointer">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#a8a29e] mb-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p className="text-sm font-medium mb-1 text-[#0a0a0a]">Drop image here or click to upload</p>
                <p className="text-[#6b7280] text-xs">PNG, JPG, WEBP up to 10MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
            )}
          </div>

          {/* Source Selection */}
          <div className="rounded-xl border border-[#e8e4de] bg-white p-6 mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-4">Select Sources</p>
            <div className="space-y-3">
              {[
                { key: "telegram", label: "Telegram Scanner", desc: "Scan Telegram channels for leaked content", icon: "📱" },
                { key: "instagram", label: "Instagram Scanner", desc: "Scan Instagram for leaked content", icon: "📷" },
                { key: "leak_domains", label: "Leak Domain Scanner", desc: "Scan known leak domains (mydesi.ltd, fsiblog.pro, etc.)", icon: "🌐" },
              ].map((source) => (
                <label key={source.key} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={sources[source.key as keyof typeof sources]}
                    onChange={(e) => setSources({ ...sources, [source.key]: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-[#e8e4de] accent-indigo-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{source.icon}</span>
                      <p className="text-sm font-medium text-[#0a0a0a] group-hover:text-indigo-600 transition-colors">{source.label}</p>
                    </div>
                    <p className="text-[#6b7280] text-xs">{source.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment & Submit */}
          <div className="rounded-xl border border-[#e8e4de] bg-white p-6 mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] mb-4">Agent Gas Fee</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0a0a0a]">Pay Agent Gas Fees</p>
                <p className="text-xs text-[#6b7280]">Agents need MON to record findings on-chain. One-time payment covers all agent transactions for this case.</p>
              </div>
            </div>
            <PayButton onPaid={() => setPaid(true)} disabled={loading} />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!file || !paid || loading || Object.values(sources).every(v => !v)}
            className="w-full py-3 bg-[#0a0a0a] text-white rounded-full font-medium hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Dispatching Agents...
              </>
            ) : (
              <>
                Start Investigation
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
          {!connected && (
            <p className="text-center text-xs text-[#a8a29e] mt-3">Connect your wallet above to pay the agent gas fee and start the investigation</p>
          )}
          {connected && !paid && (
            <p className="text-center text-xs text-[#a8a29e] mt-3">Complete the payment above to unlock the investigation</p>
          )}
        </motion.div>
      </section>
    </main>
  );
}
