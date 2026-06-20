import Link from "next/link";

export function ReportPreviewSection() {
  return (
    <section className="w-full bg-[#fafaf9] py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Copy */}
          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a8a29e]">
              The Output
            </p>
            <h2 className="mb-6 font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.1] tracking-tight text-[#0a0a0a]">
              Tamper-Proof
              <br />
              Investigation Report
            </h2>
            <p className="mb-8 text-[17px] leading-[1.7] text-[#6b7280]">
              Every investigation generates a comprehensive report stored on-chain. The report hash proves authenticity and can be verified by anyone — platforms, lawyers, or courts.
            </p>

            <ul className="mb-8 space-y-4">
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <p className="text-[15px] font-medium text-[#0a0a0a]">All findings with confidence scores</p>
                  <p className="text-[13px] text-[#6b7280]">Every match with domain, URL, and match confidence</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <p className="text-[15px] font-medium text-[#0a0a0a]">Platform-specific takedown formats</p>
                  <p className="text-[13px] text-[#6b7280]">Email templates, web forms, API endpoints</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <p className="text-[15px] font-medium text-[#0a0a0a]">Ready-to-send complaints</p>
                  <p className="text-[13px] text-[#6b7280]">Pre-formatted for each platform's requirements</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <p className="text-[15px] font-medium text-[#0a0a0a]">On-chain verification hash</p>
                  <p className="text-[13px] text-[#6b7280]">Immutable proof stored on Monad blockchain</p>
                </div>
              </li>
            </ul>

            <Link
              href="/investigate"
              className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-75"
            >
              Start Investigation
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Right: Report preview */}
          <div className="relative">
            <div className="rounded-xl border border-[#e8e4de] bg-white p-8 shadow-xl">
              {/* Report header */}
              <div className="mb-6 border-b border-[#e8e4de] pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a8a29e]">Report #1</p>
                    <h3 className="mt-1 font-serif text-2xl text-[#0a0a0a]">Investigation Report</h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                    <svg className="h-5 w-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-[#e8e4de] p-3 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29e]">Findings</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0a0a0a]">5</p>
                </div>
                <div className="rounded-lg border border-[#e8e4de] p-3 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29e]">Formats</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0a0a0a]">5</p>
                </div>
                <div className="rounded-lg border border-[#e8e4de] p-3 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29e]">Complaints</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0a0a0a]">3</p>
                </div>
              </div>

              {/* On-chain proof */}
              <div className="mb-6 rounded-lg border border-success/30 bg-success/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-4 w-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-success">On-Chain Proof</p>
                </div>
                <p className="font-mono text-[10px] text-[#6b7280] break-all">
                  0xf01a2d855a6d33b9d586cd22291bdf5507cb9fd4eaa28d3b56b2d6c0000ca60e
                </p>
              </div>

              {/* Sample finding */}
              <div className="rounded-lg border border-[#e8e4de] p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-[#0a0a0a]">mydesi.ltd</p>
                    <p className="font-mono text-[10px] text-[#6b7280]">https://mydesi.ltd/video/12345</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border bg-danger/20 text-danger border-danger/30">
                    92% match
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-indigo-100/50 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-success/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
