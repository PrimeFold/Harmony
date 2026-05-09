import { Task } from "@/app/types/task";


type Props = {
  value: Task["status"];
  onChange: (s: Task["status"]) => void;
};

export function TaskStatusPicker({
  value,
  onChange,
}: Props) {
  return (
    <div>
      <label className="nothing-label">
        Status
      </label>

      <div className="flex gap-2">
        {(
          [
            "todo",
            "active",
            "completed",
          ] as Task["status"][]
        ).map((s) => {
          const sel = value === s;

          return (
            <button
              type="button"
              key={s}
              onClick={() =>
                onChange(s)
              }
              className="nothing-mono text-[11px] uppercase tracking-[0.16em] px-3 py-1.5 border flex-1"
              style={{
                borderColor: sel
                  ? "var(--color-signal)"
                  : "var(--color-border)",

                color: sel
                  ? "var(--color-signal)"
                  : "var(--color-ink-mute)",
              }}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}