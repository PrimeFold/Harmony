import { Filter } from "../../page";

type Props = {
  filter: Filter;
  setFilter: (f: Filter) => void;
  sortBy: "expireAt" | "start" | "name";
  setSortBy: (s: "expireAt" | "start" | "name") => void;
  counts: Record<Filter, number>;
};
const PROJECT_STATUSES = ["active", "paused", "completed"] as const;
export function FilterBar({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  counts,
}: Props) {
  return (
    <section className="nothing-hairline-b">
      <div className="mx-auto max-w-7xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">

        <div className="flex flex-wrap gap-2">
          {(["all", ...PROJECT_STATUSES] as Filter[]).map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="nothing-mono text-[11px] uppercase tracking-[0.16em] px-3 py-1.5 border transition-colors"
                style={{
                  borderColor: isActive
                    ? "var(--color-signal)"
                    : "var(--color-border)",
                  color: isActive
                    ? "var(--color-signal)"
                    : "var(--color-ink-mute)",
                  background: isActive
                    ? "color-mix(in oklab, var(--color-signal) 8%, transparent)"
                    : "transparent",
                }}
              >
                {f} · {String(counts[f]).padStart(2, "0")}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="nothing-mono text-[10px] tracking-[0.18em] text-ink-mute uppercase">
            Sort
          </span>

          {(["expireAt", "start", "name"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="nothing-mono text-[11px] uppercase tracking-[0.16em] px-2 py-1"
              style={{
                color:
                  sortBy === s
                    ? "var(--color-ink)"
                    : "var(--color-ink-mute)",
                borderBottom:
                  sortBy === s
                    ? "1px solid var(--color-signal)"
                    : "1px solid transparent",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}