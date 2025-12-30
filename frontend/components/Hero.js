export default function Hero({ onExplore }) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-[#0b1b36]" />
        <div className="absolute -top-28 left-1/2 -translate-x-1/2">
          <div className="h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.45),transparent_65%)] blur-3xl opacity-80 motion-safe:animate-[floatSlow_12s_ease-in-out_infinite]" />
        </div>
        <div className="absolute bottom-[-160px] right-[-40px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_60%)] blur-3xl opacity-70 motion-safe:animate-[floatSlow_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_45%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-20 md:pt-28">
        <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-200">
              Now Leasing Phase II
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl leading-tight drop-shadow-[0_12px_40px_rgba(15,23,42,0.6)] motion-safe:animate-[fadeUp_0.8s_ease-out]">
            Elevate Your
            <span className="mt-2 block text-amber-300">
              Professional Standards
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg md:text-xl text-slate-200 font-light leading-relaxed motion-safe:animate-[fadeUp_1s_ease-out]">
            Sunset Plaza curates executive office plateaux designed for modern
            businesses, where strategic location meets architectural prestige.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center motion-safe:animate-[fadeUp_1.1s_ease-out]">
            <button
              onClick={onExplore}
              className="rounded-full bg-amber-400 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-[0_18px_45px_rgba(251,191,36,0.35)] transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              View Available Spaces
            </button>

            <button className="rounded-full border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-amber-200/60 hover:text-amber-200">
              Ask AI Assistant
            </button>
          </div>

          <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Premium Suites", value: "25+" },
              { label: "Average ROI", value: "12.4%" },
              { label: "CBD Access", value: "5 min" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left backdrop-blur-sm"
              >
                <p className="text-2xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.35em] text-slate-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
