import Link from "next/link";
import { DateBlock } from "./DateBlock";
import { Stat } from "./Stat";
import { Project } from "@/app/types/project";


export function ProjectCard({ project }:{project:Project}) {
  return (
    <Link
      href={`/pages/dashboard/project/${project.id}`}
      className="bg-background p-6 group block transition-colors hover:bg-surface-2 nothing-card--bloom h-full"
    >
      <div className="flex items-start justify-between">
        <span className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute">
          {project.id.toUpperCase()}
        </span>
      </div>

      <h3 className="nothing-display text-2xl mt-8">
        {project.name}
      </h3>

      <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
        {project.description}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <DateBlock label="Created" value={project.createdAt} />
        <DateBlock label="Expires" value={project.expireAt} accent />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-6">
          <Stat label="Tasks" value={project.tasks.length} />
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