const AUDIENCES = [
  {
    title: "Victims",
    desc: "Get your content removed with agent-powered investigations and ready-to-send complaints.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    title: "Lawyers",
    desc: "On-chain evidence trails that hold up in court. Tamper-proof reports with blockchain verification.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: "Platforms",
    desc: "Verified reports with forensic evidence. Process takedowns faster with structured data.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    title: "Investigators",
    desc: "Autonomous agents that scan multiple sources. Real-time activity logs and on-chain audit trails.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
    ),
  },
];

export function AudienceSection() {
  return (
    <section className="w-full bg-white py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a8a29e]">
            Who It's For
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.1] tracking-tight text-[#0a0a0a]">
            Built For Everyone
          </h2>
        </div>

        {/* Audiences grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((audience) => (
            <div
              key={audience.title}
              className="group rounded-xl border border-[#e8e4de] bg-white p-6 text-center transition-all hover:border-indigo-400 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                {audience.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2 text-[18px] font-semibold leading-snug text-[#0a0a0a]">
                {audience.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] leading-[1.7] text-[#6b7280]">
                {audience.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
