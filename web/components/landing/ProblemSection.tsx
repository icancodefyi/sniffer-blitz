const PROBLEMS = [
  {
    n: "01",
    title: "Leaked content spreads in minutes.",
    desc: "Once intimate content is leaked, it spreads across dozens of platforms instantly. By the time you find it, it's already been shared, screenshot, and reuploaded across multiple domains.",
    stat: "500M+ non-consensual images in circulation",
  },
  {
    n: "02",
    title: "Each platform has different requirements.",
    desc: "Every platform requires a specific format for takedown requests. Email templates, web forms, API endpoints — each has its own process. Getting it wrong means your request gets ignored.",
    stat: "138+ platform formats mapped for you",
  },
  {
    n: "03",
    title: "Most victims never get it removed.",
    desc: "You need to know each platform's specific reporting format, the right contact for abuse teams, and how to establish forensic chain-of-custody — all while dealing with the trauma of it existing at all.",
    stat: "5 specialized agents work for you",
  },
];

export function ProblemSection() {
  return (
    <section className="w-full bg-white py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a8a29e]">
              The Reality
            </p>
            <h2
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.1] tracking-tight text-[#0a0a0a]"
              style={{ maxWidth: "520px" }}
            >
              Leaked content spreads in minutes.
              <br />
              You've been fighting it for months.
            </h2>
          </div>
          {/* Pull-quote stat */}
          <div className="border-l-2 border-red-300 pl-5" style={{ maxWidth: "240px" }}>
            <p className="font-mono text-[32px] font-bold leading-none text-[#0a0a0a]">500M+</p>
            <p className="mt-2 text-[13px] leading-snug text-[#6b7280]">
              non-consensual intimate images in circulation — the vast majority never removed
            </p>
          </div>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 border-t border-[#e8e4de] md:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <div
              key={p.n}
              className={[
                "flex flex-col gap-5 py-10",
                i < 2 ? "border-b border-[#e8e4de] md:border-b-0 md:border-r md:pr-12" : "",
                i > 0 ? "md:pl-12" : "",
              ].join(" ")}
            >
              <span className="font-mono text-[12px] font-medium text-[#c4bdb5]">{p.n}</span>
              <div>
                <h3 className="mb-3 text-[20px] font-semibold leading-snug text-[#0a0a0a]">{p.title}</h3>
                <p className="text-[15px] leading-[1.7] text-[#6b7280]">{p.desc}</p>
              </div>
              <div className="mt-auto border-t border-[#f0ece6] pt-5">
                <p className="font-mono text-[11.5px] text-[#a8a29e]">{p.stat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
