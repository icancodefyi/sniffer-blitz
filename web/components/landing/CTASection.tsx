import Link from "next/link";

export function CTASection() {
  return (
    <section className="w-full bg-[#0a0a0a] py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 text-center">
        <h2 className="mb-6 font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.1] tracking-tight text-white">
          Ready to Take Action?
        </h2>
        <p className="mb-10 text-[17px] leading-[1.7] text-[#9ca3af]">
          Autonomous agents are ready to investigate. Upload your content and watch them work in real-time. Every action recorded on-chain. Every complaint ready to send.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/investigate"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            Start Investigation
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center rounded-full border border-[#3d3530] px-8 py-4 text-sm font-medium text-white transition-colors hover:border-white"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
