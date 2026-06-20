"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const COORDINATOR_URL = process.env.NEXT_PUBLIC_COORDINATOR_URL || "http://localhost:8000";

export default function InvestigatePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sources, setSources] = useState({ telegram: true, instagram: true, leak_domains: true });
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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

    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const imageHash = "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    const selectedSources = Object.entries(sources).filter(([, v]) => v).map(([k]) => k);

    try {
      const res = await fetch(`${COORDINATOR_URL}/investigate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_hash: imageHash, sources: selectedSources }),
      });
      const data = await res.json();
      if (data.case_id) {
        router.push(`/investigation/${data.case_id}`);
      }
    } catch (e) {
      console.error("Investigation failed:", e);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <span className="font-semibold text-lg">Sniffer</span>
          </Link>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-3">Start Investigation</p>
          <h1 className="font-serif text-4xl mb-2">Upload Content</h1>
          <p className="text-muted mb-8">Upload the leaked image. Agents will scan multiple sources and prepare takedown complaints.</p>

          {/* Upload Zone */}
          <div
            className={`rounded-xl border-2 border-dashed transition-colors mb-8 ${dragOver ? "border-accent bg-accent/5" : "border-border bg-surface"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="p-6">
                <div className="relative">
                  <img src={preview} alt="Upload preview" className="w-full max-h-64 object-contain rounded-lg" />
                  <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>
                <p className="text-center text-muted text-sm mt-3">{file?.name}</p>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center py-16 cursor-pointer">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted mb-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p className="text-sm font-medium mb-1">Drop image here or click to upload</p>
                <p className="text-muted text-xs">PNG, JPG, WEBP up to 10MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
            )}
          </div>

          {/* Source Selection */}
          <div className="rounded-xl border border-border bg-surface p-6 mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-4">Select Sources</p>
            <div className="space-y-3">
              {[
                { key: "telegram", label: "Telegram Scanner", desc: "Scan Telegram channels for leaked content" },
                { key: "instagram", label: "Instagram Scanner", desc: "Scan Instagram for leaked content" },
                { key: "leak_domains", label: "Leak Domain Scanner", desc: "Scan known leak domains (mydesi.ltd, fsiblog.pro, etc.)" },
              ].map((source) => (
                <label key={source.key} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={sources[source.key as keyof typeof sources]}
                    onChange={(e) => setSources({ ...sources, [source.key]: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-border accent-accent"
                  />
                  <div>
                    <p className="text-sm font-medium group-hover:text-accent transition-colors">{source.label}</p>
                    <p className="text-muted text-xs">{source.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!file || loading || Object.values(sources).every(v => !v)}
            className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Dispatching Agents...
              </>
            ) : (
              "Start Investigation"
            )}
          </button>
        </motion.div>
      </section>
    </main>
  );
}
