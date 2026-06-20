const STEPS = [
  {
    n: "01",
    title: "Upload Content",
    desc: "Victim uploads leaked image. Agents are dispatched to scan multiple sources.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    n: "02",
    title: "Agents Investigate",
    desc: "5 specialized agents scan, detect formats, and prepare complaints autonomously.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
      </svg>
    ),
  },
  {
    n: "03",
    title: "Get Certificate",
    desc: "Tamper-proof certificate with on-chain proof. Ready for takedowns and legal action.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full bg-[#fafaf9] py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a8a29e]">
            The Process
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.1] tracking-tight text-[#0a0a0a]">
            How It Works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="absolute top-12 left-full hidden h-px w-full bg-[#e8e4de] md:block" style={{ width: "calc(100% - 3rem)" }} />
              )}
              
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#e8e4de] bg-white text-[#6366f1]">
                  {step.icon}
                </div>
                
                {/* Number */}
                <span className="mb-3 font-mono text-[12px] font-medium text-[#c4bdb5]">{step.n}</span>
                
                {/* Title */}
                <h3 className="mb-3 text-[20px] font-semibold leading-snug text-[#0a0a0a]">{step.title}</h3>
                
                {/* Description */}
                <p className="text-[15px] leading-[1.7] text-[#6b7280]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
