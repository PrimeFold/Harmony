export const ProjectLoader=()=>{
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="nothing-dotgrid absolute inset-0 opacity-40" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Scanline box */}
        <div className="nothing-scanline border border-hairline w-16 h-16 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="nothing-signal-dot nothing-blink" />
          </div>
        </div>

        {/* Label */}
        <div className="flex flex-col items-center gap-1">
          <span className="nothing-eyebrow text-signal">// loading</span>
          <span
            className="nothing-mono text-[9px] tracking-[0.28em] uppercase"
            style={{ color: "var(--color-ink-mute)" }}
          >
            fetching projects
          </span>
        </div>

        {/* Tick bar */}
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-6 h-0.5"
              style={{
                background: "var(--color-signal)",
                opacity: 0.2,
                animation: `nothing-blink 1.4s steps(1,end) infinite`,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}