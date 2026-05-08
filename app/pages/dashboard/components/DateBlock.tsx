type Props = {
  label: string;
  value: string;
  accent?: boolean;
};

export function DateBlock({
  label,
  value,
  accent,
}: Props) {
  return (
    <div className="border border-border p-3">
      <div className="nothing-mono text-[9px] tracking-[0.22em] text-ink-mute uppercase">
        {label}
      </div>

      <div
        className="nothing-mono text-xs mt-1"
        style={{
          color: accent
            ? "var(--color-signal)"
            : "var(--color-ink)",
        }}
      >
        {value}
      </div>
    </div>
  );
}