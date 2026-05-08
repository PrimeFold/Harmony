type Props = {
  label: string;
  value: number | string;
};

export function Stat({ label, value }: Props) {
  return (
    <div>
      <div className="nothing-mono text-[10px] tracking-[0.18em] text-ink-mute uppercase">
        {label}
      </div>

      <div className="nothing-mono text-lg mt-1">
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}