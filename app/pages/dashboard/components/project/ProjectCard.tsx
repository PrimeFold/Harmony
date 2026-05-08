import Link from "next/link";

import {
  statusPillClass,
  type Project,
} from "@/lib/halftone-data";
import { DateBlock } from "./DateBlock";
import { Stat } from "./Stat";



type Props = {
  project: Project;
};

export function ProjectCard({ project: p }: Props) {
  return (
    <Link
      href={`/project/${p.id}`}
      className="bg-background p-6 group block transition-colors hover:bg-surface-2 nothing-card--bloom h-full"
    >
      <div className="flex items-start justify-between">
        <span className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute">
          {p.id.toUpperCase()}
        </span>

        <span className={statusPillClass(p.status)}>
          {p.status === "active" && (
            <span className="nothing-blink">●</span>
          )}

          {p.status}
        </span>
      </div>

      <h3 className="nothing-display text-2xl mt-8">
        {p.name}
      </h3>

      <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
        {p.description}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <DateBlock label="Start" value={p.start} />
        <DateBlock label="Deadline" value={p.deadline} accent />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-6">
          <Stat label="Tasks" value={p.tasks.length} />
          <Stat label="Members" value={p.members} />
        </div>

        <span
          className="nothing-mono text-xs uppercase tracking-[0.18em] opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--color-signal)" }}
        >
          Open ↗
        </span>
      </div>
    </Link>
  );
}